var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');

module.exports = {
  getUser: function(req, res, next) {

    next();
  },
  addProduct: function(req, res, next) {
    console.log(req.body);
    if (typeof req.body.name != 'string' || req.body.name.trim() == '') {
      return res.status(406).send({ message: status.INVALID_PRODUCT_NAME[req.language].message, status: status.INVALID_PRODUCT_NAME.code });
    }
    if (typeof req.body.short_description != 'string' || req.body.short_description.trim() == '') {
      return res.status(406).send({ message: status.INVALID_SHORT_DESCRIPTION[req.language].message, status: status.INVALID_SHORT_DESCRIPTION.code });
    }
    if (typeof req.body.price != 'number' || req.body.price <= 0) {
      return res.status(406).send({ message: status.INVALID_PRICE[req.language].message, status: status.INVALID_PRICE.code });
    }
    if (typeof req.body.stock_quantity != 'number' || req.body.stock_quantity < 0) {
      return res.status(406).send({ message: status.INVALID_STOCK_QUANTITY[req.language].message, status: status.INVALID_STOCK_QUANTITY.code });
    }
    if (typeof req.body.brand_id != 'string' || !validator.isMongoId(req.body.brand_id)) {
      return res.status(406).send({ message: status.INVALID_BRAND_ID[req.language].message, status: status.INVALID_BRAND_ID.code });
    }
    if (typeof req.body.category_id != 'string' || !validator.isMongoId(req.body.category_id)) {
      return res.status(406).send({ message: status.INVALID_CATEGORY_ID[req.language].message, status: status.INVALID_CATEGORY_ID.code });
    }
    if (typeof req.body.material_id != 'string' || !validator.isMongoId(req.body.material_id)) {
      return res.status(406).send({ message: status.INVALID_MATERIAL_ID[req.language].message, status: status.INVALID_MATERIAL_ID.code });
    }
    req.body.name = req.body.name.trim();
    req.body.short_description = req.body.short_description.trim();
    next();
  },
  addDeal: function(req, res, next) {
    if (typeof req.body.product_id != 'string' || !validator.isMongoId(req.body.product_id)) {
      return res.status(406).send({ message: status.INVALID_PRODUCT_ID[req.language].message, status: status.INVALID_PRODUCT_ID.code });
    }
    var validDealTypes = [1, 2];
    if (validDealTypes.indexOf(req.body.type) == -1) {
      return res.status(406).send({ message: status.INVALID_DEAL_TYPE[req.language].message, status: status.INVALID_DEAL_TYPE.code });
    }
    if (req.body.type == 1 && (typeof req.body.percentage != 'number' || req.body.percentage <= 0 || req.body.percentage >= 100)) {
      return res.status(406).send({ message: status.INVALID_PERCENTAGE_NUMBER[req.language].message, status: status.INVALID_PERCENTAGE_NUMBER.code });
    }
    if (req.body.type == 2 && (typeof req.body.x != 'number' || typeof req.body.y != 'number')) {
      return res.status(406).send({ message: status.INVALID_X_Y_NUMBERS[req.language].message, status: status.INVALID_X_Y_NUMBERS.code });
    }
    if (req.body.type == 2 && (req.body.x < 2 || req.body.y < 1)) {
      return res.status(406).send({ message: status.INVALID_X_Y_NUMBERS[req.language].message, status: status.INVALID_X_Y_NUMBERS.code });
    }
    if (req.body.type == 2 && (req.body.x <= req.body.y)) {
      return res.status(406).send({ message: status.INVALID_X_Y_NUMBERS[req.language].message, status: status.INVALID_X_Y_NUMBERS.code });
    }
    next();
  },
  editStockQuantity: function(req, res, next) {
    console.log(req.body);
    if (typeof req.body.product_id != 'string' || !validator.isMongoId(req.body.product_id)) {
      return res.status(406).send({ message: status.INVALID_PRODUCT_ID[req.language].message, status: status.INVALID_PRODUCT_ID.code });
    }
    if (typeof req.body.stock_quantity != 'number' || req.body.stock_quantity < 0) {
      return res.status(406).send({ message: status.INVALID_STOCK_QUANTITY[req.language].message, status: status.INVALID_STOCK_QUANTITY.code });
    }
    next();
  }
}