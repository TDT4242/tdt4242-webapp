var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');

module.exports = {
  search: function(req, res, next) {
    console.log(req.body);
    req.body.priceLimitQuery = {
      $and: []
    };
    if (typeof req.body.lowerPriceLimit == 'number') {
      console.log();
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
    console.log(req.body.priceLimitQuery);

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
      return res.status(406).send({ message: status.INVALID_BRANDS[req.language].message, status: status.INVALID_BRANDS.code });
    }
    for (var i = 0; i < req.body.brands.length; i++) {
      if (typeof req.body.brands[i] != 'string' || !validator.isMongoId(req.body.brands[i])) {
        return res.status(406).send({ message: status.INVALID_BRANDS[req.language].message, status: status.INVALID_BRANDS.code });
      }
    }
    if (!Array.isArray(req.body.categories)) {
      return res.status(406).send({ message: status.INVALID_CATEGORIES[req.language].message, status: status.INVALID_CATEGORIES.code });
    }
    for (var i = 0; i < req.body.categories.length; i++) {
      if (typeof req.body.categories[i] != 'string' || !validator.isMongoId(req.body.categories[i])) {
        return res.status(406).send({ message: status.INVALID_CATEGORIES[req.language].message, status: status.INVALID_CATEGORIES.code });
      }
    }
    if (!Array.isArray(req.body.materials)) {
      return res.status(406).send({ message: status.INVALID_MATERIALS[req.language].message, status: status.INVALID_MATERIALS.code });
    }
    for (var i = 0; i < req.body.materials.length; i++) {
      if (typeof req.body.materials[i] != 'string' || !validator.isMongoId(req.body.materials[i])) {
        return res.status(406).send({ message: status.INVALID_MATERIALS[req.language].message, status: status.INVALID_MATERIALS.code });
      }
    }
    next();
  }
}
