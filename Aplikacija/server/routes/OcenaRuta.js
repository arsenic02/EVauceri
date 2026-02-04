const express = require('express');
const {
    getOcena,
    createOcena,
    deleteOcena,
} = require('../controllers/OcenaController');

const router = express.Router();

// Route za dobijanje pojedinacne Smestajne Jedinice 
router.get("/:id", getOcena);

// Route za kreiranje nove Ocene
router.post("/", createOcena);

// Route za brisanje Ocene 
router.delete("/:id", deleteOcena);

module.exports = router;
