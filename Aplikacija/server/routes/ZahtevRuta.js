//potrebne modifikacije vrv

const express = require('express');
const router = express.Router();
//const ZahtevController = require('../controllers/ZahtevController');

const {
    postZahtev,
    getZahtev,
    getZahteviPoStanodavcu,
    deleteZahtev,
    updateStatusZahtev,
    getZahteviPoGostu,
    getStanodavacMejl
} = require('../controllers/ZahtevController');

// Ruta za kreiranje novog zahteva
router.post('/', postZahtev);// /zahtevi

//Vraca sve zahteve jednog stanodavca
router.post('/stanodavac/zahtevi', getZahteviPoStanodavcu)

//Vraca sve zahteve jednog gosta
router.post('/gost/zahtevi', getZahteviPoGostu)


// Ruta za dobijanje jednog zahteva po ID-u
router.post('/zahtev', getZahtev);

router.post('/azuriraj-status',updateStatusZahtev);

// Ruta za brisanje zahteva po ID-u
router.delete('/zahtevi/:id', deleteZahtev);


router.post('/stanodavac/mejl', getStanodavacMejl);

module.exports = router;
