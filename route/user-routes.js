var bodyparser = require('body-parser');
var User = require('../model/user.js');
var eatAuth = require('../lib/eatauth.js');



module.exports = function(router, passport){
  router.use(bodyparser.json());


  router.post('/user', function(req, res){
    var newUser = new User({username: req.body.username});
    newUser.basic.email = req.body.email;
    var fromBase64toAlpha = function(str){
      return new Buffer(str, 'base64').toString('utf8');
    }
    console.log('passss thing', fromBase64toAlpha(req.body.password));
    newUser.genPasswordHash(fromBase64toAlpha(req.body.password), function(err, data){
      if (err) {
        res.status(500).json({
          success: false,
          err: "INTERNAL SERVER ERROR: failed to complete request"
        });
      }
      newUser.basic.password = data;
      console.log('newuser pass', newUser.basic.password);
      newUser.save(function(err, data){
        if(err){
          console.error(err);
          return res.status(500).json({
            success: false,
            err: "INTERNAL SERVER ERROR: failed to complete requeset"
          });
        }

        newUser.generateEatToken(process.argv.APP_SECRET, function(err, eatToken){
          if (err){
            console.error(err);
            return res.status(500).json({
              success:false,
              err: "INTERNAL SERVER ERROR: could not complete request"
            });
          }  

          res.status(200).json({
            success: true,
            eatToken: eatToken
          });
        });
      });
    });
  });

  router.get('/user/login', passport.authenticate('basic', {session: false}),  function(req, res){
        req.user.generateEatToken('lulwat slug', function(err, eatToken){
          if (err){
            console.error(err);
            return res.status(500).json({
              success:false,
              err: "INTERNAL SERVER ERROR: could not complete request"
            });
          }  

          console.log('hey');
          res.status(200).json({
            success: true,
            eatToken: eatToken
          });
        });
  });
};
