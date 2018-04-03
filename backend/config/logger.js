/**
 * App logger configuration
 * @module config/logger
 * @requires path
 */

const path = require('path');
const fs = require('fs');

const logFolder = path.join(__dirname, '..', '..', 'logs');
if (!fs.existsSync(logFolder)) fs.mkdirSync(logFolder);

module.exports = {
  logFile: path.join(logFolder, 'server.log'),
  logLevel: process.env.LOG_LEVEL || 'info',
  debugFile: path.join(logFolder, 'debug.log'),
  debugLevel: 'debug',
  debugBaseNs: 'nean:',
  debugMapNs: {
    'nean:*': 'debug',
  },
};
