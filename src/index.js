import React from 'react'
import ReactDOM from 'react-dom'
import Routes from 'pages/routes'
import { toast } from 'react-toastify'
import 'index.css'
import 'react-toastify/dist/ReactToastify.min.css'
import 'react-activity/lib/Spinner/Spinner.css'

toast.configure()

if (process.env.NODE_ENV === 'development') {
  require('config/Reactotron')
}

ReactDOM.render(<Routes />, document.getElementById('root'))
