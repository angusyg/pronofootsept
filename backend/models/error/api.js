/**
 * Api error class module to create and convert error to json response
 * @module models/error/api
 */

const kindOf = require('kindof');

const ns = 'models:error:api';
const { debug, logger } = require('../../helpers/logger')(ns);

/**
 * The built-in class for creating error object
 * @external Error
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error
 */

/**
 * Creates a new ApiError
 * @class
 * @extends external:Error
 * @name ApiError
 * @param {Error|string} [arg] Error to convert or string key of endpoint error
 */
class ApiError extends Error {
  constructor(...args) {
    super('An unknown server error occured while processing request');
    /**
     * Name of the error
     * @default ApiError
     * @member {string}
     */
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);

    /**
     * Code of the error
     * @default INTERNAL_ERROR
     * @member {string}
     */
    this.code = 'INTERNAL_ERROR';

    /**
     * HTTP status code of the response to be send
     * @default 500
     * @member {number}
     */
    this.statusCode = 500;
    if (args.length === 1) {
      const type = kindOf(args[0]);
      if (type === 'error') this.message = args[0].message;
      else if (type === 'string') this.message = args[0];
      else if (type === 'array' && args[0].length === 2) {
        this.code = args[0][0];
        this.message = args[0][1];
      } else throw new TypeError(`Invalid type '${type}' for new ApiError argument`);
    } else if (args.length === 2) {
      let type = kindOf(args[0]);
      if (type === 'string') this.code = args[0];
      else throw new TypeError(`Invalid type '${type}' for new ApiError first argument`);
      type = kindOf(args[1]);
      if (type === 'string') this.message = args[1];
      else throw new TypeError(`Invalid type '${type}' for new ApiError second argument`);
    }
  }

  /**
   * Check error type and if needed convert it to ApiError before sending it in response
   * @function handle
   * @static
   * @param  {Request}  req - Request received
   * @param  {Response} res - Response to be send
   * @param  {Error}    err - Error to handle
   */
  static handle(req, res, err) {
    if (err instanceof ApiError) err.send(req, res);
    else new ApiError(err).send(req, res);
  }

  /**
   * Creates response depending on ApiError configuration
   * @function send
   * @param  {Request}  req - Request received
   * @param  {Response} res - Response to be send
   */
  send(req, res) {
    const err = {
      code: this.code,
      message: this.message,
      reqId: req.id,
    };
    res.status(this.statusCode).json(err);
    logger.error(`${ns}:send: sending error : ${JSON.stringify(err)}`);
  }
}

module.exports = ApiError;
