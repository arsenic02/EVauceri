const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const zahtevSchema = new Schema({
  imeGosta: { type: String, required: true },
  prezimeGosta: { type: String, required: true },
  jmbg: { type: String, required: true },
  nazivSmestaja: { type: String, required: true },
  nazivSmestajneJedinice: { type: String, required: true },
  datumOd: { type: Date, required: true },
  datumDo: { type: Date, required: true },
  stanodavacMejl: {type:String , required:true},
  vaucer: {type:Boolean, required:true},
  mesto: {type: String, required:true},
  ulica: {type: String, required:true},
  status: {type: String, default:"Na čekanju"}//Na čekanju, Odobren, Odbijen
});

module.exports = mongoose.model('Zahtev', zahtevSchema);
