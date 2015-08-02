var eat = require('eat');
var User = require('../model/user.js');

module.exports = function(secret){
  return function(req, res, next){
    console.log('HIT EAT AUTH MIDDLEWARE');
    var token = req.headers.eat || req.body.eat;

    if (!token) {
      console.error('UNAUTHORIEZED: no token provided');
      return res.status(400).json({
        success:false,
        err: 'UNAUTHORIZED: invalid eat token'
      });
    }

    eat.decode(token, process.env.APP_SECRET, function(err, decoded){
      if (err) {
        console.error(err);
        return res.status(401).json({
          success:false,
          err: 'UNAUTHORIZED: invalid eat token'
        });
      }

      User.findOne({_id: decoded.id}, function(err, user) {
        if (err){
          console.error(err);
          return res.status(500).json({
            success: false,
            err: 'INTERNAL SERVER ERROR: failed to complete request'
          });
        }

        if (!user){
          console.log('no user found for that token');
          return res.status(401).json({
            success: false,
            err: 'UNAUTHORIZED: invalid eat token'
          });
        }
        
        // got to user

        req.user = user;
        return next();
      });
    });
  };
};
