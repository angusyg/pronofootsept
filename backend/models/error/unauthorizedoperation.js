/**
 * Unauthorized operation error class module to create and convert error to json response
 * @module models/error/unauthorizedoperation
 */

const ApiError = require('./api');

const ns = 'models:error:unauthorizedoperation';
const { debug } = require('../../helpers/logger')(ns);

/**
 * Creates an UnauthorizedOperationError
 * @class
 * @extends {ApiError}
 */
class UnauthorizedOperationError extends ApiError {
  constructor(...args) {
    if (args.length > 0) super(args);
    else super('NOT_AUTHORIZED_OPERATION', 'Not authorized to perform operation on this endpoint');

    /**
     * Name of the error
     * @default UnauthorizedOperationError
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

module.exports = UnauthorizedOperationError;
