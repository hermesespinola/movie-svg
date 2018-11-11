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

const MongoClient = require('mongodb').MongoClient

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = require('./routes/api');

app.use(middleware(compiler));

// serve static application
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});
app.get('/implicit/callback', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public', 'index.html'));
});

MongoClient.connect(process.env.MONGO_URI, { useNewUrlParser: true }, (err, client) => {
  if (err) return console.log(err);

  const db = client.db(process.env.DB_NAME);
  const animCollection = db.collection('animations');
  app.use('/api', authenticationRequired, apiRouter(animCollection));

  app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT}`);
  });
})
