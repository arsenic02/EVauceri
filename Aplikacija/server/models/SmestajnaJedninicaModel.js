const mongoose = require('mongoose');
const Ocena = require('./OcenaModel');
const Schema = mongoose.Schema;

const smestajnaJedinicaSchema = new Schema({
  imeSmestaja:{type: String, required: true},
  imeJedinice: { type: String, required: true },
  brojSobe: { type: Number, required: true },
  klima: { type: Boolean, default: false },
  brojKreveta: { type: Number, required: true },
  kuhinja: { type: Boolean, default: false},
  wifi: { type: Boolean, required: true },
  tv: { type: Boolean, required: true },
  terasa: { type: Boolean, default:false },
  // ocene: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Ocena',default: [] }], // Niz ocena, podrazumevana vrednost niza je prazan niz
  ocene: [{ type: Number,default: [] }], 
  //Kasnije se moze racunati prosecna ocena, i to
  prosecnaOcena: {type: Number, required: false, default: 0},
  cena: {type: Number, required: true}
}, { timestamps: true });

const SmestajnaJedinica = mongoose.model('SmestajnaJedinica', smestajnaJedinicaSchema);

module.exports = SmestajnaJedinica;
