var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');

module.exports = {
  signup: function(req, res, next) {
    var invalidFirstName = validationHelper.person_name(req.body.first_name);
    var invalidLastName = validationHelper.person_name(req.body.last_name);
    var invalidPassword = validationHelper.password(req.body.password, req.language);
    var invalidEmail = validationHelper.email(req.body.email, req.language);

    if (invalidFirstName) {
      return res.status(406).send({ message: status.FIRST_NAME_INVALID[req.language].message, status: status.FIRST_NAME_INVALID.code });
    }
    if (invalidLastName) {
      return res.status(406).send({ message: status.LAST_NAME_INVALID[req.language].message, status: status.LAST_NAME_INVALID.code });
    }
    if (invalidEmail) {return res.status(406).send(invalidEmail);}
    if (invalidPassword) {return res.status(406).send(invalidPassword);}
    if (req.body.password !== req.body.password_again) {
      return res.status(406).send({ message: status.PASSWORDS_DO_NOT_MATCH[req.language].message, status: status.PASSWORDS_DO_NOT_MATCH.code });
    }


    req.body.email = req.body.email.toLowerCase();
    next();
  },
  login: function(req, res, next) {
    var invalidPassword = validationHelper.password(req.body.password, req.language);
    var invalidEmail = validationHelper.email(req.body.email, req.language);

    if (invalidEmail) {return res.status(406).send(invalidEmail);}
    if (invalidPassword) {return res.status(406).send(invalidPassword);}
    next();
  }
}
