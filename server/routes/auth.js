var Brand = require('../models/BrandSchema.js');
var Deal = require('../models/DealSchema.js');
var Material = require('../models/MaterialSchema.js');
var Product = require('../models/ProductSchema.js');
var User = require('../models/UserSchema.js');
var Middleware = require('../middleware/index.js');
var userAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');

var bcrypt = require('bcryptjs');

module.exports = function(app) {

  app.post('/api/auth/login', Middleware.misc.language, Middleware.parameterValidation.auth.login, function(req, res) {
    console.log(req.body);
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {throw err;}
      if (!user) {
        return res.status(406).send({ message: status.USER_DOES_NOT_EXIST[req.language].message, status: status.USER_DOES_NOT_EXIST.code });
      }
      console.log(user);
      bcrypt.compare(req.body.password, user.password, function(err, isMatch) {
        if (err) {throw err;}
        if (!isMatch) {
          return res.status(406).send({ message: status.WRONG_PASSWORD[req.language].message, status: status.WRONG_PASSWORD.code });
        }
        return res.status(200).send({ user: user, token: userAuth.createJWT(user) })
      })
    })
  })

  app.put('/api/auth/signup', Middleware.misc.language, Middleware.parameterValidation.auth.signup, function(req, res) {
    User.findOne({ email: req.body.email }, function(err, user) {
      if (err) {throw err;}
      if (user) {
        return res.status(406).send({ message: status.USER_ALREADY_EXISTS[req.language].message, status: status.USER_ALREADY_EXISTS.code });
      }
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
