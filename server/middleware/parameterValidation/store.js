var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');
var help = require('../../helpers/help.js');

module.exports = {
  search: function(req, res, next) {
    req.body.priceLimitQuery = {
      $and: []
    };
    if (typeof req.body.lowerPriceLimit == 'number') {
      req.body.priceLimitQuery.$and.push({
        price: { $gt: req.body.lowerPriceLimit }
      });
    }
    if (typeof req.body.upperPriceLimit == 'number') {
      req.body.priceLimitQuery.$and.push({
        price: { $lt: req.body.upperPriceLimit }
      });
    }
    if (typeof req.body.upperPriceLimit != 'number' && typeof req.body.lowerPriceLimit != 'number') {
      req.body.priceLimitQuery = null;
    }

    if (typeof req.body.searchText != 'string') {
      req.body.searchText = null;
    } else if (!validator.isAlphanumeric(req.body.searchText)) {
      req.body.searchText = null;
    } else if (req.body.searchText.trim() == '') {
      req.body.searchText = null;
    } else {
      req.body.searchText = req.body.searchText;
    }
    if (!Array.isArray(req.body.brands)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_BRANDS'));
    }
    for (var i = 0; i < req.body.brands.length; i++) {
      if (typeof req.body.brands[i] != 'string' || !validator.isMongoId(req.body.brands[i])) {
        return res.status(406).send(help.sendError(req.language, 'INVALID_BRANDS'));
      }
    }
    if (!Array.isArray(req.body.categories)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_CATEGORIES'));
    }
    for (var i = 0; i < req.body.categories.length; i++) {
      if (typeof req.body.categories[i] != 'string' || !validator.isMongoId(req.body.categories[i])) {
        return res.status(406).send(help.sendError(req.language, 'INVALID_CATEGORIES'));
      }
    }
    if (!Array.isArray(req.body.materials)) {
      return res.status(406).send(help.sendError(req.language, 'INVALID_MATERIALS'));
    }
    for (var i = 0; i < req.body.materials.length; i++) {
      if (typeof req.body.materials[i] != 'string' || !validator.isMongoId(req.body.materials[i])) {
        return res.status(406).send(help.sendError(req.language, 'INVALID_MATERIALS'));
      }
    }
    next();
  }
}
