//kao gostController.js
const Gost = require("../models/GostModel");
const jwt = require('jsonwebtoken');
const validator  = require('validator');
const mongoose = require("mongoose");

const createToken = (_id) =>{
return jwt.sign({_id},process.env.SECRET,{expiresIn: '3d'})

}
//get single gost
const getGostProfil = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    //ako id nije validan
    return res.status(404).json({ error: "Nema gosta" })
  }
  const gost = await Gost.findById(id)

  if (!gost) {
    return res.status(404).json({ error: "No such gost" })
  }

  res.status(200).json(gost)
}

//azuriraj gosta
const azurirajGostProfil = async (req,res) => {
  const {JMBG} = req.params
console.log(JMBG)
  const gostZaAzuriranje = await Gost.findOneAndUpdate({jmbg:JMBG},{
      ...req.body
  })
  if (!gostZaAzuriranje) {
      return res.status(404).json({ error: "No such gost" })
    }
    res.status(200).json(gostZaAzuriranje)
}

//obrisi probu
const obrisiGosta = async (req, res) => {
  //Uzimanje ID koji je poslat zahtevom kroz reqest objekat, iy propertija params
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //ako id nije validan
    return res.status(404).json({ error: "Nema gost" })
  }

  //U mongoose, property za id se zove _id, pa je značenje sledeće linije:
  //nađi i obriši objekat čiji je property _id jednak parametru id koji smo dobili iz reqest objekta
  const gostZaBrisanje = await Gost.findOneAndDelete({ _id: id })

  if (!gostZaBrisanje) {
    return res.status(404).json({ error: "No such gost" })
  }

  res.status(200).json(gostZaBrisanje)
}

// login a user
const loginGost = async (req, res) => {
  
  const {mejl, lozinka} = req.body

  try {
    const gost = await Gost.login(mejl,lozinka);
    const token = createToken(gost._id);
    const role = 'gost';
    // Fetch the guest profile, dodato
    //const guestProfile = await Gost.findById(gost._id);
    res.status(200).json({token, mejl, guestProfile: gost});
  } catch (error) {
    res.status(400).json({ error: "GOST: "+error.message })
  }
}

// signup a user
const registerGost = async (req, res) => {
  const { ime, prezime, jmbg, mestoPrebivalista, brojTelefona, mejl, ocena, poseceneLokacije, brojKartice, vaziDo, cvcKod, lozinka} = req.body
  let praznaPolja = []
  //Error handling
  if(!ime){
    praznaPolja.push('ime')
  }
  if(!prezime){
    praznaPolja.push('prezime')
  }
  if (!jmbg) {
    praznaPolja.push('jmbg');
  }
  if (!mestoPrebivalista) {
    praznaPolja.push('mestoPrebivalista');
  }
  if (!brojTelefona) {
    praznaPolja.push('brojTelefona');
  }
  if (!mejl) {
    praznaPolja.push('mejl');
  }
  if (!brojKartice) {
    praznaPolja.push('brojKartice');
  }
  if (!vaziDo) {
    praznaPolja.push('vaziDo');
  }
  if (!cvcKod) {
    praznaPolja.push('cvcKod');
  }
  if (!lozinka) {
    praznaPolja.push('lozinka');
  }
  if(praznaPolja.length >0){
  return res.status(400).json({error:'Pounite sledeca polja gosta: ' + praznaPolja.toString() ,praznaPolja})
  }
  //dodaj dokument u bazu
  try {
    if(!validator.isEmail(mejl)){
      throw Error('Mejl nije validan!')
    }
    if(!validator.isStrongPassword(lozinka)){
      throw Error('Lozinka nije dovoljno jaka!')
    }
    const gost = await Gost.register( ime, prezime, jmbg, mestoPrebivalista, brojTelefona, mejl, ocena, poseceneLokacije, brojKartice, vaziDo, cvcKod,lozinka )
    const token = createToken(gost._id)
    res.status(200).json({token,mejl,guestProfile: gost});
  } catch (error) {
    res.status(400).json({ error: "Doslo je do greske prilikom registrovanja: " + error.message });
  }
}

module.exports = {
  getGostProfil,
  azurirajGostProfil,
  obrisiGosta,
  loginGost,
  registerGost
}
