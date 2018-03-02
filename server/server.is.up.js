var supertest = require("supertest");

var server = supertest.agent("http://localhost:3000");


server
.get("/serverIsUp")
.expect("Content-type",/json/)
.end(function(err,res){
  if (!res) {
    var err = new Error("SERVER NOT RUNNING");
    throw err;
  }
});