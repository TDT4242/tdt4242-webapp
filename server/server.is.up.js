var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3000");

describe('Testing if server is running', function() {
  it("Test if server is up",function(done) {
    setTimeout(function() {
      server
      .get("/serverIsUp")
      .expect("Content-type",/json/)
      .end(function(err,res){
        res.should.not.equal(null);
        res.status.should.equal(200);
        done();
      });
    }, 2000)
  });
})
