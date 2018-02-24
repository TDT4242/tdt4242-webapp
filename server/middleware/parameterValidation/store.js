var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');

module.exports = {
  search: function(req, res, next) {
    console.log(req.body);
    if (typeof req.body.priceFilter != 'number' || [-1,1,2].indexOf(req.body.priceFilter) == -1) {
      return res.status(406).send({ message: status.INVALID_PRICE_FILTER[req.language].message, status: status.INVALID_PRICE_FILTER.code });
    }
    if (req.body.priceFilter == 1) {
      req.body.priceFilter = { sort: { price: 1 } };
    } else if (req.body.priceFilter == 2) {
      req.body.priceFilter = { sort: { price: -1 } };
    } else {
      req.body.priceFilter = null;
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
