var bodyparser = require('body-parser');
var User = require('../model/user.js');
var eatAuth = require('../lib/eatauth.js');

module.exports = function(router, passport){
  router.use(bodyparser.json());

  router.post('/user', function(req, res){
    console.log('HIT-ROTUE: POST /api/user');
    var newUser = new User({username: req.body.username});
    newUser.basic.email = req.body.email;
    var fromBase64toAlpha = function(str){
      var decoded =  new Buffer(str, 'base64').toString('utf8').trim();
      if (/^([a-zA-Z0-9]|(-|_|!|@|#|\$|%|\^|&|\*|\)|\())+$/.test(decoded)){
        return decoded;
      } else {
        return null;
      }
    };

    var decoded = fromBase64toAlpha(req.body.password);
    if (!decoded){
      console.log('password was not correct char range or was not base64');
      res.status(400).json({success:false, err: 'INVALID PASSWORD'});
    }

    newUser.genPasswordHash(decoded, function(err, data){
      if (err) {
        console.log('failed to hash password');
        console.error(err);
        res.status(500).json({
          success: false,
          err: "INTERNAL SERVER ERROR: failed to complete request"
        });
      }
      newUser.basic.password = data;
      newUser.save(function(err, data){
        if(err){
          console.log('failed to save user');
          console.error(err);
          return res.status(500).json({
            success: false,
            err: "INTERNAL SERVER ERROR: failed to complete requeset"
          });
        }

        newUser.generateEatToken(process.env.APP_SECRET, function(err, eatToken){
          if (err){
            console.log('failed to generate eat');
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

  //router.get('/user/login', passport.authenticate('basic', {session:false}),  function(req, res){
   //console.log('HIT-ROUTE: GET api/usr/login');
    //req.user.generateEatToken(process.env.APP_SECRET,  function(err, eatToken){
      //if (err){
        //console.error(err);
        //return res.status(500).json({
          //success:false,
          //err: "INTERNAL SERVER ERROR: could not complete request"
        //});
      //}  

      //res.status(200).json({
        //success: true,
        //eatToken: eatToken
      //});
    //});
  //});
  //

  router.get('/user/login', function(req,res,next){
    passport.authenticate('basic', function(err, user, info){
      if (err){
        console.error(err);
        switch(err){
          case "USER":
            res.status(401).json({
              success: false,
              err: "UNAUTHORIZED: no such user"
            });
            break;
          case "PASSWORD":
            res.status(401).json({
              success: false,
              err: "UNAUTHORIZED: incorrect password"
            });
            break;
          default:
            res.status(500).json({
              success: false,
              err: "INTERNAL SERVER ERROR: could not complete request"
            });
            break;
        }
        return next();
      }

      user.generateEatToken(process.env.APP_SECRET,  function(err, eatToken){
        console.log('generateEatToken');
        if (err){
          console.error(err);
          res.status(500).json({
            success:false,
            err: "INTERNAL SERVER ERROR: could not complete request"
          });
          return next();
        }  

        res.status(200).json({
          success: true,
          eatToken: eatToken
        });
        return next();
      });
    })(req, res, next);;
  });
};
