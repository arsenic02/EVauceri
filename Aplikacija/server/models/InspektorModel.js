const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const inspektorSchema = new Schema({
    ime: { type: String, required: true },
    prezime: { type: String, required: true },
    jmbg: { type: String, required: true, unique: true },
    ID: { type: String, required: true, unique: true },
    brojTelefona: { type: String, required: true, unique: true },
    mejl: { type: String, required: true, unique: true },
    lozinka: { type: String, required: true }
}, { timestamps: true });


  // static signup method
  inspektorSchema.statics.register = async function(ime, prezime, jmbg, ID, brojTelefona, mejl, lozinka) {
    const exists = await this.findOne({ mejl })
    if (exists) {
      throw Error('Mejl koji ste uneli se vec je vec registrovan')
    }
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(lozinka, salt)
    const inspektor = await this.create({
        ime, 
        prezime, 
        jmbg,
        ID,
        brojTelefona, 
        mejl, 
        lozinka: hash
    })
    return inspektor
  }
  
  inspektorSchema.statics.login = async function(mejl,lozinka){
    const inspektor = await this.findOne({ mejl })
  
    if (!inspektor) {
      throw Error('Ne postoji nalog sa mejlom koji ste uneli')
    }
  
    const match = await bcrypt.compare(lozinka, inspektor.lozinka)
   
    if(!match)
      {
        throw Error('Pogresna lozinka')
      }
    return inspektor
  }

module.exports = mongoose.model('Inspektor', inspektorSchema);
