var validator = require('validator');
var status = require('../config/status.js');
var Models = require('../models/index.js');

function getPrice(product, price, cb) {
  console.log(product);
  Models.Deal.findOne({ product: product.product }, function(err, deal) {
    if (err) {throw err;}
    console.log(deal);
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

module.exports = {
  getPrice: getPrice
}
