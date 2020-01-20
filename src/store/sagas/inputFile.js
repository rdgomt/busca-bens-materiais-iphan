import { takeLatest, put, call } from 'redux-saga/effects'
import { kml } from '@tmcw/togeojson'
import { Types } from 'store/ducks/inputFile'

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
    yield put({ type: Types.LOAD_FILE_SUCCEEDED, payload: geojson })
  } catch (err) {
    yield put({ type: Types.LOAD_FILE_FAILED, payload: 'Erro ao carregar arquivo.' })
  }
}

export const inputFileSagas = [
  takeLatest(Types.LOAD_FILE_REQUESTED, load),
]
