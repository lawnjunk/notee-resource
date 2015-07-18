'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();
var passport = require('passport');

console.log('argv ', process.argv);

// setup env vars
var PORT = process.env.PORT || 3000;
var MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/notes_dev';

// connect to mongo
mongoose.connect(MONGOLAB_URI);

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

app.listen(PORT, function(){
  console.log('server is running on PORT: ' + PORT);
});
