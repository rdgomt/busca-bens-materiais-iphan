import { all } from 'redux-saga/effects'
import { inputFileSagas } from 'store/sagas/inputFile'

export default function* rootSaga() {
  yield all([
    ...inputFileSagas,
  ])
}
