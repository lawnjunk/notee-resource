//delete require.cache;
var chai =  require('chai');
var expect = chai.expect;
var chaihttp = require('chai-http');
chai.use(chaihttp);
var User = require('../model/user.js');
var NOTES_APP_URL = 'localhost:3000';

//console.log('request uc', uc.uncache);


var server = require('../server.js');

describe('route/user-routes.js', function(){
  var createUserEatToken;
  var loginUserEatToken;

  before(function(done){
    if (!server.isRunning){ 
      server.listen(3000, function(){
        console.log(server);
        console.log('starting server on port 3000');
        done();
      });
    } else {
      done();
    }

  });

  describe('POST /api/user', function(){
    describe('with invalid password', function(done){
      var body = {
        username: 'test',
        email: 'test@test.com',
        password:  ''
      };

      var response;

      before(function(done){
        chai.request(NOTES_APP_URL)
          .post('/api/user')
          .send(body)
          .end(function(err, res){
            response = res;
            done();
        });
      });

      it('res.status should equal 400', function(){
        expect(response.status).to.eql(400);
      });

      it('res.body.success should be false', function(){
        expect(response.body.success).to.eql(false);
      });

      it('res.body.err should be "INVALID PASSWORD"', function(){
        expect(response.body.err).to.eql("INVALID PASSWORD");
      });
    });

    describe('with valid password', function(done){
      var encoded = new Buffer('testpassword').toString('base64');
      console.log('encoded:', encoded);
      var body = {
        username: 'test',
        email: 'test@test.com',
        password:  encoded
      };

      var response;

      before(function(done){
        chai.request(NOTES_APP_URL)
          .post('/api/user')
          .send(body)
          .end(function(err, res){
            response = res;
            done();
        });
      });

      it('res.status should equal 200', function(){
        expect(response.status).to.eql(200);
      });

      it('res.body.success should be true', function(){
        expect(response.body.success).to.eql(true);
      });

      it('res.body.eatToken should contain eat token', function(){
        expect(typeof(response.body.eatToken)).to.eql("string");
        createUserEatToken = response.body.eatToken;
      });
    });

  });

  describe('GET /api/user/login', function(){
    describe('with invalid password', function(){
      var response;
      before(function(done){
        chai.request(NOTES_APP_URL)
          .get('/api/user/login')
          .auth('test@test.com:wrongpassword')
          .end(function(err, res){
            response = res;
            done();
          });
      });

      it('res.status should equal 500', function(){
        expect(response.status).to.eql(401);
      });

      it('res.body.success should equal flase', function(){
        expect(response.body.success).to.eql(false);
      });

      it('res.body.err should equal "UNAUTHORIZED: pasword invalid"', function(){
        expect(response.body.err).to.eql("UNAUTHORIZED: password invalid");
      });
    });

    describe('with invalid email', function(){
      var response;
      before(function(done){
        chai.request(NOTES_APP_URL)
          .get('/api/user/login')
          .auth('wrong@test.com:wrongpassword')
          .end(function(err, res){
            response = res;
            done();
          });
      });

      it('res.status should equal 401', function(){
        expect(response.status).to.eql(401);
      });
      
      it('res.body.success should equal false', function(){
        expect(response.body.success).to.eql(false);
      });

      it('res.body.err should equal "UNAUTHORIZED: user not found"', function(){
        expect(response.body.err).to.eql("UNAUTHORIZED: user not found");
      });
    });

    describe('with vaild email and password', function(){
      var response;
      before(function(done){
        chai.request(NOTES_APP_URL)
          .get('/api/user/login')
          .auth('test@test.com:testpassword')
          .end(function(err, res){
            response = res;
            done();
          });
      });

      it('res.status should equal 200', function(){
        expect(response.status).to.eql(200);
      });
      
      it('res.body.success should equal true', function(){
        expect(response.body.success).to.eql(true);
      });

      it('res.body.eatToken should contain eat token',  function(){
        expect(typeof(response.body.eatToken)).to.eql('string');
        loginUserEatToken = response.body.eatToken;
      });

    });
    
  });

  describe('compare create and login eat token', function(){
    it('create user eat token should equal user login eat token', function(){
      expect(createUserEatToken).to.eql(loginUserEatToken);
    });
  });
  
  after(function(done){
    User.remove({}, function(err, data){
      if (err) console.log(err);
      server.close(function(){
        console.log('Server has shutdown'); 
        done();
      });
    });
  });
});

