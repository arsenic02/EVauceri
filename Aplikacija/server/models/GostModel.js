const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema

const gostSchema = new Schema({//prvi argument kako objekat izgleda
    ime: { type: String, required: true },
    prezime: { type: String, required: true },
    jmbg: { type: String, required: true, unique: true },
    mestoPrebivalista: { type: String, required: true },
    brojTelefona: { type: String, required: true, unique: true },
    mejl: { type: String, required: true,unique: true },
    ocena: { type: Number, default: 0 },//Treba da bude referenca na ocenu
    poseceneLokacije: [{ type: String, default: ""}],
    brojKartice: { type: String, required: true, unique: true },
    vaziDo: { type: String, required: true },
    cvcKod: { type: String, required: true },
    lozinka: {type: String, required: true}
}, {timestamps: true})

  // static signup method
  gostSchema.statics.register = async function(ime, prezime, jmbg, mestoPrebivalista, brojTelefona, mejl, ocena, poseceneLokacije, brojKartice, vaziDo, cvcKod, lozinka) {
  const exists = await this.findOne({ mejl })

  if (exists) {
    throw Error('Mejl koji ste uneli se vec je vec registrovan')
  }
  
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(lozinka, salt)

  const gost = await this.create({
    ime,
    prezime,
    jmbg,
    mestoPrebivalista,
    brojTelefona,
    mejl,
    ocena,
    poseceneLokacije,
    brojKartice,
    vaziDo,
    cvcKod,
    lozinka: hash
  })

  return gost
};

gostSchema.statics.login = async function(mejl,lozinka){

  const gost = await this.findOne({ mejl })

  if (!gost) {
    throw Error('Ne postoji nalog sa mejlom koji ste uneli')
  }

  const match = await bcrypt.compare(lozinka, gost.lozinka)
 
  if(!match)
    {
      throw Error('Pogresna lozinka')
    }
  return gost
}
module.exports = mongoose.model('Gost', gostSchema)

