var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  date_placed: { type: String, required: true },
  status: { type: Number, required: true, default: 0 },
  products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }]
});


module.exports = mongoose.model('Order', schema);
