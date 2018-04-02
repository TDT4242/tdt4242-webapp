// the parameterValidation-files validates the parameters for the endpoints "contained" in that category


module.exports = {
  misc: {
    language: require('./misc/language.js')
  },
  parameterValidation: {
    auth: require('./parameterValidation/auth.js'),
    user: require('./parameterValidation/user.js'),
    admin: require('./parameterValidation/admin.js'),
    store: require('./parameterValidation/store.js')
  }
}