import { createStore, compose, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import tron from 'config/Reactotron'
import { routerMiddleware } from 'connected-react-router'
import { createBrowserHistory } from 'history'
import createRootReducer from 'store/ducks'
import sagas from 'store/sagas'

export const history = createBrowserHistory()

const middlewares = [
  routerMiddleware(history),
]

const sagaMonitor = process.env.NODE_ENV === 'development' ? tron.createSagaMonitor() : null
const sagaMiddleware = createSagaMiddleware({ sagaMonitor })
middlewares.push(sagaMiddleware)

const composer = process.env.NODE_ENV === 'development'
  ? compose(
    applyMiddleware(...middlewares),
    tron.createEnhancer(),
  )
  : compose(
    applyMiddleware(...middlewares),
  )

const store = createStore(createRootReducer(history), composer)

sagaMiddleware.run(sagas)

export default store
