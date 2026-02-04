const mongoose = require("mongoose");
const Vaucer = require('../models/VaucerModel');

//Vraca vaucer za odredjenog gosta
const getVaucerGosta = async (req, res) => {
  const { jmbg } = req.body;
  try {
    const vaucer = await Vaucer.findOne({ jmbg: jmbg});   
     res.status(200).json(vaucer);   
  } catch (error) {
    res.status(500).json({ error: error.message });
  } 

};

const createVaucer = async (req,res) => {
    try {
        const noviVaucer = await Vaucer.create({
            ime: req.body.ime,
            prezime: req.body.prezime,
            jmbg: req.body.jmbg,
            nazivSmestaja: req.body.nazivSmestaja,
            nazivSmestajneJedinice: req.body.nazivSmestajneJedinice,
            mesto: req.body.mesto,
            ulica: req.body.ulica,
            stanodavacMejl: req.body.stanodavacMejl,
            datumOd: req.body.datumOd,
            datumDo: req.body.datumDo
        });
        
        const formattedDatumOd = new Date(noviVaucer.datumOd).toLocaleDateString('sr-RS');
        const formattedDatumDo = new Date(noviVaucer.datumDo).toLocaleDateString('sr-RS');
        
        const voucherData = `JBV: ${noviVaucer.jbv}, 
        Ime: ${noviVaucer.ime}, 
        Prezime: ${noviVaucer.prezime}, 
        JMBG: ${noviVaucer.jmbg}, 
        Naziv smestaja: ${noviVaucer.nazivSmestaja}, 
        Naziv smestajne jedinice: ${noviVaucer.nazivSmestajneJedinice}, 
        Mesto: ${noviVaucer.mesto}, 
        Ulica: ${noviVaucer.ulica}, 
        Datum od: ${formattedDatumOd}, 
        Datum do: ${formattedDatumDo}`;     
        
        const updatedVaucer = await Vaucer.findByIdAndUpdate(
            noviVaucer._id,
            { $set: { qrCode: voucherData } },
            { new: true }
        );
        res.status(201).json({ updatedVaucer});
    } catch (error) {
        console.error('Error creating voucher:', error);
        res.status(500).send('Internal Server Error');
    }
};

const getVauceriZaStanodavca = async (req, res) => {
  const { mejl } = req.params;
  try {
    const vouchers = await Vaucer.find({ stanodavacMejl: mejl });
    res.status(200).json(vouchers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getVaucerGosta,
  createVaucer,
  getVauceriZaStanodavca,
  // getStanodavacMejlZaVaucer
};
