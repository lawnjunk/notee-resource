'use strict';

var Note = require('../model/note.js');
var mocha = require('mocha');
var expect = require('chai').expect;
var chai = require('chai');
var chaihttp = require('chai-http');
var fork  = require('child_process').fork;
chai.use(chaihttp);

var NOTES_APP_URL = 'localhost:3000';
//process.env.MONGOLAB_URI = 'mongodb://localhost/notes_app_test';


describe('route/notes-routes.js', function(){
  var server;
  before(function(done){
    var serverOptions = { 
      env: { MONGOLAB_URI: 'mongodb://localhost/notes_app_test'} ,
      silent: true
      
    };
    server = fork('./server.js', [], serverOptions);

    done();
  });

  it('',function(){
    
  });

  describe('POST: /api/notes', function(){
  
    describe('with valid input', function(){
      it('response should be succesfull', function(done){
        chai.request(NOTES_APP_URL)
          .post('/api/notes')
          .send({
            text: 'get a pepper shaker for the kitchen',
            eat: 'this is a test eat'})
          .end(function(err, res){
            if (err) {
              expect.fail(null, null, "chai request error", '<3');
              done();
            }
            expect(res.body.success).to.eql(true); 
            expect(res.body.note.text).to.eql('get a pepper shaker for the kitchen');
            expect(res.body.note.author).to.eql('lulwat-temp-author');
            expect(!!res.body.note._id).to.eql(true);
            done();
          });
      });
    });

    describe('with valid input', function(){
      it('response should be succesfull', function(done){
        chai.request(NOTES_APP_URL)
          .post('/api/notes')
          .send({})
          .end(function(err, res){
            if (err) {
              expect.fail(null, null, "chai request error", '<3');
              done();
            }
            expect(res.body.success).to.eql(false); 
            expect(res.body.err).to.eql('Internal Server Error: Database Error');
            done();
          });
      });
    });

  });

  after(function(done){
    Note.remove({}, function(err, data){
      if (err) console.log(err);
      done();
    });
    server.kill();
    done();
  });
});
