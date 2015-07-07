'use strict';

var mocha = require('mocha');
var expect = require('chai').expect;
var chai = require('chai');
var chaihttp = require('chai-http');
chai.use(chaihttp);

describe('route/notes-routes.js', function(){
  describe('POST: /api/notes', function(){
    describe('with valid input', function(){
      it('should return success true', function(done){
        assert.fail();
        done();
      });

      it('should have a note object', function(done){
        assert.fail();
        done();
      });
    });
  });
});
