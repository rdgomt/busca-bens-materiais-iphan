import { takeLatest, put, call } from 'redux-saga/effects'
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

export const intersectDataSagas = [
  takeLatest(Types.FETCH_INTERSECT_DATA_REQUESTED, fetchIntersectData),
]

const CORS_PREFIX = 'https://cors-anywhere.herokuapp.com/'
const BENS_MATERIAIS_IPHAN = 'http://portal.iphan.gov.br/geoserver/SICG/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SICG:tg_bem_classificacao&outputFormat=application%2Fjson'
const BENS_IMATERIAIS_IPHAN = 'http://portal.iphan.gov.br/geoserver/SICG/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=SICG:tg_bem_imaterial&outputFormat=application%2Fjson'
