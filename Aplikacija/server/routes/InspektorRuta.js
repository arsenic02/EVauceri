const express = require('express');
const {
    getInspektorProfil,
    azurirajInspektoraProfil,
    obrisiInspektora,
    kreirajInspektora,
    loginInspektor,
    registerInspektor
} = require('../controllers/InspektorController');

const zahtevAuth = require('../middleware/zahtevAuth');
const router = express.Router();

router.post("/login", loginInspektor);

router.post("/register", registerInspektor);

router.use(zahtevAuth);

/////////////////////rute ispod zahtevaju autorizaciju
// Route za dobijanje pojedinacnog inspektora
router.get("/:id", getInspektorProfil);

// Route za azuriranje profila inspektora
router.patch("/:JMBG", azurirajInspektoraProfil);

// Route za kreiranje novog inspektora
router.post("/", kreirajInspektora);

// Route za brisanje inspektora
router.delete("/:id", obrisiInspektora);



module.exports = router;
