/**
 * Creates an authentication expired error
 * @module models/error/authexpired
 */

const ApiError = require('./api');

const ns = 'models:error:authexpired';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Creates an AuthenticationExpiredError
 * @class
 * @extends {ApiError}
 */
class AuthenticationExpiredError extends ApiError {
  constructor() {
    super('AUTHENTICATION_EXPIRED', 'Access token has expired');

    /**
     * Name of the error
     * @default AuthenticationExpiredError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 419
     * @member {number}
     */
    this.statusCode = 419;

    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = AuthenticationExpiredError;
