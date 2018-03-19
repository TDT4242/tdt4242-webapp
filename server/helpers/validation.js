var validator = require('validator');
var status = require('../config/status.js');
var help = require('../helpers/help.js');

function password(value, language) {
  if (typeof value != 'string') {
    return help.sendError(language, 'PASSWORD_INVALID');
  }
  if (value.length < 7) {
    return help.sendError(language, 'PASSWORD_TOO_SHORT');
  }
  return false;
}
function person_name(value) {
  if (typeof value != 'string' || value.trim().length == 0 || !validator.isAlpha(value)) {
    return true;
  }
  return false;
}
function email(value, language) {
  if (typeof value != 'string' || !validator.isEmail(value)) {
    return help.sendError(language, 'EMAIL_INVALID');
  }
  return false;
}
function product_name(value) {
  if (typeof value != 'string' || value.trim().length == 0) {
    return true;
  }
  return false;
}

function mongo_id(value) {
  if (typeof value != 'string' || !validator.isMongoId(value)) {
    return false;
  }
  return true;
}

module.exports = {
  password: password,
  person_name: person_name,
  product_name: product_name,
  email: email,
  mongo_id: mongo_id
}
