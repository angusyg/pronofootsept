const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const compression = require('compression');
const pino = require('express-pino-logger');
const uuidv4 = require('uuid/v4');
const helmet = require('helmet');
const cors = require('cors');
const errorHandler = require('./helpers/errorhandler');
const apiController = require('./controllers/api');
const appConfig = require('./config/app');
const dbConfig = require('./config/db');
const { logger } = require('./helpers/logger')();

const app = express();

// Connection to db
dbConfig();

// logger
app.use(pino({
  logger,
  genReqId: () => uuidv4(),
}));

app.use(helmet());
app.use(cors(appConfig.crossOrigin));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true,
}));

// Static files
if (process.env.NODE_ENV === 'production') {
  app.use(compression());
  app.use(express.static(path.join(__dirname, '..', 'web')));
}

// map modules routes
app.use('/api', apiController);

app.use(errorHandler.errorNoRouteMapped);
app.use(errorHandler.errorHandler);

app.listen(appConfig.port);
