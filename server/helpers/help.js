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
 

function getPrice(product, price, cb) {
  Models.Deal.findOne({ product: product.product }, function(err, deal) {
    if (err) {throw err;}
    if (!deal) {
      return cb(price * product.quantity)
    }
    if (deal.percentage) {
      return cb(price * product.quantity * (1 - deal.percentage * 0.01));
    }
    if (deal.x && product.quantity >= deal.x) {
      var numberOfDeals = Math.floor(product.quantity/deal.x);
      var numberOfFreeProducts = product.quantity - (deal.y * numberOfDeals);

      return cb((product.quantity - numberOfFreeProducts) * price)
    }
  })
}

function sendError(language, key) {
  var sendIt = { message: status[key][language].message, status: status[key][language].code };
  return sendIt;
}

function sendEmail(email, message, cb) {
  var data = {
    from: 'Super Sander <store@nibeklaussen.com>',
    to: 'steinaagee@gmail.com',
    subject: 'Order update!',
    text: message
  };
   
  mailgun.messages().send(data, function (error, body) {
    cb();
  });
}

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
  sendEmail: sendEmail
}
