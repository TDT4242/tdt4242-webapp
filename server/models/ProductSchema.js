var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  name: { type: String, required: true },
  short_description: { type: String, required: true },
  long_description: { type: String, default: '' },
  stock_quantity: { type: Number, required: true, default: 0 },
  //creator: { type: Schema.Types.ObjectId, ref: 'User' },
  price: { type: Number, required: true },
  brand: { type: Schema.Types.ObjectId, ref: 'Brand' },
  material: { type: Schema.Types.ObjectId, ref: 'Material' },
  categories: { type: [String], default: [] }
});


module.exports = mongoose.model('Product', schema);