const mongoose = require("mongoose");
const Ocena = require("../models/OcenaModel");

// Uzimanje podataka o jednom smeštaju
const getOcena = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Nema ocene" });
    }

    try {
        const ocena = await Ocena.findById(id);
        
        if (!ocena) {
            return res.status(404).json({ error: "Ocena ne postoji" });
        }

        res.status(200).json(ocena);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


const createOcena = async (req, res) => {
    const { recenzent, ocena, komentar } = req.body;

    let praznaPolja = [];

    // Provera praznih polja
    if (!recenzent) {
        praznaPolja.push("recenzent");
    }
    if (!ocena) {
        praznaPolja.push("ocena");
    }

    try {
        const newOcena = await Ocena.create({
            recenzent,
            ocena,
            komentar
        });

        res.status(200).json(newOcena);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteOcena = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: "Ne postoji ocena sa datim ID-jem" });
    }

    try {
        const deletedOcena = await Ocena.findByIdAndDelete(id);

        if (!deletedOcena) {
            return res.status(404).json({ error: "Ocena ne postoji" });
        }

        res.status(200).json(deletedOcena);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getOcena,
    createOcena,
    deleteOcena,
};
