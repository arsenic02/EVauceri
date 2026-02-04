const mongoose = require("mongoose");
const Evidencija = require('../models/EvidencijaModel');

const getEvidencijeStanodavca = async (req,res) =>{
    const{mejl} = req.body;//.mejl
    try{
        const evidencije = await Evidencija.find({stanodavacMejl:mejl});
        res.status(200).json(evidencije);
        // res.status(200).json({ evidencije});
    }
    catch (error) {
        console.error('Error geting evidencije:', error);
        res.status(500).send('Internal Server Error');
    }
}

const getEvidencija = async (req,res) => {
    const { id } = req.body; 
    try{
        const evidencija = await Evidencija.findOne({jbe: id});
        res.status(200).json({ evidencija });
    }
    catch (error) {
        console.error('Error geting evidencija:', error);
        res.status(500).send('Internal Server Error');
    }

}

const updateEvidencija = async (req, res) => {
    const { id } = req.body; 
    const datumOdlaska = new Date().toLocaleDateString('sr-RS')
    try {
        const evidencija = await Evidencija.findOneAndUpdate (
            {jbe:id},
            { datumOdlaska: datumOdlaska, status:"Odjavljen" },
            { new: true }
        );
        
        if (!evidencija) {
            return res.status(404).send('Evidencija not found');
        }
        res.status(200).json({ evidencija });
    } catch (error) {
        console.error('Error updating evidencija:', error);
        res.status(500).send('Internal Server Error');
    }
};


const createEvidencija = async (req,res) => {
    try {

        const evidencija = await Evidencija.create({
            ime: req.body.ime,
            prezime: req.body.prezime,
            jmbg: req.body.jmbg,
            nazivSmestaja: req.body.nazivSmestaja,
            nazivSmestajneJedinice: req.body.nazivSmestajneJedinice,      
            stanodavacMejl: req.body.stanodavacMejl,
            brojVaucera: req.body.jbv,
            datumDolaska: new Date(req.body.datumDolaska).toLocaleDateString('sr-RS'),
        });
        res.status(200).json({ evidencija});
    } catch (error) {
        console.error('Error creating evidencija:', error);
        res.status(500).send('Internal Server Error');
    }
};


module.exports = {
    getEvidencijeStanodavca,
    getEvidencija,
    updateEvidencija,
    createEvidencija
};
