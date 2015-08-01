'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var passport = require('passport');

// setup env vars
process.env.PORT = process.env.PORT || 3000;
process.env.MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/notes_dev';
process.env.APP_SECRET = process.env.APP_SECRET || 'this is a bogus dev app secret';

// connect to mongo
mongoose.connect(process.env.MONGOLAB_URI);

// setup passport stratagy
app.use(passport.initialize());
require('./lib/passport-strategy.js')(passport);

// init routes routers
var noteRouter = express.Router();
var userRouter = express.Router();

// setup routes
require('./route/note-routes.js')(noteRouter);
require('./route/user-routes.js')(userRouter, passport);

// load routes
app.use('/api/', noteRouter);
app.use('/api/', userRouter);

app.listen(process.env.PORT, function(){
  console.log('server is running on PORT: ' + process.env.PORT);
});
