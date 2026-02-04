const mongoose = require("mongoose");
const Zahtev = require('../models/ZahtevModel');

//Kreira zahtev
const postZahtev = async (req, res) => {
  try {
    const { imeGosta, prezimeGosta, jmbg, nazivSmestaja, nazivSmestajneJedinice, datumOd, datumDo,stanodavacMejl,vaucer,mesto,ulica} = req.body;
    if (!datumOd || !datumDo) {
      return res.status(400).json({ error: "DatumOd i DatumDo su obavezni." });
    }
    console.log("Pocetak")
    console.log("Ime gosta:", imeGosta);
    console.log("Prezime gosta:", prezimeGosta);
    console.log("JMBG:", jmbg);
    console.log("Naziv smeštaja:", nazivSmestaja);
    console.log("Naziv smeštajne jedinice:", nazivSmestajneJedinice);
    console.log("Datum od:", datumOd);
    console.log("Datum do:", datumDo);
    console.log("Stanodavac mejl:", stanodavacMejl);
    console.log("Vaučer:", vaucer);
    console.log("Mesto:", mesto);
    console.log("Ulica:", ulica);
    const noviZahtev = await Zahtev.create({ imeGosta, prezimeGosta, jmbg, nazivSmestaja, nazivSmestajneJedinice, datumOd, datumDo,stanodavacMejl,vaucer, mesto,ulica });
    res.status(200).json(noviZahtev);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const getZahteviPoStanodavcu = async (req, res) => {
  const { mejl, status} = req.body; // Ispravka ovdje, treba biti req.params.stanodavacId umjesto req.params.stanodavacProfile
  try {
    const zahtevi = await Zahtev.find({ stanodavacMejl: mejl, status:status}); // Promjena ovdje, tražimo zahtjeve čiji stanodavacId odgovara dobijenom stanodavacId
    res.status(200).json(zahtevi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};


const getZahteviPoGostu = async (req, res) => {
  const { jmbg } = req.body;
  try {
    const zahtevi = await Zahtev.find({ jmbg: jmbg, status: { $in: ["Odobren", "Odbijen", "Na čekanju"] } }); 
    res.status(200).json(zahtevi);
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 
};


// READ - Prikaz svih zahteva
const getSveZahteve = async (req, res) => {
  try {
    const zahtevi = await Zahtev.find();
    res.status(200).json(zahtevi);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ - Prikaz jednog zahteva po ID-u
const getZahtev = async (req, res) => {
  const {id} = req.body;
  try {
    const zahtev = await Zahtev.findById(id);
    if (!zahtev) {
      return res.status(404).json({ success: false, error: 'Zahtev nije pronađen' });
    }
    res.status(200).json(zahtev);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE - Brisanje zahteva
const deleteZahtev = async (req, res) => {
  try {
    const zahtev = await Zahtev.findByIdAndDelete(req.params.id);
    if (!zahtev) {
      return res.status(404).json({ success: false, error: 'Zahtev nije pronađen' });
    }
    res.status(200).json({ success: true, data: zahtev });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateStatusZahtev = async (req, res) => {
  const { id, status } = req.body;

  try {
    const zahtev = await Zahtev.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Ova opcija vraća ažurirani dokument
    );

    if (!zahtev) {
      return res.status(404).json({ success: false, error: 'Zahtev nije pronađen' });
    }

    res.status(200).json({ success: true, data: zahtev });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getStanodavacMejl = async (req, res) => {
  const { nazivSmestaja, nazivSmestajneJedinice } = req.body;
  try {
    const zahtev = await Zahtev.findOne({ nazivSmestaja:nazivSmestaja, nazivSmestajneJedinice:nazivSmestajneJedinice });
    res.status(200).json(zahtev.stanodavacMejl);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  postZahtev,
  getZahteviPoStanodavcu,
  getSveZahteve,
  getZahtev,
  deleteZahtev,
  updateStatusZahtev,
  getZahteviPoGostu,
  getStanodavacMejl
};
