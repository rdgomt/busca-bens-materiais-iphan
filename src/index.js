import React from 'react'
import ReactDOM from 'react-dom'
import Routes from 'pages/routes'
import 'index.css'

if (process.env.NODE_ENV === 'development') {
  require('config/Reactotron')
}

ReactDOM.render(<Routes />, document.getElementById('root'))
