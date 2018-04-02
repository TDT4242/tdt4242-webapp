var Brand = require('../models/BrandSchema.js');
var Deal = require('../models/DealSchema.js');
var Material = require('../models/MaterialSchema.js');
var Product = require('../models/ProductSchema.js');
var User = require('../models/UserSchema.js');
var Middleware = require('../middleware/index.js');
var userAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');
var help = require('../helpers/help.js');

var bcrypt = require('bcryptjs');

module.exports = function(app) {

  // log in user and return authentication token
  app.post('/api/auth/login', Middleware.misc.language, Middleware.parameterValidation.auth.login, function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {throw err;}
      if (!user) {
        return res.status(406).send(help.sendError(req.language, 'USER_DOES_NOT_EXIST'));
      }
      // check if password is matching saved one
      bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if (err) {throw err;}
        if (!isMatch) {
          return res.status(406).send(help.sendError(req.language, 'WRONG_PASSWORD'));
        }
        return res.status(200).send({ user: user, token: userAuth.createJWT(user) })
      })
    })
  })

  // sign up user and return authentication token
  app.put('/api/auth/signup', Middleware.misc.language, Middleware.parameterValidation.auth.signup, function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {throw err;}
      if (user) {
        return res.status(406).send(help.sendError(req.language, 'USER_ALREADY_EXISTS'));
      }
      // initialize new user
      var newUser = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password
      });
      newUser.save(function(err) {
        if (err) {throw err;}
        return res.status(200).send({ user: newUser, token: userAuth.createJWT(newUser) });
      });
    });
  });
}
