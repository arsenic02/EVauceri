const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AutoIncrement = require('mongoose-sequence')(mongoose);

const vaucerSchema = new Schema({
  jbv: {type:Number,unique:true},//jedninstveni broj vaucera
  ime: { type: String, required: true },
  prezime: { type: String, required: true },
  jmbg: { type: String, required: true},
  nazivSmestaja: { type: String, required: true },
  nazivSmestajneJedinice: { type: String, required: true },
  mesto: {type:String,required:true},
  ulica:{type:String,required:true},
  stanodavacMejl: {type:String , required:true},//ubacio sam 
  //Потенцијално
  datumOd:{type:Date, required:true},
  datumDo:{type:Date, required:true},
  qrCode: { type: String, default: "" } 
});

vaucerSchema.plugin(AutoIncrement, {inc_field: 'jbv'});

module.exports = mongoose.model('Vaucer', vaucerSchema);
