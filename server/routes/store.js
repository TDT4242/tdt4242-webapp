var Models = require('../models/index.js');
var Middleware = require('../middleware/index.js');
var userAuth = require('../middleware/authentication/user.js');
var status = require('../config/status.js');
var async = require('async');
var help = require('../helpers/help.js');


var bcrypt = require('bcryptjs');

module.exports = function(app) {

  function getSearchTextIds(searchText, callback) {
    return new Promise(resolve => {
      var modelsInfo = [{
        name: 'brand',
        model: Models.Brand
      }, {
        name: 'categories',
        model: Models.Category
      }, {
        name: '_id',
        model: Models.Product
      }, {
        name: 'material',
        model: Models.Material
      }];
      var idQueries = {
        $or: []
      };
      async.forEach(modelsInfo, function(modelInfo, cb) {
        modelInfo.model.find({ name: { $regex: searchText, $options: 'i' }}, function(err, items) {
          if (err) {throw err;}

          if (items.length > 0) {
            var idQuery = {};
            var item_ids = [];
            // getting ids of the relevant brands, categories and materials
            for (var i = 0; i < items.length; i++) {item_ids.push(items[i]._id);}
            // adding the ids to the query that will be returned
            idQuery[modelInfo.name] = { $in: item_ids };
            idQueries.$or.push(idQuery);
          }
          cb();
        })
      }, function(err) {
        if (err) {throw err;}
        callback(null, idQueries);
      });
    });
  }

  app.post('/api/store/search', Middleware.misc.language, Middleware.parameterValidation.store.search, function(req, res) {
    var searchQuery = {};
    var filterQuery = {
      $and: []
    };

    var filterOptionsSelected = req.body.brands.length != 0 || req.body.categories.length != 0 || req.body.materials.length != 0 || req.body.priceLimitQuery;
    var searchTextEntered = req.body.searchText !== null;
    var status = null;
    var message = null;
    if (!filterOptionsSelected && !searchTextEntered) {
      status = help.sendError(req.language,  'NO_FILTERING_SELECTED').status;
      message = help.sendError(req.language,  'NO_FILTERING_SELECTED').message;
    }
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
      waterfallArr.push(getSearchTextIds);
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
