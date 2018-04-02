var Models = require('../models/index.js');
var Middleware = require('../middleware/index.js');
var UserAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');
var help = require('../helpers/help.js');

module.exports = function(app) {
  
  // get all admin data
  app.post('/api/admin/get', Middleware.misc.language, Middleware.parameterValidation.admin.getUser, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      // if user is not administrator, deny access
      if (user.permissions.indexOf(1) == -1) {
        return res.status(406).send(help.sendError(req.language, 'PERMISSION_DENIED'));
      }
      
      // return all data for products, brands, categories, deals, materials and orders (with metadata)
      Models.Product.find({}, function(err, products) {
        if (err) {throw err;}
        Models.Brand.find({}, function(err, brands) {
          if (err) {throw err;}
          Models.Category.find({}, function(err, categories) {
            if (err) {throw err;}
            Models.Deal.find({}, function(err, deals) {
              if (err) {throw err;}
              Models.Material.find({}, function(err, materials) {
                if (err) {throw err;}
                Models.Order.find({}, function(err, orders) {
                  if (err) {throw err;}
                  var user_ids = help.getFieldValues(orders, 'user');
                  Models.User.find({ _id: { $in: user_ids }}, function(err, users) {
                    if (err) {throw err;}
                    res.status(200).send({ data: {
                      products: products,
                      orders: orders,
                      users: users,
                      brands: brands,
                      categories: categories,
                      deals: deals,
                      materials: materials
                    }});
                  });
                });
              });
            });
          });
        });
      });
    });
  });
  
  // add a new product to the store
  app.put('/api/admin/add-product', Middleware.misc.language, Middleware.parameterValidation.admin.addProduct, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      // if user is not administrator, deny access
      if (user.permissions.indexOf(1) == -1) {
        return res.status(406).send(help.sendError(req.language, 'PERMISSION_DENIED'));
      }
      // make sure brand, category and material ids provided are all valid
      Models.Brand.findById(req.body.brand_id, function(err, brand) {
        if (err) {throw err;}
        if (!brand) {return res.status(406).send(help.sendError(req.language, 'INVALID_BRAND_ID'));}
        Models.Category.findById(req.body.category_id, function(err, category) {
          if (err) {throw err;}
          if (!category) {return res.status(406).send(help.sendError(req.language, 'INVALID_CATEGORY_ID'));}
          Models.Material.findById(req.body.material_id, function(err, material) {
            if (err) {throw err;}
            if (!material) {return res.status(406).send(help.sendError(req.language, 'INVALID_MATERIAL_ID'));}
            // create new product and save to database, then return all products
            var newProduct = new Models.Product({
              name: req.body.name,
              short_description: req.body.short_description,
              price: req.body.price,
              stock_quantity: req.body.stock_quantity,
              brand: req.body.brand_id,
              categories: [req.body.category_id],
              material: req.body.material_id
            });
            newProduct.save(function(err) {
              if (err) {throw err;}
              Models.Product.find({}, function(err, products) {
                if (err) {throw err;}
                return res.status(200).send({ data: {
                  products: products
                }});
              });
            });
          });
        });
      });
    });
  });
  
  // add new deal for product(s)
  app.put('/api/admin/add-deal', Middleware.misc.language, Middleware.parameterValidation.admin.addDeal, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      // if user is not administrator, deny access
      if (user.permissions.indexOf(1) == -1) {
        return res.status(406).send(help.sendError(req.language, 'PERMISSION_DENIED'));
      }
      // get existing deals for product
      Models.Deal.findOne({ product: req.body.product_id }, function(err, deal) {
        if (err) {throw err;}
        // if deal already exists for this product, send error
        if (deal) {return res.status(406).send(help.sendError(req.language, 'DEAL_ALREADY_EXISTS'));}
        Models.Product.findById(req.body.product_id, function(err, product) {
          if (err) {throw err;}
          if (!product) {return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));}
          // initialize new deal
          var newDeal = new Models.Deal({
            product: req.body.product_id
          })
          // add deal parameters based on type
          if (req.body.type == 1) {
            newDeal.percentage = req.body.percentage;
          } else if (req.body.type == 2) {
            newDeal.x = req.body.x;
            newDeal.y = req.body.y;
          }
          newDeal.save(function(err) {
            if (err) {throw err;}
            Models.Deal.find({}, function(err, deals) {
              if (err) {throw err;}
              return res.status(200).send({ data: {
                deals: deals
              }});
            });
          });
        });
      });
    });
  });
  
  // update stock quantity of product
  app.put('/api/admin/edit-stock-quantity', Middleware.misc.language, Middleware.parameterValidation.admin.editStockQuantity, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      // if user is not administrator, deny access
      if (user.permissions.indexOf(1) == -1) {
        return res.status(406).send(help.sendError(req.language, 'PERMISSION_DENIED'));
      }
      Models.Product.findById(req.body.product_id, function(err, product) {
        if (err) {throw err;}
        if (!product) {return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));}
        // update product stock quantity
        product.stock_quantity = req.body.stock_quantity;
        product.save(function(err) {
          if (err) {throw err;}
          Models.Product.find({}, function(err, products) {
            if (err) {throw err;}
            return res.status(200).send({ data: {
              products: products
            }});
          });
        });
      });
    });
  });
  
  // update existing order placed, and send update email
  app.post('/api/admin/updateOrder', Middleware.misc.language, Middleware.parameterValidation.admin.updateOrder, UserAuth.ensureAuthenticated, function(req, res) {
    Models.User.findById(req.user, function(err, user) {
      if (err) {throw err;}
      if (!user) {return res.status(406).send(help.sendError(req.language, 'INVALID_USER_AUTHENTICATION'));}
      // if user is not administrator, deny access
      if (user.permissions.indexOf(1) == -1) {
        return res.status(406).send(help.sendError(req.language, 'PERMISSION_DENIED'));
      }
      Models.Order.findById(req.body.order_id, function(err, order) {
        if (err) {throw err;}
        if (!order) {
          return res.status(406).send(help.sendError(req.language, 'INVALID_ORDER_ID'));
        }
        // if order status is already 2 (sent), it cannot be updated
        if (order.status == 2) {
          return res.status(406).send(help.sendError(req.language, 'ORDER_STATUS_2'));
        }
        Models.User.findById(order.user, function(err, orderUser) {
          if (err) {throw err;}
          // increment order status by 1
          order.status = order.status + 1;
          order.save(function(err) {
            if (err) {throw err;}
            // get status order message based on status
            var statusMessage = null;
            if (order.status == 1) {
              statusMessage = "Status of your order: "+order._id+", is now Received.";
            } else {
              statusMessage = "Status of your order: "+order._id+", is now Shipped from store.";
            }
            // send statusMessage to users email
            help.sendEmail(orderUser.email, statusMessage, function() {
              Models.Order.find({}, function(err, orders) {
                if (err) {throw err;}
                return res.status(200).send({ data: {
                  orders: orders
                }});
              });
            });
          });
        });
      });
    });
  });
}
