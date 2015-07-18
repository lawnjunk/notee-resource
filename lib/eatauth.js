var eat = require('eat');
var User = require('../model/user.js');

module.exports = function(secret){
  return function(req, res, next){
    var token = req.headers.eat || req.body.eat;
    console.log('sup');

    if (!token) {
      console.error('unauthorized no token in request');
      res.status(400).json({
        success:false,
        err: 'INVALID INPUT: must provid valied eat token'
      });
    }

    eat.decode(token, secret, function(err, decoded){
      if (err) {
        console.error(err);
        return res.status(401).json({
          success:false,
          err: 'INVALID INPUT: must provide valid eat token'
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
          connect.log('no user found for that token');
          return res.status(401).json({
            success: false,
            err: 'BAD REQUEST: not authorized'
          });
        }

        req.user = user;
        return next();
      });
    });
  };
};
