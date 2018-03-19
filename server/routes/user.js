var Models = require('../models/index.js');
var Middleware = require('../middleware/index.js');
var UserAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');
var async = require('async');
var help = require('../helpers/help.js');

module.exports = function(app) {

  app.post('/api/user/get', Middleware.misc.language, Middleware.parameterValidation.user.getUser, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      var product_ids = [];
      for (var i = 0; i < user.cart_products.length; i++) {
        product_ids.push(user.cart_products[i].product);
      }
      Models.Order.find({ user: req.user }, function(err, orders) {
        if (err) {throw err;}
        for (var i = 0; i < orders.length; i++) {
          for (var j = 0; j < orders[i].products.length; j++) {
            product_ids.push(orders[i].products[j].product);
          }
        }
        Models.Product.find({ _id: { $in: product_ids }}, function(err, products) {
          if (err) {throw err;}
          user.save(function(err) {
            if (err) {throw err;}
            return res.status(200).send({ data: {
              user: user,
              products: products,
              orders: orders
            }});
          });
        });
      });
    });
  });

  app.put('/api/user/addToCart', Middleware.misc.language, Middleware.parameterValidation.user.addToCart, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      Models.Product.findById(req.body.product_id, function(err, product) {
        if (err) {throw err;}
        if (!product) {
          return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));
        }
        for (var i = 0; i < user.cart_products.length; i++) {
          if (user.cart_products[i].product == req.body.product_id) {
            return res.status(406).send(help.sendError(req.language, 'PRODUCT_ALREADY_IN_CART'));
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

  app.put('/api/user/deleteProductFromCart', Middleware.misc.language, Middleware.parameterValidation.user.deleteProductFromCart, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      var found = false;
      var index = null;
      for (var i = 0; i < user.cart_products.length; i++) {
        if (user.cart_products[i]._id == req.body.cart_product_id) {
          index = i;
          user.cart_products[i].quantity = req.body.quantity;
        }
      }
      if (index === null) {
        return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));
      }
      user.cart_products.splice(index, 1);
      user.save(function(err) {
        if (err) {throw err;}
        return res.status(200).send({ data: {
          user: user
        }});
      });
    });
  });

  app.put('/api/user/updateProductInCart', Middleware.misc.language, Middleware.parameterValidation.user.updateProductInCart, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      var found = false;
      for (var i = 0; i < user.cart_products.length; i++) {
        if (user.cart_products[i]._id == req.body.cart_product_id) {
          found = true;
          user.cart_products[i].quantity = req.body.quantity;
        }
      }
      if (!found) {
        return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));
      }
      user.save(function(err) {
        if (err) {throw err;}
        return res.status(200).send({ data: {
          user: user
        }});
      });
    });
  });

  app.put('/api/user/checkout', Middleware.misc.language, Middleware.parameterValidation.user.checkout, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      var found = false;
      if (user.cart_products.length == 0) {
        return res.status(406).send(help.sendError(req.language, 'NO_PRODUCTS_SELECTED'));
      }
      for (var i = 0; i < user.cart_products.length; i++) {
        if (user.cart_products[i].quantity < 1) {
          return res.status(406).send(help.sendError(req.language, 'MINIMUM_QUANTITY_MUST_BE_1'));
        }
      }

      var outOfStockProducts = '';
      var products = [];
      var cart_products = JSON.parse(JSON.stringify(user.cart_products));
      async.forEach(cart_products, function(cart_product, cb) {
        Models.Product.findById(cart_product.product, function(err, product) {
          if (err) {throw err;}
          if (cart_product.quantity > product.stock_quantity) {
            if (outOfStockProducts == '') {
              outOfStockProducts += product.name;
            } else {
              outOfStockProducts += ', ' + product.name;
            }
          }
          products.push(product);
          Models.Deal.findOne({ product: product._id }, function(err, deal) {
            if (err) {throw err;}
            help.getPrice(cart_product, product.price, deal, function(price) {
              cart_product.price = price;
              cb();
            });
          });
        });
      }, function(err) {
        if (err) {throw err;}
        if (outOfStockProducts != '') {
          return res.status(406).send({ message: status.OUT_OF_STOCK[req.language].message + outOfStockProducts, status: status.OUT_OF_STOCK.code });
        }
        var newOrder = new Models.Order({
          user: req.user,
          date_placed: new Date().toISOString(),
          products: cart_products
        });
        user.cart_products = [];
        user.save(function(err) {
          if (err) {throw err;}
          newOrder.save(function(err) {
            if (err) {throw err;}
            async.forEach(products, function(product, cb) {
              for (var i = 0; i < cart_products.length; i++) {
                if (cart_products[i].product == product._id) {
                  product.stock_quantity = product.stock_quantity - cart_products[i].quantity;
                }
              }
              product.save(function(err) {
                if (err) {cb(err);} else {cb();}
              });
            }, function(err) {
              if (err) {throw err;}
              return res.status(200).send({ data: {
                user: user
              }});
            });
          });
        });
      });
    });
  });
}
