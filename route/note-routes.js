'use strict';

var Note = require('../model/note.js');
var bodyparser = require('body-parser');

module.exports = function(router){
  // parse req.body
  router.use(bodyparser.json());
  
  // GET
  // /notes
  // success: -> {success: true, notes: [Note]}
  // failure: -> {success: false, err: "err msg"}
  router.get('/notes', function(req, res){
    console.log('HIT_ROUTE: GET /api/notes');
    Note.find({}, function(err, data){
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false, 
          err: "Internal Server Error: Database Error"}); 
      }
      res.status(200).json({
        success: true,
        notes: data});
    }
  });
  
  // /notes
  // success: -> {success: true, note: Note}
  // failure: -> {success: false, err: "err msg"}
  router.get('/notes/:id', function(req, res){
  });

  // post
  router.get('/notes', function(req, res){
  });

  // patch
  router.get('/notes', function(req, res){
  });
  
  // del
  router.get('/notes', function(req, res){
  });

};
