var bcrypt = require('bcryptjs');
var moment = require('moment');
var jwt = require('jwt-simple');
var config = require('../../config/config.js');
var validator = require('validator');
var status = require('../../config/status.js');

module.exports = {
  ensureAuthenticated: function(req, res, next){
    var token_alt_0 = null;
    var token_alt_1 = null;
    if (req.headers.authorization) {
      token_alt_0 = req.headers.authorization.split(' ')[1];
    }
    if (req.params.authorization) {
      token_alt_1 = req.params.authorization;
    }
    if (!token_alt_0 && !token_alt_1) {
      return res.status(401).send(help.sendError(req.language, 'USER_NOT_FOUND'));
    }

    var token = token_alt_0 || token_alt_1;


    var payload = null;
    try {
      payload = jwt.decode(token, config.TOKEN_SECRET);
    }
    catch (err) {
      return res.status(401).send(help.sendError(req.language, 'USER_NOT_FOUND'));
    }

    if (payload.exp <= moment().unix()) {
      return res.status(401).send(help.sendError(req.language, 'USER_NOT_FOUND'));
    }
    req.user = payload.sub;
    next();
  },

  createJWT: function(user) {
    var payload = {
      sub: user._id,
      iat: moment().unix(),
      exp: moment().add(365, 'days').unix()
    };
    return jwt.encode(payload, config.TOKEN_SECRET);
  }
}
