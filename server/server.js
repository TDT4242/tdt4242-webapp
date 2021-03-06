var path = require('path');
var qs = require('querystring');
var fs = require('fs');

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
var status = require('./config/status.js');
var help = require('./helpers/help.js');

// initialize express app
var app = express();
var server = require('http').Server(app);

mongoose.connect(config.DATABASE_URL);
mongoose.connection.on('error', function(err) {
  console.log('Error: Could not connect to MongoDB. Did you forget to run `mongod`?'.red);
});

// functions initializing and clearing data (mainly for testing and building phase)
//clearOrders();
//clearDeals();
//init();
//clear();

// check if server is up
app.get('/serverIsUp', function(req, res) {
  return res.status(200).send();
})




// listening at port 3000
app.set('port', 3000);
app.set('trust_proxy', 1);
app.use(cors());
app.use(helmet())
app.use(logger('dev'));
app.use(bodyParser.json({limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// set public folder
app.use(express.static('../client'));
// set views folder
app.set('views', '../client/views');
// set html engine
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(function(err, req, res, next) {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('Bad JSON');
  }
});

require('./routes/index.js')(app);

// main route for angular app
app.get('/*', function(req, res) {
  return res.render('index.html');
})

// start server
server.listen(app.get('port'), function() {
  if (process.env.production !== 'true') {
    process.exit(0);
  }
});

// socket for stopping server in testing phase
const io = require('socket.io')(server);
io.on('connection', (socketServer) => {
  socketServer.on('npmStop', () => {
    process.exit(0);
  });
});

// initialize database with data
function init() {
  var newUser = new Models.User({
    first_name: "stein",
    last_name: "klaus",
    email: "user@user.no",
    password: "ntnupass"
  });
  var newAdmin = new Models.User({
    first_name: "admin",
    last_name: "administrator",
    email: "admin@admin.no",
    password: "ntnupass",
    permissions: [0,1]
  });
  var newBrand = new Models.Brand({
    name: "Rolf Larsen"
  })
  var newBrand1 = new Models.Brand({
    name: "Gucci"
  })
  var newCategory = new Models.Category({
    name: "Shirts"
  })
  var newCategory1 = new Models.Category({
    name: "Pants"
  })
  var newMaterial = new Models.Material({
    name: "Polyester"
  })
  var newMaterial1 = new Models.Material({
    name: "Lin"
  })
  var newProduct = new Models.Product({
    name: "Long sleeve shirt",
    price: 9.99,
    short_description: 'Nice long sleeve classic superslim fit shirt.',
    long_description: '<h1>Very cool love short.</h1><br> Nice indeed.',
    brand: newBrand._id,
    material: newMaterial._id,
    categories: [newCategory._id]
  })
  var newProduct1 = new Models.Product({
    name: "Short sleeve shirt",
    price: 19.99,
    short_description: 'Nice',
    long_description: '<h1>Very cool love short.</h1><br> Nice indeed.',
    brand: newBrand1._id,
    material: newMaterial._id,
    categories: [newCategory._id]
  })
  var newProduct2 = new Models.Product({
    name: "Very long pants",
    price: 29.99,
    short_description: 'Nice',
    long_description: '<h1>Very cool love short.</h1><br> Nice indeed.',
    brand: newBrand._id,
    material: newMaterial1._id,
    categories: [newCategory1._id]
  })
  var newProduct3 = new Models.Product({
    name: "Short pants",
    price: 39.99,
    short_description: 'Nice',
    long_description: '<h1>Very cool love short.</h1><br> Nice indeed.',
    brand: newBrand._id,
    material: newMaterial1._id,
    categories: [newCategory1._id]
  })
  newUser.save(function(err) {
    console.log(err);
    newAdmin.save(function(err) {
      console.log(err);
      newBrand.save(function(err) {
        console.log(err);
        newBrand1.save(function(err) {
          console.log(err);
          newCategory1.save(function(err) {
            console.log(err);
            newMaterial1.save(function(err) {
              console.log(err);
              newCategory.save(function(err) {
                console.log(err);
                newMaterial.save(function(err) {
                  console.log(err);
                  newProduct.save(function(err) {
                    console.log(err);
                    newProduct1.save(function(err) {
                      console.log(err);
                      newProduct2.save(function(err) {
                        console.log(err);
                        newProduct3.save(function(err) {
                          console.log(err);
                        })
                      })
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  })
}

// clear all database data
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
            })
          })
        })
      })
    })
  })
}

// clear all orders
function clearOrders() {
  Models.Order.find({}, function(err, orders) {
    async.forEach(orders, function(order, cb) {
      order.remove(function(err) {
        console.log(err);
      })
    }, function(err) {
      console.log(err);
    })
  })
}

// clear all deals
function clearDeals() {
  Models.Deal.find({}, function(err, orders) {
    async.forEach(orders, function(order, cb) {
      order.remove(function(err) {
        console.log(err);
      })
    }, function(err) {
      console.log(err);
    })
  })
}
