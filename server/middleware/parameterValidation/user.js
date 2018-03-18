var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');

module.exports = {
  addToCart: function(req, res, next) {
    if (!validationHelper.mongo_id(req.body.product_id)) {
      return res.status(406).send({ message: status.PRODUCT_ID_INVALID[req.language].message, status: status.PRODUCT_ID_INVALID.code });
    }
    if (typeof req.body.quantity != 'number') {
      return res.status(406).send({ message: status.QUANTITY_INVALID[req.language].message, status: status.QUANTITY_INVALID.code });
    }
    next();
  },
  getUser: function(req, res, next) {

    next();
  },
  deleteProductFromCart: function(req, res, next) {
    console.log(req.body);
    if (!validationHelper.mongo_id(req.body.cart_product_id)) {
      console.log(1);
      return res.status(406).send({ message: status.PRODUCT_ID_INVALID[req.language].message, status: status.PRODUCT_ID_INVALID.code });
    }
    next();
  },
  updateProductInCart: function(req, res, next) {
    console.log(req.body);
    if (!validationHelper.mongo_id(req.body.cart_product_id)) {
      return res.status(406).send({ message: status.PRODUCT_ID_INVALID[req.language].message, status: status.PRODUCT_ID_INVALID.code });
    }
    if (typeof req.body.quantity != 'number' || req.body.quantity < 1) {
      return res.status(406).send({ message: status.MINIMUM_QUANTITY_MUST_BE_1[req.language].message, status: status.MINIMUM_QUANTITY_MUST_BE_1.code });
    }
    next();
  },
  checkout: function(req, res, next) {

    next();
  }
}
