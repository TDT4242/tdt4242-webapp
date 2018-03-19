var validator = require('validator');
var status = require('../config/status.js');
var Models = require('../models/index.js');

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
  console.log(status[key]);
  var sendIt = { message: status[key][language].message, status: status[key][language].code };
  console.log(sendIt);
  return sendIt;
}

module.exports = {
  getPrice: getPrice,
  sendError: sendError
}
