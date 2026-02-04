const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);


const evidencijaSchema = new Schema({
  jbe: {type:Number,unique:true},
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  jmbg: { type: String, required: true},
  nazivSmestaja: { type: String, required: true },
  nazivSmestajneJedinice: { type: String, required: true },
  stanodavacMejl: {type:String , required:true},
  brojVaucera: {type:String, required:true},//number
  datumDolaska: {type:Date, required:true},
  datumOdlaska:{type:Date, default: null},
  status:{type: String, required: true, default: "Prijavljen"}
});

evidencijaSchema.plugin(AutoIncrement, {inc_field: 'jbe'});

module.exports = mongoose.model('Evidencija', evidencijaSchema);
