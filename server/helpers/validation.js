var validator = require('validator');
var status = require('../config/status.js');

function password(value, language) {
  if (typeof value != 'string') {
    return { message: status.PASSWORD_INVALID[language].message, status: status.PASSWORD_INVALID.code }
  }
  if (value.length < 7) {
    return { message: status.PASSWORD_TOO_SHORT[language].message, status: status.PASSWORD_TOO_SHORT.code }
  }
  return false;
}
function person_name(value) {
  console.log(value);
  if (typeof value != 'string' || value.trim().length == 0) {
    console.log(4);
    return true;
  }
  return false;
}
function email(value, language) {
  if (typeof value != 'string' || !validator.isEmail(value)) {
    return { message: status.EMAIL_INVALID[language].message, status: status.EMAIL_INVALID.code }
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
