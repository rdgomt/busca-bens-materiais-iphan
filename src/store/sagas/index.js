import { all } from 'redux-saga/effects'
import { inputFileSagas } from 'store/sagas/inputFile'
import { intersectDataSagas } from 'store/sagas/intersectData'

export default function* rootSaga() {
  yield all([
    ...inputFileSagas,
    ...intersectDataSagas,
  ])
}
