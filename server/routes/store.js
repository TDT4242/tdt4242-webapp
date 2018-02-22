var Models = require('../models/index.js');
var Middleware = require('../middleware/index.js');
var userAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');

var bcrypt = require('bcryptjs');

module.exports = function(app) {

  app.post('/api/store/search', Middleware.misc.language, Middleware.parameterValidation.store.search, function(req, res) {
    var searchQuery = {};
    
    if (req.body.name) {searchQuery.name = req.body.name;}
    if (req.body.brands) {searchQuery.brands = req.body.brands;}
    if (req.body.categories) {searchQuery.categories = req.body.categories;}
    if (req.body.materials) {searchQuery.materials = req.body.materials;}
    
    Models.Product.find({}, function(err, products) {
      if (err) {throw err;}
      var brand_ids = [];
      var category_ids = [];
      var material_ids = [];
      for (var i = 0; i < products.length; i++) {
        brand_ids.push(products[i].brand);
        material_ids.push(products[i].material);
        category_ids = category_ids.concat(products[i].categories);
      }
      Models.Brand.find({ _id: { $in: brand_ids }}, function(err, brands) {
        if (err) {throw err;}
        Models.Category.find({ _id: { $in: category_ids }}, function(err, categories) {
          if (err) {throw err;}
          Models.Material.find({ _id: { $in: material_ids }}, function(err, materials) {
            if (err) {throw err;}
            return res.status(200).send({ data: {
              products: products,
              brands: brands,
              categories: categories,
              materials: materials
            }});
          });
        });
      });
    });
  });

  app.put('/api/store/signup', Middleware.misc.language, Middleware.parameterValidation.auth.signup, function(req, res) {

  });
}
