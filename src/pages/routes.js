import React from 'react'
import { Provider } from 'react-redux'
import { Switch, Route, Redirect } from 'react-router-dom'
import { ConnectedRouter } from 'connected-react-router'
import Home from 'pages/Home'
import store, { history } from 'store'

export default () => (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div className="app">
        <Switch>
          <Route exact path="/" component={Home} />
          <Redirect from="*" to="/" />
        </Switch>
      </div>
    </ConnectedRouter>
  </Provider>
)
