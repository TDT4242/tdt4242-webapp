module.exports = function(app) {
  require('../routes/admin.js')(app);
  require('../routes/auth.js')(app);
  require('../routes/store.js')(app);
  require('../routes/user.js')(app);
}