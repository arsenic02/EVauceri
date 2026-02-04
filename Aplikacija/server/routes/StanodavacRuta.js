const express = require('express');
const {
    getStanodavacProfil,
    azurirajStanodavacProfil,
    obrisiStanodavac,
    kreirajStanodavac,
    loginStanodavac,
    registerStanodavac
} = require('../controllers/StanodavacController');

const zahtevAuth = require('../middleware/zahtevAuth');
const router = express.Router();
const ZahtevController = require('../controllers/ZahtevController');
//Ruta za prijavljivanje
router.post('/login', loginStanodavac)

//Ruta za registrovanje korisnika
router.post('/register', registerStanodavac)

router.use(zahtevAuth);

////////////////rute ispod zahtevaju autorizaciju////

// Route za dobijanje pojedinacnog stanodavca
router.get("/:id", getStanodavacProfil);

// Route za azuriranje profila stanodavca
router.patch("/:id", azurirajStanodavacProfil);

// Route za kreiranje novog stanodavca
router.post("/", kreirajStanodavac);

// Route za brisanje stanodavca
router.delete("/:id", obrisiStanodavac);



// Ruta za dobijanje svih zahteva po stanodavcu
router.get('/stanodavac/:stanodavacId', ZahtevController.getZahteviPoStanodavcu);



module.exports = router;
