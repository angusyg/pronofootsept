/**
 * API configuration
 * @module config/api
 */

module.exports = {
  base: '/api',
  tokenSecretKey: process.env.TOKEN_SECRET || 'DEV-JWTSecret',
  accessTokenHeader: 'authorization',
  accessTokenExpirationTime: 60 * 10,
  refreshTokenHeader: 'refresh',
  refreshTokenExpirationTime: 60 * 60 * 24,
  refreshPath: '/refresh',
  loginPath: '/login',
  logoutPath: '/logout',
  loggerPath: '/log/:level',
};
