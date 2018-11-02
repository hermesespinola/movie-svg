const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv.config());

const axios = require('axios');
const express = require('express');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const middleware = require('webpack-dev-middleware');
const path = require('path');
const cors = require('cors');

const webpackOptions = require('../build/webpack.dev.config');
const compiler = webpack(webpackOptions);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configure okta middleware
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
}));
const oidc = new ExpressOIDC({
    issuer: process.env.AUTH_ISSUER,
    client_id: process.env.OKTA_CLIENT_ID,
    client_secret: process.env.OKTA_CLIENT_SECRET,
    redirect_uri: process.env.AUTH_CALLBACK_URL,
    scope: 'openid profile'
});
app.use(oidc.router);

const logoutURL = process.env.LOGOUT_URL;
app.use('/logout', oidc.ensureAuthenticated({
    redirectTo: '/login',
    returnTo: '/',
}), (req, res) => {
    const { id_token } = req.userContext.tokens;
    axios.get(logoutURL, { params: { id_token_hint: id_token } })
        .then(response => {
            req.session.destroy();
            res.redirect('/');
        });
});

const apiRouter = require('./routes/api')(oidc);
app.use('/api', apiRouter);
app.use(middleware(compiler));
app.use(express.static(path.join(__dirname, '../public')));

// serve static application if loggedin
app.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

oidc.on('ready', () => {
    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
});
  
oidc.on('error', err => {
    console.log('Unable to configure ExpressOIDC', err);
});
