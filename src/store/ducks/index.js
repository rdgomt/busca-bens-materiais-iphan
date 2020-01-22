import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import inputFile from 'store/ducks/inputFile'
import intersectData from 'store/ducks/intersectData'

const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  inputFile,
  intersectData,
})

export default createRootReducer
