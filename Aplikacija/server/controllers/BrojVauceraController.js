const mongoose = require("mongoose");
const BrojVaucera = require('../models/BrojVauceraModel');


const createBrojVaucera = async (req, res) => {
    try {
        const brojVaucera = new BrojVaucera({
            maxBrojVaucera: 10000,
            brojNeizdatihVaucera: 9999,
            iznos: 10000
        });

        const savedBrojVaucera = await brojVaucera.save();
        res.status(201).json(savedBrojVaucera);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const decrementBrojNeizdatihVaucera = async (req, res) => {
    try {
        const brojVaucera = await BrojVaucera.findOne();

        if (brojVaucera.brojNeizdatihVaucera > 0) {
            brojVaucera.brojNeizdatihVaucera -= 1;
            await brojVaucera.save();
            return res.status(200).json({ success: true });
        } else {
            return res.status(200).json({ success: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createBrojVaucera,
    decrementBrojNeizdatihVaucera
};
