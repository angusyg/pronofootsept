/**
 * App API router
 * @module controllers/api
 * @requires express
 * @requires config/api
 * @requires models/endpoint
 * @requires services/users
 * @requires helpers/logger
 */

const express = require('express');
const security = require('../helpers/security');
const { logger } = require('../helpers/logger')();
const { loginPath, logoutPath, loggerPath, refreshPath } = require('../config/api');
const userService = require('../services/users');

const router = express.Router();

router.post(loggerPath, (req, res) => {
  logger[req.params.level](JSON.stringify(req.body));
  res.status(204).end();
});

router.post(loginPath, (req, res, next) => {
  userService.login(req.body)
    .catch(err => next(err))
    .then(tokens => res.status(200).json(tokens));
});

router.get(logoutPath, security.requiresLogin, (req, res) => res.status(204).end());

router.get(refreshPath, security.requiresLogin, (req, res, next) => {
  userService.refreshToken(req.user, req.refresh)
    .catch(err => next(err))
    .then(token => res.status(200).json(token));
});

module.exports = router;
