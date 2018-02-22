var path = require('path');
var qs = require('querystring');

var async = require('async');
var bcrypt = require('bcryptjs');
var bodyParser = require('body-parser');
var colors = require('colors');
var cors = require('cors');
var logger = require('morgan');
var jwt = require('jwt-simple');
var moment = require('moment');
var mongoose = require('mongoose');
var express = require('express');
var helmet = require('helmet');
var config = require('./config/config.js');
var Models = require('./models/index.js');


var app = express();

mongoose.connect(config.DATABASE_URL);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

// init();
//clear();


app.set('port', 3000);
app.set('trust_proxy', 1);
app.use(cors());
app.use(helmet())
app.use(logger('dev'));
app.use(bodyParser.json({limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('../client'));
app.set('views', '../client/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON');
  }
});

require('./routes/index.js')(app);


app.get('/*', function(req, res) {
  return res.render('index.html');
})


app.listen(app.get('port'), function() {
  console.log('app listening on port: ' + app.get('port'));
});



function init() {
  var newUser = new Models.User({
    first_name: "stein",
    last_name: "klaus",
    email: "saklauss@stud.ntnu.no",
    password: "ntnupass"
  });
  var newBrand = new Models.Brand({
    name: "Rolf Larsen"
  })
  var newCategory = new Models.Category({
    name: "Shirts"
  })
  var polyester = new Models.Material({
    name: "Polyester"
  })
  var newProduct = new Models.Product({
    name: "Long sleeve shirt",
    price: 19.99,
    short_description: 'Nice long sleeve classic superslim fit shirt.',
    long_description: '<h1>Very cool love short.</h1><br> Nice indeed.',
    brand: newBrand._id,
    material: polyester._id,
    categories: [newCategory._id]
  })
  newUser.save(function(err) {
    console.log(err);
    newBrand.save(function(err) {
      console.log(err);
      newCategory.save(function(err) {
        console.log(err);
        polyester.save(function(err) {
          console.log(err);
          newProduct.save(function(err) {
            console.log(err);
            console.log('saved');

          })
        })
      })
    })
  })
}

function clear() {
  Models.Brand.remove({}, function(err) {
    console.log(err);
    Models.Category.remove({}, function(err) {
      console.log(err);
      Models.Deal.remove({}, function(err) {
        console.log(err);
        Models.Material.remove({}, function(err) {
          console.log(err);
          Models.Product.remove({}, function(err) {
            console.log(err);
            Models.User.remove({}, function(err) {
              console.log(err);
              console.log('done');
            })
          })
        })
      })
    })
  })
}