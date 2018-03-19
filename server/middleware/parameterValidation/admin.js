var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');
var help = require('../../helpers/help.js');

module.exports = {
  getUser: function(req, res, next) {

    next();
  },
  addProduct: function(req, res, next) {
    if (typeof req.body.name != 'string' || req.body.name.trim() == '') {
      return res.status(406).send(help.sendError(req.language, 'INVALID_PRODUCT_NAME'));
    }
    if (typeof req.body.short_description != 'string' || req.body.short_description.trim() == '') {
      return res.status(406).send(help.sendError(req.language, 'INVALID_SHORT_DESCRIPTION'));
    }
    if (typeof req.body.price != 'number' || req.body.price <= 0) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_PRICE'));
    }
    if (typeof req.body.stock_quantity != 'number' || req.body.stock_quantity < 0) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_STOCK_QUANTITY'));
    }
    if (typeof req.body.brand_id != 'string' || !validator.isMongoId(req.body.brand_id)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_BRAND_ID'));
    }
    if (typeof req.body.category_id != 'string' || !validator.isMongoId(req.body.category_id)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_CATEGORY_ID'));
    }
    if (typeof req.body.material_id != 'string' || !validator.isMongoId(req.body.material_id)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_MATERIAL_ID'));
    }
    req.body.name = req.body.name.trim();
    req.body.short_description = req.body.short_description.trim();
    next();
  },
  addDeal: function(req, res, next) {
    if (typeof req.body.product_id != 'string' || !validator.isMongoId(req.body.product_id)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_PRODUCT_ID'));
    }
    var validDealTypes = [1, 2];
    if (validDealTypes.indexOf(req.body.type) == -1) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_DEAL_TYPE'));
    }
    if (req.body.type == 1 && (typeof req.body.percentage != 'number' || req.body.percentage <= 0 || req.body.percentage >= 100)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_PERCENTAGE_NUMBER'));
    }
    if (req.body.type == 2 && (typeof req.body.x != 'number' || typeof req.body.y != 'number')) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_X_Y_NUMBERS'));
    }
    if (req.body.type == 2 && (req.body.x < 2 || req.body.y < 1)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_X_Y_NUMBERS'));
    }
    if (req.body.type == 2 && (req.body.x <= req.body.y)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_X_Y_NUMBERS'));
    }
    next();
  },
  editStockQuantity: function(req, res, next) {
    if (typeof req.body.product_id != 'string' || !validator.isMongoId(req.body.product_id)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_PRODUCT_ID'));
    }
    if (typeof req.body.stock_quantity != 'number' || req.body.stock_quantity < 0) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_STOCK_QUANTITY'));
    }
    next();
  }
}
