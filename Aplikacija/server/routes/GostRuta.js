//Neka privremena ruta, dok se ne odlucimo koje cemo rute da koristimo
const express = require('express')
 //bilo tu pa cut-ovano i prebaceno u controller

 //Importuje funkcije iz TestController.js
const {
  getGostProfil,
  azurirajGostProfil,
  obrisiGosta,
  loginGost,
  registerGost
}  = require('../controllers/GostController')

const zahtevAuth = require('../middleware/zahtevAuth') //14

const router = express.Router()

//Ruta za prijavljivanje
router.post('/login', loginGost)

//Ruta za registrovanje korisnika
router.post('/register', registerGost)

router.use(zahtevAuth)//zahteva autorizaciju za sve rute gosta, osim za registrovanje i logovanje
//zato sto prilikom login i register-a se kreira token koji se posle koristi za autorizaciju ostalih ruta
//sve rute ispod router.use obuhvata ova metoda i trazi validan token za pristup
//get za pojedinacno
router.get("/:id", getGostProfil) 

//Azuriranje 
router.patch("/:JMBG", azurirajGostProfil)

//router.post("/", kreirajGosta)

router.delete("/:id",obrisiGosta)



module.exports = router