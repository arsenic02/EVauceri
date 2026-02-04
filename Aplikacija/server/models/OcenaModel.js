const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ocenaSchema = new Schema({
  recenzent:{ type: String, required:true},
  ocena: { type: Number, required: true },
  komentar: { type: String, default: " "},
  datum: { type: Date, default: Date.now }
});

const Ocena = mongoose.model('Ocena', ocenaSchema);

module.exports = Ocena;