var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  author: String, 
  text: String,
});

module.exports = mongoose.model('Note', noteSchema);

