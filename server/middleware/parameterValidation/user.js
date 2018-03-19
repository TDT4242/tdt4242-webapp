var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');
var help = require('../../helpers/help.js');

module.exports = {
  addToCart: function(req, res, next) {
    if (!validationHelper.mongo_id(req.body.product_id)) {
      return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));
    }
    if (typeof req.body.quantity != 'number') {
      return res.status(406).send(help.sendError(req.language, 'QUANTITY_INVALID'));
    }
    next();
  },
  getUser: function(req, res, next) {

    next();
  },
  deleteProductFromCart: function(req, res, next) {
    if (!validationHelper.mongo_id(req.body.cart_product_id)) {
      return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));
    }
    next();
  },
  updateProductInCart: function(req, res, next) {
    if (!validationHelper.mongo_id(req.body.cart_product_id)) {
      return res.status(406).send(help.sendError(req.language, 'PRODUCT_ID_INVALID'));
    }
    if (typeof req.body.quantity != 'number' || req.body.quantity < 1) {
      return res.status(406).send(help.sendError(req.language, 'MINIMUM_QUANTITY_MUST_BE_1'));
    }
    next();
  },
  checkout: function(req, res, next) {

    next();
  }
}
