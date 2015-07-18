'use strict';

var Note = require('../model/note.js');
var bodyparser = require('body-parser');

module.exports = function(router){
  // parse req.body
  router.use(bodyparser.json());
  
  // GET
  // /notes
  // success: -> {success: true, notes: [Note]}
  // failure: -> {success: false, err: String}
  router.get('/notes', function(req, res){
    console.log('HIT_ROUTE: GET /api/notes');
    Note.find({}, function(err, data){
      if (err) {
        //console.log('ERROR GET /notes', err.message);
        return res.status(500).json({
          success: false, 
          err: "Internal Server Error: Database Error"
        });
      }
      res.status(200).json({
        success: true,
        notes: data
      });
    });
  });
 
  // GET 
  // /notes/:id
  // success: -> {success: true, note: Note}
  // failure: -> {success: false, err: String}
  router.get('/notes/:id', function(req, res){
    console.log('HIT_ROUTE: GET /api/notes/:id');
    Note.find({_id: req.params.id}, function(err, data){
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          err: "Internal Server Error: Database Error"
        });
      }
        res.status(200).json({
          success: true,
          note: data
        });
    });
  });

  // POST
  // /notes :: body -> {text: String, eat: EatToken}
  // success: -> {success: true, note: String}
  // failure: -> {success: false, err: String}
  router.post('/notes', function(req, res){
    //console.log('HIT_ROUTE: POST /api/notes');
    var data = { author: 'lulwat-temp-author', text: req.body.text };
    var note = new Note(data);
    note.save(function(err, data){
      if (err){
        //console.log('Error POST /notes');
        return res.status(500).json({
          success: false, 
          err: "Internal Server Error: Database Error"
        }); 
      }
      res.status(200).json({
        success: true,
        note: data
      });
    });
  });

  // put 
  router.put('/notes', function(req, res){
  });
  
  // del
  router.put('/notes', function(req, res){
  });


};
