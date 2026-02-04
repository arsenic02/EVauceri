const mongoose = require('mongoose');
const Stanodavac = require('./StanodavacModel');
const Naselje = require('./NaseljeModel');  
const Schema = mongoose.Schema;

const smestajSchema = new Schema({
    naziv: { type: String, required: true },
    udaljenostOdCentra: { type: Number, required: true },
    brojSoba: { type: Number, required: true },
    naseljeIme: {type:String,required:true},
    ulica:{type:String,required:true},
    //naselje: { type: Schema.Types.ObjectId, ref: 'Naselje', required: true },  //dodato
    //adresa: { type: String, required: true },
    vlasnik: { type: String, required: true },
    dvoriste: { type: Boolean, default: false },
    brojParkingMesta: { type: Number, default: 0 },
    slike: [{ type: String, default:" " }] , // Niz stringova koji sadrži URL-ove slika
    prosecnaOcena: {type: Number, required: false, default:0}
}, { timestamps: true });

module.exports = mongoose.model('Smestaj', smestajSchema);
