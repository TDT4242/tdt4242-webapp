var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');
var help = require('../../helpers/help.js');

module.exports = {
  signup: function(req, res, next) {
    var invalidFirstName = validationHelper.person_name(req.body.first_name);
    var invalidLastName = validationHelper.person_name(req.body.last_name);
    var invalidPassword = validationHelper.password(req.body.password, req.language);
    var invalidEmail = validationHelper.email(req.body.email, req.language);

    if (invalidFirstName) {
      return res.status(406).send(help.sendError(req.language, 'FIRST_NAME_INVALID'));
    }
    if (invalidLastName) {
      return res.status(406).send(help.sendError(req.language, 'LAST_NAME_INVALID'));
    }
    if (invalidEmail) {return res.status(406).send(invalidEmail);}
    if (invalidPassword) {return res.status(406).send(invalidPassword);}
    if (req.body.password !== req.body.password_again) {
      return res.status(406).send(help.sendError(req.language, 'PASSWORDS_DO_NOT_MATCH'));
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
