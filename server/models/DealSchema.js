var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  percentage: { type: Number, default: null },
  x: { type: Number, default: null },
  y: { type: Number, default: null },
  start_date: { type: String, default: null },
  end_date: { type: String, default: null }
});


module.exports = mongoose.model('Deal', schema);