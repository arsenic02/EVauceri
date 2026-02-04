const express = require('express');
const {
    getSmestajInfo,
    updateSmestajInfo,
    createSmestaj,
    deleteSmestaj,
    getSviSmestajiZaStanodavca,
    getSviSmestaji,
    getSmestajPage,
    getStanodavacPoSmestaju,
    getProsecnaOcenaSmestaja,
    getNajbolje,
    searchSmestaj
} = require('../controllers/SmestajController');

const router = express.Router();

router.post("/search",searchSmestaj);

router.post('/:page',getSmestajPage);

router.get('/najbolji',getNajbolje);

router.get('/:mejl', getSviSmestajiZaStanodavca);

// Route za dobijanje pojedinacnog Smestaja
router.get("/detalji/:naziv", getSmestajInfo);

// Route za azuriranje Smestaja
router.patch("/:naziv", updateSmestajInfo);

// Route za kreiranje novog iSmestaja
router.post("/", createSmestaj);

// Route za brisanje Smestaja
router.delete("/brisi/:id", deleteSmestaj);

//dodato
// Route za dobijanje svih smestaja
router.get("/", getSviSmestaji);

router.get("/:id", getStanodavacPoSmestaju)

router.get("/prosecna-ocena/:smestaj",getProsecnaOcenaSmestaja)

module.exports = router;
