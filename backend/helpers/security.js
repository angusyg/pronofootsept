/**
 * Security middlewares to check user authorizations
 * @module helpers/security
 * @requires external:jsonwebtoken
 * @requires util
 * @requires continuation-local-storage
 * @requires config/api
 * @requires models/error/authexpired
 * @requires models/error/unauthorizedaccess
 * @requires models/error/unauthorizedoperation
 */

const jsonwebtoken = require('jsonwebtoken');
const util = require('util');
const {
  accessTokenHeader,
  refreshTokenHeader,
  tokenSecretKey,
  refreshPath,
} = require('../config/api');
const AuthenticationExpiredError = require('../models/error/authexpired');
const UnauthorizedAccessError = require('../models/error/unauthorizedaccess');
const UnauthorizedOperationError = require('../models/error/unauthorizedoperation');

const jwtVerify = util.promisify(jsonwebtoken.verify);

const security = {};

/**
 * Checks if a JWT Token is present and verify it
 * @method requiresLogin
 * @param  {Request}        req  - Request received
 * @param  {Response}       res  - Response to be send
 * @param  {nextMiddleware} next - Callback to pass control to next middleware
 */
security.requiresLogin = async (req, res, next) => {
  if (req.headers && req.headers[accessTokenHeader] && req.headers[accessTokenHeader].split(' ')[0] === 'Bearer') {
    try {
      const decode = await jwtVerify(req.headers[accessTokenHeader].split(' ')[1], tokenSecretKey);
      req.user = decode;
      next();
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        if (req.route.path === refreshPath) {
          req.user = jsonwebtoken.decode(req.headers[accessTokenHeader].split(' ')[1]);
          req.refresh = req.headers[refreshTokenHeader];
          next();
        } else next(new AuthenticationExpiredError());
      } else next(new UnauthorizedAccessError());
    }
  } else next(new UnauthorizedAccessError());
};

/**
 * Checks if user has permission to call endpoint
 * @callback checkPermission
 * @param  {Request}          req  - Request received
 * @param  {Response}         res  - Response to be send
 * @param  {nextMiddleware}   next - Callback to pass control to next middleware
 */

/**
 * Call middleware with user request permissions
 * @function requiresPermission
 * @param  {string[]}         permissions - Array of permissions to call the endpoint
 * @return {checkPermission}  Middleware to check if user has permission to call endpoint
 */
security.requiresPermission = permissions => (req, res, next) => {
  if (permissions.length === 0) next();
  else if (req.user && permissions.some(permission => req.user.permissions.includes(permission))) next();
  else next(new UnauthorizedOperationError());
};

module.exports = security;
