'use strict';

var mongoose = require('mongoose');
var express = require('express');
var app = express();

var MONGOLAB_URI = process.env.MONGOLAB_URI || 'mongodb://localhost/notes_dev'

mongoose.connect(MONGOLAB_URI);

var port = process.env.PORT || 3000;

app.listen(port, function(){
  console.log('server is running on port: ' + port);
});
