const Inspektor = require("../models/InspektorModel");
const validator = require('validator');
const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");

const createToken = (_id) =>{
    return jwt.sign({_id},process.env.SECRET,{expiresIn: '3d'})  
    }

// Uzimanje podataka o jednom inspektoru
const getInspektorProfil = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Nema inspektora" });
    }

    try {
        const inspektor = await Inspektor.findById(id);
        
        if (!inspektor) {
            return res.status(404).json({ error: "Inspektor ne postoji" });
        }

        res.status(200).json(inspektor);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Azuriranje profila inspektora
const azurirajInspektoraProfil = async (req,res) => {
    const {JMBG} = req.params
  console.log(JMBG)
    const inspektorZaAzuriranje = await Inspektor.findOneAndUpdate({jmbg:JMBG},{
        ...req.body
    })
    if (!inspektorZaAzuriranje) {
        return res.status(404).json({ error: "No such inspektor" })
      }
      res.status(200).json(inspektorZaAzuriranje)
  }


// Kreiranje novog inspektora
const kreirajInspektora = async (req, res) => {
    const { ime, prezime, jmbg, ID, brojTelefona, mejl, lozinka } = req.body;

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
    if (!lozinka) {
        praznaPolja.push("lozinka");
    }

    if (praznaPolja.length > 0) {
        return res.status(400).json({
            error: "Popunite sledeća polja Inspektora: " + praznaPolja.toString(),
            praznaPolja,
        });
    }

    try {
        const inspektor = await Inspektor.create({
            ime,
            prezime,
            jmbg,
            ID,
            brojTelefona,
            mejl,
            lozinka,
        });

        res.status(200).json(inspektor);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Brisanje inspektora
const obrisiInspektora = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Nema inspektora" });
    }

    try {
        const inspektorZaBrisanje = await Inspektor.findByIdAndDelete(id);

        if (!inspektorZaBrisanje) {
            return res.status(404).json({ error: "Inspektor ne postoji" });
        }

        res.status(200).json(inspektorZaBrisanje);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// login a user
const loginInspektor = async (req, res) => {
    const {mejl, lozinka} = req.body
    try {
      const inspektor = await Inspektor.login(mejl,lozinka)//inspektor umesto stanodavca
      const token = createToken(inspektor._id)
      const role = 'inspektor'
      res.status(200).json({token,mejl,inspektorProfile:inspektor});
    } catch (error) {
        res.status(400).json({ error: "INSPEKTOR: "+error.message })
    }
  }
  
  // signup a user
const registerInspektor = async (req, res) => {
    const { ime, prezime, jmbg, ID, brojTelefona, mejl, lozinka} = req.body
    let praznaPolja = []
    //Error handling
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
    if (!lozinka) {
        praznaPolja.push("lozinka");
    }

    if (praznaPolja.length > 0) {
        return res.status(400).json({
            error: "Popunite sledeća polja Inspektora: " + praznaPolja.toString()
        });
    }
    //dodaj dokument u bazu
    try {
      if(!validator.isEmail(mejl)){
        throw Error('Mejl nije validan!')
      }
      if(!validator.isStrongPassword(lozinka)){
        throw Error('Lozinka nije dovoljno jaka!')
      }
      const inspektor = await Inspektor.register(ime, prezime, jmbg, ID, brojTelefona, mejl, lozinka )
      const token = createToken(inspektor._id)
      res.status(200).json({token,mejl, inspektorProfile: inspektor});
    } catch (error) {
      res.status(400).json({ error: "Doslo je do greske prilikom registrovanja: " + error.message });
    }
  }

module.exports = {
    getInspektorProfil,
    azurirajInspektoraProfil,
    kreirajInspektora,
    obrisiInspektora,
    loginInspektor,
    registerInspektor
};
