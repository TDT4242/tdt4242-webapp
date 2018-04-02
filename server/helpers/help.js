// help.js contains parameterized helper-methods often used in the code

var validator = require('validator');
var status = require('../config/status.js');
var Models = require('../models/index.js');
var api_key = process.env.MAILGUN_API_KEY;
var domain = 'nibeklaussen.com';
var mailgun = {};
try {
  mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
} catch (e) {
  
}

// get product-query for the given search text 
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

// Get price for product given applied deal (if it exists)
function getPrice(product, price, deal, cb) {
  // if no deal exists, return price times quantity
  if (!deal) {
    return cb(roundIt(price * product.quantity));
  }
  // calculate percentage price if deal is percentage type 
  if (deal.percentage) {
    return cb(roundIt(price * product.quantity * (1 - deal.percentage * 0.01)));
  }
  // calculate x for y price if deal is x for y type
  if (deal.x && product.quantity >= deal.x) {
    // get "number of free products" and subtract these from original product count
    var numberOfDeals = Math.floor(product.quantity/deal.x)
    var numberOfFreeProducts = product.quantity - (deal.y * numberOfDeals)

    return cb(roundIt((product.quantity - numberOfFreeProducts) * price));
  }
  return cb(roundIt(price * product.quantity));
}

// Round number to closest 2 decimals
function roundIt(number) {
  return Math.floor(number * 100)/100;
}

// Generic method for sending failure messages to client
function sendError(language, key) {
  var sendIt = { message: status[key][language].message, status: status[key][language].code };
  return sendIt;
}

// Generic method for sending email message to given email
function sendEmail(email, message, cb) {
  var data = {
    from: 'Super Sander <store@nibeklaussen.com>',
    to: email,
    subject: 'Order update!',
    text: message
  };
   
  mailgun.messages().send(data, function (error, body) {
    cb();
  });
}

// Get given field value for the provided items
function getFieldValues(items, field) {
  var values = [];
  for (var i = 0; i < items.length; i++) {
    values.push(items[i][field]);
  }
  return values;
}

module.exports = {
  getPrice: getPrice,
  sendError: sendError,
  getFieldValues: getFieldValues,
  sendEmail: sendEmail,
  getSearchTextIds: getSearchTextIds
}
