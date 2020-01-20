import Reactotron from 'reactotron-react-js'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

const tron = Reactotron
  .use(reactotronRedux())
  .use(sagaPlugin())
  .connect()

tron.clear()

console.tron = tron

export default tron
