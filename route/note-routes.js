'use strict';

var Note = require('../model/note.js');
var bodyparser = require('body-parser');
var Promise = require('promise');
var eatauth = require('../lib/eatauth.js')(process.env.APP_SECRET);

module.exports = function(router){
  // parse req.body
  router.use(bodyparser.json());
  
  // GET
  // /notes
  // success: -> {success: true, notes: [Note]}
  // failure: -> {success: false, err: String}
  router.get('/notes', function(req, res){
    console.log('HIT-ROUTE: GET /api/notes');
    Note.find({}, function(err, data){
      if (err) {
        //console.log('ERROR GET /notes', err.message);
        return res.status(500).json({
          success: false, 
          err: "Internal Server Error: could not complete request"
        });
      }
      if (data.length === 0){
        res.status(400).json({
          success:false,
          err: "NO DATA: no notes in database"
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
    console.log('HIT-ROUTE: GET /api/notes/:id');
    Note.find({_id: req.params.id}, function(err, data){
      if (err) {
        console.log(err);
        return res.status(500).json({
          success: false,
          err: "Internal Server Error: could not complete request"
        });
      }
      if (data.length == 1){
        return res.status(200).json({
          success: true,
          note: data[0]
        });
      }
      res.status(400).json({
        success:false,
        err: "BAD REQUEST: could not retrieve note"
      });
    });
  });

  // POST
  // /notes :: body -> {text: String, eat: EatToken}
  // success: -> {success: true, note: String}
  // failure: -> {success: false, err: String}
  router.post('/notes', eatauth, function(req, res){
    console.log('HIT-ROUTE: POST /api/notes');
    var data = { author: req.user.username, text: req.body.text };
    var note = new Note(data);
    note.save(function(err, data){
      if (err){
        //console.log('Error POST /notes');
        return res.status(500).json({
          success: false, 
          err: "Internal Server Error: could not complete request"
        }); 
      }
      res.status(200).json({
        success: true,
        note: data
      });
    });
  });


  // put 
  // /api/notes/:id :: body -> {text: String, eat: eatToken}
  // success: -> {success: true}
  // faliure: -> {success: false, err: String}
  router.put('/notes/:id',eatauth, function(req, res){
    console.log("HIT-ROUTE: PUT /api/notes/:id");

    Note.update({_id: req.params.id, author: req.user.username }, {$set: {text: req.body.text}}, null, function(err, data){
      if (err) {
        console.error(err.message);
        return res.status(400).json({
          success: false,
          err: "BAD REQUEST: note not found"
        });
      }
      if (data.ok){
        if (data.nModified === 1){
          return res.status(200).json({
            success: true,
          });
        } 
        return res.status(404).json({
        success: false,
        err: "BAD REQUEST: note not found"
        });
      }
      res.status(404).json({
        success: false,
        err: "BAD REQUEST: note not found"
      });
    });
  });
  
  // del
  router.delete('/notes/:id', function(req, res){
    console.log("HIT_ROTE: DELETE /api/notes/:id");
    Note.remove({_id: req.params.id}, function(err, data){
      if (err){
        console.error(err);
        return res.status(500).json({
          success: false,
          err: "Internal Server Error: could not complete request"
        });
      }

      if (data.n > 0){
        return res.status(200).json({
          success: true,
          note: data
        }); 
      }

      res.status(400).json({
        success: false,
        note: data
      });

    });
  });


};
