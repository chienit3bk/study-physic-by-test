const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid');
const config = require('../config/appconfig');

const app = express();
app.set('config', config);
app.use(bodyParser.json());

app.use(cors());

app.set('db', require('../models/index.js'));

app.set('port', process.env.PORT);

app.use(require('../routes'));

module.exports = app;
