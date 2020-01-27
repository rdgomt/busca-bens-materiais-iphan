import { takeLatest, put, call, select } from 'redux-saga/effects'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import { Types } from 'store/ducks/intersectData'
import { notifyError } from 'utils/notify'

const fetchJson = async url => {
  const response = await fetch(url)
  const data = await response.json()
  return data
}

const formatBensImateriaisPoints = geojson => {
  const bensImateriaisPoints = {}
  bensImateriaisPoints.type = 'FeatureCollection'
  bensImateriaisPoints.features = geojson.features.map(i => ({
    type: 'Feature',
    geometry: i.geometry,
    properties: {
      ...i.properties,
      geometria_poligono: null,
    },
  }))
  return bensImateriaisPoints
}

const formatBensImateriaisPolygons = geojson => {
  const bensImateriaisPolygons = {}
  bensImateriaisPolygons.type = 'FeatureCollection'
  bensImateriaisPolygons.features = geojson.features.map(i => ({
    type: 'Feature',
    geometry: i.properties.geometria_poligono,
    properties: {
      ...i.properties,
      geometria_poligono: null,
    },
  }))
  return bensImateriaisPolygons
}

function* fetchIntersectData(action) {
  try {
    const bounds = action.payload

    const bensMateriais = yield call(
      fetchJson,
      `${CORS_PREFIX}${BENS_MATERIAIS_IPHAN}&CQL_FILTER=BBOX(ponto, ${bounds})`,
    )

    const bensImateriais = yield call(
      fetchJson,
      `${CORS_PREFIX}${BENS_IMATERIAIS_IPHAN}&CQL_FILTER=BBOX(geometria_poligono, ${bounds})`,
    )

    const bensImateriaisPoints = yield call(formatBensImateriaisPoints, bensImateriais)

    /* const bensImateriaisPolygons = yield call(formatBensImateriaisPolygons, bensImateriais) */

    const data = {
      bensMateriais,
      bensImateriais: {
        points: bensImateriaisPoints,
        /* polygons: bensImateriaisPolygons, */
      },
    }

    yield put({
      type: Types.FETCH_INTERSECT_DATA_SUCCEEDED,
      payload: data,
    })
  } catch (err) {
    yield put({
      type: Types.FETCH_INTERSECT_DATA_FAILED,
      payload: 'Erro ao carregar dados externos.',
    })
    yield notifyError('Erro ao carregar dados externos. Tente novamente.')
  }
}

const createWorkbookFile = async workbook => {
  try {
    const data = await workbook.xlsx.writeBuffer()
    const blob = new Blob([data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })
    saveAs(blob, 'SitusArqueologia.xlsx')
  } catch (err) {
    console.tron.log('err', err)
  }
}

function* exportIntersectData() {
  const data = yield select(state => state.intersectData.data)
  const bensMateriaisTotal = data.bensMateriais.features.length
  const bensImateriaisTotal = data.bensImateriais.points.features.length

  const workbook = new ExcelJS.Workbook()
  workbook.creator = 'Situs Arqueologia'

  if (bensMateriaisTotal > 0) {
    const bensMateriaisSheet = workbook.addWorksheet('Bens Materiais')
    const keys = [
      ...Object.keys(data.bensMateriais.features[0].properties),
      'latitude',
      'longitude',
    ]
    const columns = keys.map(key => ({
      header: key,
      key,
      width: 25,
    }))
    bensMateriaisSheet.columns = columns
    const rows = data.bensMateriais.features.map(feature => ({
      ...feature.properties,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    }))
    bensMateriaisSheet.addRows(rows)
  }

  if (bensImateriaisTotal > 0) {
    const bensImateriaisSheet = workbook.addWorksheet('Bens Imateriais')
    const keys = [
      ...Object.keys(data.bensImateriais.points.features[0].properties),
      'latitude',
      'longitude',
    ]
    const columns = keys.map(key => ({
      header: key,
      key,
      width: 25,
    }))
    bensImateriaisSheet.columns = columns
    const rows = data.bensImateriais.points.features.map(feature => ({
      ...feature.properties,
      latitude: feature.geometry.coordinates[1],
      longitude: feature.geometry.coordinates[0],
    }))
    bensImateriaisSheet.addRows(rows)
  }

  yield call(createWorkbookFile, workbook)
}

export const intersectDataSagas = [
  takeLatest(Types.FETCH_INTERSECT_DATA_REQUESTED, fetchIntersectData),
  takeLatest(Types.EXPORT_INTERSECT_DATA_REQUESTED, exportIntersectData),
]

const CORS_PREFIX = 'https://cors-anywhere.herokuapp.com/'
const BENS_MATERIAIS_IPHAN = 'http://portal.iphan.gov.br/geoserver/SICG/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SICG:tg_bem_classificacao&outputFormat=application%2Fjson'
const BENS_IMATERIAIS_IPHAN = 'http://portal.iphan.gov.br/geoserver/SICG/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SICG:tg_bem_imaterial&outputFormat=application%2Fjson'
