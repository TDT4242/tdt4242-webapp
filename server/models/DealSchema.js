var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  discount: { type: Number, default: null },
  start_date: { type: String, required: true },
  end_date: { type: String, required: true },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    discount: { type: Number, required: true },
  }]
});


module.exports = mongoose.model('Deal', schema);