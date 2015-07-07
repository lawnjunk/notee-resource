'use strict';

var mocha = require('mocha');
var expect = require('chai').expect;
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

var NOTES_APP_URL = 'localhost:3000';

describe('route/notes-routes.js', function(){
  describe('POST: /api/notes', function(){
    describe('with valid input', function(){
      it('should return success true', function(done){
        chai.request(NOTES_APP_URL)
          .post('/api/notes')
          .send({
            text: 'get a pepper shaker for the kitchen',
            eat: 'this is a test eat'})
          .end(function(err, data){
            if (err) {
              expect.fail(null, null, "chai request error", '<3');
              done();
            }
            expect(success).to.eql(true); 
            done();
          });
      });

      it('should have a note object', function(done){
        assert.fail();
        done();
      });
    });
  });
});
