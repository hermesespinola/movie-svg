import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react'
import Editor from './pages/Editor'
import Dashboard from './pages/Dashboard'
import reducers from './reducers'

const redirectUri = process.env.AUTH_CALLBACK_URL
const issuer = `${process.env.OKTA_ORG_URL}${process.env.OKTA_ISSUER_PATH}`

const store = createStore(reducers, devToolsEnhancer())

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Security
          issuer={issuer}
          client_id={process.env.OKTA_CLIENT_ID}
          redirect_uri={redirectUri}
        >
          <Switch>
            <Route exact path={process.env.CALLBACK_PATH} component={ImplicitCallback} />
            <SecureRoute exact path="/" component={Dashboard} />
            <SecureRoute exact path="/editor" component={Editor} />
            <SecureRoute path="/editor/:id" component={Editor} />
          </Switch>
        </Security>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
)
