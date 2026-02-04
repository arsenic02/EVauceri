const express = require('express');
const {
    getSmestajnaJedinicaInfo,
    updateSmestajnaJedinicaInfo,
    createSmestajnaJedinica,
    deleteSmestajnaJedinica,
    getSmestajneJedinicePage,
    getSmestajneJediniceSmestaja,
    deleteSveSmestajneJediniceSmestaja,
    oceniSmestajnuJedinicu,
    getProsecnaOcenaSmestajnihJedinica,
} = require('../controllers/SmestajnaJedinicaController');

const router = express.Router();


//Brise sve smestajne jedinice smestaja
router.delete("/delete-sj-smestaja/:ime", deleteSveSmestajneJediniceSmestaja)

//router.get("/:smestaj",getSmestajneJedinicePage);

//Ova metoda pribavlja (n-1)*10 tu stranicu, gde je n redni broj stranice
router.get("/stranicenje/:smestaj/:stranica",getSmestajneJedinicePage);

// Route za dobijanje pojedinacne Smestajne Jedinice 
router.get("/:smestaj/:jedinica", getSmestajnaJedinicaInfo);

router.get("/smestaj/smestajne-jedinice/:smestaj",getSmestajneJediniceSmestaja);

// Route za azuriranje profila  Smestajne Jedinice 
router.patch("/:smestaj/:jedinica", updateSmestajnaJedinicaInfo);

// Route za kreiranje nove  Smestajne Jedinice 
router.post("/", createSmestajnaJedinica);

// Route za brisanje  Smestajne Jedinice 
router.delete("/delete/:ime", deleteSmestajnaJedinica);

router.post("/oceni/:id",oceniSmestajnuJedinicu)

router.get("/prosecnaOcena/:smestaj",getProsecnaOcenaSmestajnihJedinica)

////////////router.get("/prosecnaOcena/:smestaj", getProsecnaOcenaSmestajnihJedinica);

module.exports = router;
