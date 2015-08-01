var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var eat = require('eat');
var Promise = require('promise');

var userSchema = new Schema({
  username: {type: String, required: true},
  eat: Number,
  basic: {
    email: {type: String, required: true},
    password: {type: String, required: true}
  }
});

userSchema.methods.genPasswordHash = function(password, callback){
  var gensalt = function(){
    return new Promise(function(resolve, reject){
      bcrypt.genSalt(8, null, function(err, data){
        if (err) return reject(err);
        resolve({password: password, salt: data});
      });
    });
  };

  var genhash = function(data){
    return new Promise(function(resolve, reject){
      bcrypt.hash(data.password, data.salt, function(err, data){
        if (err) {
          return reject(err);
        }
        return resolve(data);
      });
    });
  };

  gensalt().then(genhash).then(function(data){
    callback(null, data);
  }).catch(function(err){
    callback(err);
  });;
};

userSchema.methods.checkPassword = function(password, callback){
  bcrypt.compare(password, this.basic.password, callback);
};

userSchema.methods.generateEatToken = function(secret, callback){
  eat.encode({id: this._id}, secret, callback);
};


module.exports = mongoose.model('User', userSchema);
