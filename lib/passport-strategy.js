var Basic = require('passport-http').BasicStrategy;
var User = require('../model/user.js');

module.exports = function(passport){
  passport.use('basic', new Basic({}, function(email, password, done){
    console.log('HIT BASIC PASSPORT STRAT');
    User.findOne({'basic.email': email}, function(err, user){
      if (err) {
        return done(err);
      }
      if (!user) return done('UNAUTHORIZED: user not found');

      user.checkPassword(password, function(err, data){
        if (err) done(err);
        if (data) return done(null, user);
        done("UNAUTHORIZED: password invalid"); 

      });
    });
  }));
};
