const mongoose = require('mongoose');
const Ocena = require('./OcenaModel');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const stanodavacSchema = new Schema({
    ime: { type: String, required: true },
    prezime: { type: String, required: true },
    jmbg: { type: String, required: true, unique: true },
    ID: { type: String, required: true, unique: true },
    brojTelefona: { type: String, required: true, unique: true },
    mejl: { type: String, required: true, unique: true },
    brojKartice: { type: String, required: true, unique: true },
    vaziDo: { type: String, required: true },
    cvcKod: { type: String, required: true },
    lozinka: { type: String, required: true }
}, { timestamps: true });


  // static signup method
  stanodavacSchema.statics.register = async function(ime, prezime, jmbg, ID, brojTelefona, mejl, brojKartice, vaziDo, cvcKod, lozinka) {
    const exists = await this.findOne({ mejl })
  
    if (exists) {
      throw Error('Mejl koji ste uneli je vec registrovan')
    }
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(lozinka, salt)
  
    const stanodavac = await this.create({
      ime,
      prezime,
      jmbg,
      ID,
      brojTelefona,
      mejl,
      brojKartice,
      vaziDo,
      cvcKod,
      lozinka: hash,
    })
  
    return stanodavac
  };

  stanodavacSchema.statics.login = async function(mejl,lozinka){
    const stanodavac = await this.findOne({ mejl })
  
    if (!stanodavac) {
      throw Error('Ne postoji nalog sa mejlom koji ste uneli')
    }
  
    const match = await bcrypt.compare(lozinka, stanodavac.lozinka)
   
    if(!match){
        throw Error('Pogresna lozinka')
      }
    return stanodavac
  };

module.exports = mongoose.model('Stanodavac', stanodavacSchema);
