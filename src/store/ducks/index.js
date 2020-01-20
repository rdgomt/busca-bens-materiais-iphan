import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
import inputFile from 'store/ducks/inputFile'

const createRootReducer = history => combineReducers({
  router: connectRouter(history),
  inputFile,
})

export default createRootReducer
