//Neka privremena ruta, dok se ne odlucimo koje cemo rute da koristimo
const express = require('express')
 //bilo tu pa cut-ovano i prebaceno u controller

 //Importuje funkcije iz TestController.js
const {
    createNaselje,
    getAllNaselja,
    getNaseljeById,
    updateNaselje,
    deleteNaselje
}  = require('../controllers/NaseljeController')

const router = express.Router()

router.post('/', createNaselje);

// Route za prikaz svih naselja
router.get('/', getAllNaselja);

// Route za prikaz jednog naselja po ID-u
router.get('/:id', getNaseljeById);

// Route za ažuriranje naselja po ID-u
router.put('/:id', updateNaselje);

// Route za brisanje naselja po ID-u
router.delete('/:id', deleteNaselje);

module.exports = router