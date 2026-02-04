//potrebne modifikacije vrv

const express = require('express');
const router = express.Router();
//const ZahtevController = require('../controllers/ZahtevController');

const {
    getVaucerGosta,
    createVaucer,
    getVauceriZaStanodavca
} = require('../controllers/VaucerController');

//Kreira vaucer
router.post('/create-vaucer', createVaucer);

//Vraca vaucer odredjenog gosta
router.post('/vaucer-gost', getVaucerGosta)


router.get('/vauceri/:mejl', getVauceriZaStanodavca);


module.exports = router;
