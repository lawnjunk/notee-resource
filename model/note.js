var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var noteSchema = new Schema({
  author: {type: String, required: true},
  text: {type: String, required: true}
});

noteSchema.path('text').validate(/\S+/);

module.exports = mongoose.model('Note', noteSchema);

