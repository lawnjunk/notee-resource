var Basic = require('passport-http').BasicStrategy;
var User = require('../model/user.js');

module.exports = function(passport){
  passport.use('basic', new Basic({}, function(email, password, done){
    User.findOne({'basic.email': email}, function(err, user){
      if (err) return done(err);
      if (!user) return done('BAD REQUEST: no such user');

      console.log(user);
      user.checkPassword(password, function(err, data){
        if (err) done(err);
        console.log('password passed', data);
        if (data) return done(null, data);
        done("INPUT ERROR: incorect password"); 

      });
    });
  }));
};
