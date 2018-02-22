var validator = require('validator');
var validationHelper = require('../../helpers/validation.js');
var status = require('../../config/status.js');

module.exports = {
  addToCart: function(req, res, next) {
    if (!validator.isMongoId(req.body.product_id)) {
      return res.status(406).send({ message: status.PRODUCT_ID_INVALID[req.language].message, status: status.PRODUCT_ID_INVALID.code });
    }
    if (typeof req.body.quantity != 'number') {
      return res.status(406).send({ message: status.QUANTITY_INVALID[req.language].message, status: status.QUANTITY_INVALID.code });
    }
    next();
  }
}
