const Stanodavac = require("../models/StanodavacModel");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const createToken = (_id) =>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn: '3d'})
    
    }
// Uzimanje podataka o jednom stanodavcu
const getStanodavacProfil = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Nema stanodavca" });
    }

    try {
        const stanodavac = await Stanodavac.findById(id);
        
        if (!stanodavac) {
            return res.status(404).json({ error: "Stanodavac ne postoji" });
        }

        res.status(200).json(stanodavac);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Azuriranje profila stanodavca
const azurirajStanodavacProfil = async (req, res) => {
    const { id } = req.params;

    try {
        const stanodavacZaAzuriranje = await Stanodavac.findOneAndUpdate(
            {jmbg:id},
            { ...req.body },
            { new: true }
        );

        if (!stanodavacZaAzuriranje) {
            return res.status(404).json({ error: "Stanodavac ne postoji" });
        }

        res.status(200).json(stanodavacZaAzuriranje);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Kreiranje novog stanodavca
const kreirajStanodavac = async (req, res) => {
    const { ime, prezime, jmbg, ID, brojTelefona, mejl, brojKartice, vaziDo, cvcKod, lozinka } = req.body;

    let praznaPolja = [];

    // Provera praznih polja
    if (!ime) {
        praznaPolja.push("ime");
    }
    if (!prezime) {
        praznaPolja.push("prezime");
    }
    if (!jmbg) {
        praznaPolja.push("jmbg");
    }
    if (!ID) {
        praznaPolja.push("ID");
    }
    if (!brojTelefona) {
        praznaPolja.push("brojTelefona");
    }
    if (!mejl) {
        praznaPolja.push("mejl");
    }
    if (!brojKartice) {
        praznaPolja.push("brojKartice");
    }
    if (!vaziDo) {
        praznaPolja.push("vaziDo");
    }
    if (!cvcKod) {
        praznaPolja.push("cvcKod");
    }
    if (!lozinka) {
        praznaPolja.push("lozinka");
    }

    if (praznaPolja.length > 0) {
        return res.status(400).json({
            error: "Popunite sledeća polja: " + praznaPolja.toString(),
            praznaPolja,
        });
    }

    try {
        const stanodavac = await Stanodavac.create({
            ime,
            prezime,
            jmbg,
            ID,
            brojTelefona,
            mejl,
            brojKartice,
            vaziDo,
            cvcKod,
            lozinka,
        });

        res.status(200).json(stanodavac);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Brisanje stanodavca
const obrisiStanodavac = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Nema stanodavca" });
    }

    try {
        const stanodavacZaBrisanje = await Stanodavac.findByIdAndDelete(id);

        if (!stanodavacZaBrisanje) {
            return res.status(404).json({ error: "Stanodavac ne postoji" });
        }

        res.status(200).json(stanodavacZaBrisanje);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


// login a user
const loginStanodavac = async (req, res) => {
    const {mejl, lozinka} = req.body
    try {
      const stanodavac = await Stanodavac.login(mejl,lozinka)
      const token = createToken(stanodavac._id)
      const role = 'stanodavac'
      console.log(stanodavac)
      res.status(200).json({token,mejl, stanodavacProfile:stanodavac});
    } catch (error) {
        res.status(400).json({ error: "STANODAVAC: "+error.message })
    }
  }
  
  // signup a user
const registerStanodavac = async (req, res) => {
    const { ime, prezime, jmbg, ID, brojTelefona, mejl, /*ocena*/ brojKartice, vaziDo, cvcKod, lozinka /*ocene*/} = req.body
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
    if(!ID){
        praznaPolja.push('ID')
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
    return res.status(400).json({error:'Pounite sledeca polja stanodavaca: ' + praznaPolja.toString() ,praznaPolja})
    }
    //dodaj dokument u bazu
    try {
      if(!validator.isEmail(mejl)){
        throw Error('Mejl nije validan!')
      }
      if(!validator.isStrongPassword(lozinka)){
        throw Error('Lozinka nije dovoljno jaka!')
      }
      const stanodavac = await Stanodavac.register( ime, prezime, jmbg, ID, brojTelefona, mejl, brojKartice, vaziDo, cvcKod, lozinka )
      const token = createToken(stanodavac._id)
      res.status(200).json({token,mejl,stanodavacProfile:stanodavac});
    } catch (error) {
      res.status(400).json({ error: "Doslo je do greske prilikom registrovanja: " + error.message });
    }
  }

module.exports = {
    getStanodavacProfil,
    azurirajStanodavacProfil,
    kreirajStanodavac,
    obrisiStanodavac,
    loginStanodavac,
    registerStanodavac
    // getZahteviPoStanodavcu
};
