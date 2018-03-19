var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');

var schema = new Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, lowercase: true, required: true, trim: true },
  password: { type: String, required: true },
  permissions: { type: [Number], default: [0] },
  cart_products: [{
    product: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number }
  }]
});

schema.pre('save', function(next) {
  var user = this;
  // if not new user, hash password
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(user.password, salt, function(err, hash) {
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', schema);
