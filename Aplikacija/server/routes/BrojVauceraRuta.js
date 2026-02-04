const express = require('express');
const router = express.Router();
const { createBrojVaucera, decrementBrojNeizdatihVaucera } = require('../controllers/BrojVauceraController');

// Route to create a new BrojVaucera
router.post('/kreiraj', createBrojVaucera);

// Route to check and decrement brojNeizdatihVaucera
router.post('/dekrementiraj', decrementBrojNeizdatihVaucera);

module.exports = router;
