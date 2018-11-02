const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand(dotenv.config());

const express = require('express');
const webpack = require('webpack');
const bodyParser = require('body-parser');
const middleware = require('webpack-dev-middleware');
const path = require('path');
const cors = require('cors');
const authenticationRequired = require('./utils/authenticationRequired');

const webpackOptions = require('../build/webpack.dev.config');
const compiler = webpack(webpackOptions);

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = require('./routes/api');
app.use('/api', authenticationRequired, apiRouter);

app.use(middleware(compiler));
app.use(express.static(path.join(__dirname, '../public')));

// serve static application
app.get('/', (req, res) => {
    console.log(__dirname)
    res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});


app.listen(process.env.PORT, () => {
    console.log(`Server listening on port ${process.env.PORT}`);
});
