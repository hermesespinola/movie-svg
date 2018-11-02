import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route } from 'react-router-dom'
import App from './App'
import './css/index.css'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { devToolsEnhancer } from 'redux-devtools-extension'
import reducers from './reducers'
import preloadedState from './reducers/preloadedState'

const redirectUri = process.env.AUTH_CALLBACK_URL
const issuer = `${process.env.OKTA_ORG_URL}${process.env.OKTA_ISSUER_PATH}`

const store = createStore(reducers, preloadedState, devToolsEnhancer())

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
        <Route path="/" component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root'),
)
