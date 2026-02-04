//potrebne modifikacije vrv
const express = require('express');
const router = express.Router();

const {
    getEvidencijeStanodavca,
    getEvidencija,
    updateEvidencija,
    createEvidencija
} = require('../controllers/EvidencijaController');

//Pribavlja evidencije datog stanodavca
router.post('/get-stanodavac-evidencije',getEvidencijeStanodavca)

//Pribavlja evidenciju na osnovu jbe
router.post('/get-evidencija',getEvidencija);

//Updatuje datum odlaska u evidenciji
router.post('/update-evidencija',updateEvidencija);

//Kreira vaucer
router.post('/create-evidencija', createEvidencija);

module.exports = router;
