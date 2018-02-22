var Models = require('../models/index.js');
var Middleware = require('../middleware/index.js');
var UserAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');

module.exports = function(app) {
  app.put('/api/user/addToCart', Middleware.misc.language, Middleware.parameterValidation.user.addToCart, UserAuth.ensureAuthenticated, function(req, res) {
    console.log(req.user);
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      console.log(user);
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
            cart: user.cart_products
          }});
        });
      });
    });
  });
}
