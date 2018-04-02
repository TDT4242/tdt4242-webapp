// language.js makes sure a preferred language is available to be used in the endpoint-handler

module.exports = function(req, res, next) {
  req.language = "eng";
  next();
}