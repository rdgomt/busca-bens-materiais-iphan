import { takeLatest, put, call, all } from 'redux-saga/effects'
import { kml } from '@tmcw/togeojson'
import bbox from '@turf/bbox'
import { Types } from 'store/ducks/inputFile'
import { Types as intersectDataTypes } from 'store/ducks/intersectData'
import { notifyError } from 'utils/notify'

const readFile = file => new Promise((resolve, reject) => {
  const reader = new FileReader()
  reader.onload = () => resolve(reader.result)
  reader.onerror = error => reject(error)
  reader.readAsBinaryString(file)
})

function* load(action) {
  try {
    const file = yield call(readFile, action.payload[0])
    const xml = new DOMParser().parseFromString(file, 'text/xml')
    const geojson = kml(xml)
    let fileIsValid = true
    yield all(geojson.features.map(feature => {
      if (feature.geometry.type !== 'Polygon') {
        fileIsValid = false
      }
      return null
    }))
    if (fileIsValid) {
      const bounds = bbox(geojson)
      yield put({
        type: Types.LOAD_FILE_SUCCEEDED,
        payload: {
          geojson,
          bounds,
        },
      })
      yield put({
        type: intersectDataTypes.FETCH_INTERSECT_DATA_REQUESTED,
        payload: bounds,
      })
    } else {
      yield notifyError('Importe um KML com um ou mais polígonos.')
      yield put({ type: Types.LOAD_FILE_FAILED, payload: 'Importe um KML com um ou mais polígonos.' })
    }
  } catch (err) {
    yield notifyError('Erro ao importar arquivo. Tente novamente.')
    yield put({ type: Types.LOAD_FILE_FAILED, payload: 'Erro ao importar arquivo. Tente novamente.' })
  }
}

export const inputFileSagas = [
  takeLatest(Types.LOAD_FILE_REQUESTED, load),
]
