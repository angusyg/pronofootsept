/**
 * User class module
 * @module models/user
 * @requires camo
 * @requires bcrypt
 * @requires config/app
 */

const { Document } = require('camo');
const bcrypt = require('bcrypt');
const config = require('../config/app');

class User extends Document {
  constructor() {
    super();

    this.login = {
      type: String,
      unique: true,
      required: true,
    };
    this.password = {
      type: String,
      required: true,
    };
    this.roles = [String];
    this.refreshToken = {
      type: String,
      default: '',
    };
  }

  comparePassword(candidatePassword) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(candidatePassword, this.password)
        .catch(err => reject(err))
        .then(match => resolve(match));
    });
  }

  preSave() {
    this.password = bcrypt.hashSync(this.password, config.saltFactor);
  }
}

module.exports = User;
