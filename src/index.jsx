import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import { Security, ImplicitCallback, SecureRoute } from '@okta/okta-react'
import Editor from './pages/Editor'
import reducers from './reducers'
import preloadedState from './reducers/preloadedState'

const redirectUri = process.env.AUTH_CALLBACK_URL
const issuer = `${process.env.OKTA_ORG_URL}${process.env.OKTA_ISSUER_PATH}`

const store = createStore(reducers, preloadedState, devToolsEnhancer())

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Security
          issuer={issuer}
          client_id={process.env.OKTA_CLIENT_ID}
          redirect_uri={redirectUri}
        >
          <Route exact path={process.env.CALLBACK_PATH} component={ImplicitCallback} />
          <SecureRoute path="/" component={Editor} />
        </Security>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
)
