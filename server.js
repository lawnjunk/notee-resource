'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();

// setup env vars
var PORT = process.env.PORT || 3000;
var MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/notes_dev'

// connect to mongo
mongoose.connect(MONGOLAB_URI);

// init routes routers
var noteRouter = express.Router();

// setup routes
require('./route/note-routes.js')(noteRouter);

// load routes
app.use('/api/', noteRouter);

app.listen(PORT, function(){
  console.log('server is running on PORT: ' + PORT);
});
