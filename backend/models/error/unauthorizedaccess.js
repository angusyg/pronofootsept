/**
 * Unauthorized access error class module to create and convert error to json response
 * @module models/error/unauthorizedaccess
 */

const ApiError = require('./api');

const ns = 'models:error:unauthorizedaccess';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Creates an UnauthorizedAccessError
 * @class
 * @extends {ApiError}
 */
class UnauthorizedAccessError extends ApiError {
  constructor(...args) {
    if (args.length > 0) super(args);
    else super('NOT_AUTHORIZED_ACCESS', 'Not authorized to access to this endpoint');

    /**
     * Name of the error
     * @default UnauthorizedAccessError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * HTTP status code of the response to be send
     * @default 401
     * @member {number}
     */
    this.statusCode = 401;

    debug(`${ns}:new: created '${JSON.stringify(this)}'`);
  }
}

module.exports = UnauthorizedAccessError;
