var Models = require('../models/index.js');
var Middleware = require('../middleware/index.js');
var userAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');
var async = require('async');
var help = require('../helpers/help.js');


var bcrypt = require('bcryptjs');

module.exports = function(app) {

  // return products based on search filters
  app.post('/api/store/search', Middleware.misc.language, Middleware.parameterValidation.store.search, function(req, res) {
    var searchQuery = {};
    var filterQuery = {
      $and: []
    };
    
    // are any filter options selected?
    var filterOptionsSelected = req.body.brands.length != 0 || req.body.categories.length != 0 || req.body.materials.length != 0 || req.body.priceLimitQuery;
    // is search text entered?
    var searchTextEntered = req.body.searchText !== null;
    // status and message to be returned, used to message the client in case no filtering is applied
    var status = null;
    var message = null;
    if (!filterOptionsSelected && !searchTextEntered) {
      status = help.sendError(req.language,  'NO_FILTERING_SELECTED').status;
      message = help.sendError(req.language,  'NO_FILTERING_SELECTED').message;
    }
    // creating product query
    if (filterOptionsSelected || searchTextEntered) {
      searchQuery["$and"] = [];
    }
    if (req.body.brands.length > 0) {
      filterQuery.$and.push({ brand: { $in: req.body.brands }});
    }
    if (req.body.categories.length > 0) {
      filterQuery.$and.push({ categories: { $in: req.body.categories }});
    }
    if (req.body.materials.length > 0) {
      filterQuery.$and.push({ material: { $in: req.body.materials }});
    }
    if (searchTextEntered) {
      filterQuery.$and.push({name: { $regex: req.body.searchText, $options: 'i' }});
    }
    if (req.body.priceLimitQuery) {
      filterQuery.$and.push(req.body.priceLimitQuery);
    }
    if (filterOptionsSelected) {
      searchQuery.$and.push(filterQuery);
    }


    // Get ids of Brands, Categories and Materials that match the search text
    var waterfallArr = [function(callback) {
      callback(null, req.body.searchText);
    }];
    if (searchTextEntered) {
      waterfallArr.push(help.getSearchTextIds);
    }
    async.waterfall(waterfallArr, function(err, idQueries) {
      if (err) {throw err;}
      if (searchTextEntered && idQueries.$or.length > 0) {searchQuery.$and.push(idQueries);}
      Models.Product.find(searchQuery, function(err, products) {
        if (err) {throw err;}
        var brand_ids = [];
        var category_ids = [];
        var material_ids = [];
        for (var i = 0; i < products.length; i++) {
          brand_ids.push(products[i].brand);
          material_ids.push(products[i].material);
          category_ids = category_ids.concat(products[i].categories);
        }
        // return products with related brands, categories, materials and deals
        Models.Brand.find({ _id: { $in: brand_ids }}, function(err, brands) {
          if (err) {throw err;}
          Models.Category.find({ _id: { $in: category_ids }}, function(err, categories) {
            if (err) {throw err;}
            Models.Material.find({ _id: { $in: material_ids }}, function(err, materials) {
              if (err) {throw err;}
              Models.Deal.find({}, function(err, deals) {
                if (err) {throw err;}
                return res.status(200).send({ data: {
                  products: products,
                  brands: brands,
                  categories: categories,
                  materials: materials,
                  deals: deals,
                  status: status,
                  message: message
                }});
              });
            });
          });
        });
      });
    });
  });
}
