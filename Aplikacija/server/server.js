require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const Gost = require('./routes/GostRuta')
const Stanodavac = require('./routes/StanodavacRuta')
const Inspektor = require('./routes/InspektorRuta')
//Dobijanje ruta iz foldera "routes"
// const TempRuta1 = require('./routes/TempRuta1')
const Smestaj = require('./routes/SmestajRuta')
const SmestajnaJedinica = require('./routes/SmestajnaJedinicaRuta')
const Naselje = require('./routes/NaseljeRuta')
const Zahtev = require('./routes/ZahtevRuta')
const Vaucer = require('./routes/VaucerRuta')
const Evidecija = require('./routes/EvidencijaRuta')
const BrojVaucera = require('./routes/BrojVauceraRuta')
//Kreira Express apl i skladisti je u  promenjlivoj app
const app = express()

//Ako zahtev ima telo, onda ova metoda prikacuje to telo na "req" objekat iz sledece komande. Ovo se radi da bi mogli da pristupimo telu u request handleru.
app.use(express.json())
 
//Sluzi za logovanje request-ova u konzoli (mozda je i suvisno)
app.use((req,res,next)=>{
    // console.log(req.path,req.method)
    next()
})
 
//Koristi rutu koju smo dobili sa " require('./routes/TempRuta1') "
app.use('/api/EvidencijaRuta',Evidecija)
app.use('/api/VaucerRuta',Vaucer)
app.use('/api/NaseljeRuta',Naselje)
app.use('/api/SmestajnaJedinicaRuta',SmestajnaJedinica)
app.use('/api/SmestajRuta',Smestaj)
// app.use('/api/TempRuta1',TempRuta1)
app.use('/api/GostRuta',Gost)
app.use('/api/StanodavacRuta',Stanodavac)
app.use('/api/InspektorRuta',Inspektor)
app.use('/api/ZahtevRuta',Zahtev)
app.use('/api/BrojVauceraRuta',BrojVaucera)
//Povezivanje na bazu podataka
mongoose.connect(process.env.MONG_URI).then(()=>{
//Osluskuje za request 
app.listen(process.env.PORT, () => {
    console.log('Osluskujem port '+process.env.PORT.toString())
  })
}).catch((error)=>{console.log(error)})


process.env