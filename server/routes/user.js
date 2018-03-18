var Models = require('../models/index.js');
var Middleware = require('../middleware/index.js');
var UserAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');

module.exports = function(app) {
  
  app.post('/api/user/get', Middleware.misc.language, Middleware.parameterValidation.user.getUser, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send({ message: status.INVALID_USER_AUTHENTICATION[req.language].message, status: status.INVALID_USER_AUTHENTICATION.code });}
      var product_ids = [];
      for (var i = 0; i < user.cart_products.length; i++) {
        product_ids.push(user.cart_products[i].product);
      }
      Models.Product.find({ _id: { $in: product_ids }}, function(err, products) {
        if (err) {throw err;}
        user.save(function(err) {
          if (err) {throw err;}
          return res.status(200).send({ data: {
            user: user,
            products: products
          }});
        });
      });
    });
  });
  
  app.put('/api/user/addToCart', Middleware.misc.language, Middleware.parameterValidation.user.addToCart, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send({ message: status.INVALID_USER_AUTHENTICATION[req.language].message, status: status.INVALID_USER_AUTHENTICATION.code });}
      Models.Product.findById(req.body.product_id, function(err, product) {
        if (err) {throw err;}
        if (!product) {
          return res.status(406).send({ message: status.PRODUCT_ID_INVALID[req.language].message, status: status.PRODUCT_ID_INVALID.code });
        }
        for (var i = 0; i < user.cart_products.length; i++) {
          if (user.cart_products[i].product == req.body.product_id) {
            return res.status(406).send({ message: status.PRODUCT_ALREADY_IN_CART[req.language].message, status: status.PRODUCT_ALREADY_IN_CART.code });
          }
        }
        user.cart_products.push({
          product: req.body.product_id,
          quantity: req.body.quantity
        });
        user.save(function(err) {
          if (err) {throw err;}
          return res.status(200).send({ data: {
            user: user
          }});
        });
      });
    });
  });
  
  app.put('/api/user/editCart', Middleware.misc.language, Middleware.parameterValidation.user.editCart, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send({ message: status.INVALID_USER_AUTHENTICATION[req.language].message, status: status.INVALID_USER_AUTHENTICATION.code });}
      var found = false;
      for (var i = 0; i < user.cart_products.length; i++) {
        if (user.cart_products[i].product == req.body.product_id) {
          found = true;
          user.cart_products[i].quantity = req.body.quantity;
        }
      }
      if (!found) {
        return res.status(406).send({ message: status.PRODUCT_ID_INVALID[req.language].message, status: status.PRODUCT_ID_INVALID.code });
      }
      user.save(function(err) {
        if (err) {throw err;}
        return res.status(200).send({ data: {
          user: user
        }});
      });
    });
  });
}
