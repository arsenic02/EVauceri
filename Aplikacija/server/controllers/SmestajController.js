const mongoose = require("mongoose");
const Smestaj = require("../models/SmestajModel");
const SmetajnaJedinica = require("../models/SmestajnaJedninicaModel");
const SmestajnaJedinica = require("../models/SmestajnaJedninicaModel");

const getSmestajPage = async (req, res) => {
    const { page } = req.params;
    const sjPerPage = 10;
    try {
        const totalCount = await Smestaj.countDocuments(); // Ukupan broj smeštajnih jedinica

        const skip = (parseInt(page) - 1) * sjPerPage; // Izračunavanje koliko elemenata treba preskočiti
        let sj;

        if (skip >= totalCount) {
            sj = []; // Ako je preskočeno više elemenata nego što ih ima, vraćamo prazan niz
        } else {
            const remainingCount = totalCount - skip; // Preostali broj elemenata koji treba vratiti
            const limit = remainingCount < sjPerPage ? remainingCount : sjPerPage; // Određivanje ograničenja na osnovu preostalog broja elemenata
            sj = await Smestaj.find().skip(skip).limit(limit); // Vraćanje smeštajnih jedinica
        }

        res.status(200).json(sj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

// Uzimanje podataka o jednom smeštaju
const getSmestajInfo = async (req, res) => {
    const { naziv } = req.params;
    try {
        const smestaj =  await Smestaj.findOne({ naziv: naziv });
       
        if (!smestaj) {
            return res.status(404).json({ error: "Smeštaj ne postoji" });
        }
        res.status(200).json(smestaj);
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Azuriranje informacija o smeštaju
const updateSmestajInfo = async (req, res) => {
    const { naziv } = req.params;
    try {
        const updatedSmestaj = await Smestaj.findOneAndUpdate(     
            {naziv: naziv},//ne diraj, tako treba
            { ...req.body },
            { new: true }
        );
        
        if (!updatedSmestaj) {
            return res.status(404).json({ error: "Smeštaj ne postoji" });
        }
        res.status(200).json(updatedSmestaj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Kreiranje novog smeštaja
const createSmestaj = async (req, res) => {
    const { naziv, udaljenostOdCentra, brojSoba, naseljeIme,ulica, vlasnik, dvoriste, brojParkingMesta, slike } = req.body;
    
    try {
        const newSmestaj = await Smestaj.create({
            naziv,
            udaljenostOdCentra,
            brojSoba,
            naseljeIme,
            ulica,
            vlasnik,
            dvoriste,
            brojParkingMesta,
            slike
        });

        res.status(200).json(newSmestaj);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Brisanje smeštaja
const deleteSmestaj = async (req, res) => {
    const { id} = req.params;
    try {
        const deletedSmestaj = await Smestaj.findByIdAndDelete(id);

        if (!deletedSmestaj) {
            return res.status(404).json({ error: "Smeštaj ne postoji" });
        }

        res.status(200).json(deletedSmestaj);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getSviSmestajiZaStanodavca = async (req, res) => {
    const { mejl } = req.params; // Dobijamo mejl stanodavca iz tela zahteva

    try {
        // Pronalazimo sve smeštaje koji imaju polje mejl jednako mejlu stanodavca
        const sviSmestaji = await Smestaj.find({ vlasnik: mejl });    
        // Vraćamo pronađene smeštaje
        res.status(200).json(sviSmestaji);
    } catch (error) {
        // U slučaju greške, vraćamo status 500 sa porukom o grešci
        res.status(500).json({ error: error.message });
    }
};

//dodato
const getSviSmestaji = async (req, res) => {
    try {
        const smestaji = await Smestaj.find(); // Pronalazi sve smeštaje
        console.log(smestaji)
        res.status(200).json(smestaji);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getStanodavacPoSmestaju = async (req, res) => {
    const smestajId = req.params.smestajId;
    try {
      const smestaj = await Smestaj.findById(smestajId);
      if (!smestaj) {
        return res.status(404).json({ error: 'Smestaj nije pronadjen' });
      }
      // Ako imate polje 'stanodavacId' u modelu Smestaj, koristite ga ovde da biste dobili informacije o stanodavcu
     // const stanodavacId = smestaj.stanodavacId;
      const stanodavacId = smestaj.vlasnik;
      console.log(vlasnik)
      // Takođe, možete vratiti samo ID stanodavca ako je to ono što je potrebno
      return res.status(200).json({ vlasnik });
    } catch (error) {
      console.error('Greška pri dobijanju informacija o stanodavcu:', error);
      return res.status(500).json({ error: 'Server greška' });
    }
  };

  const getProsecnaOcenaSmestaja = async (req, res) => {
    const { smestaj } = req.params;
    try {
        const smestajneJedinice = await SmestajnaJedinica.find({ imeSmestaja: smestaj });

        if (!smestajneJedinice.length) {
            return res.status(404).json({ error: "Nema smestajnih jedinica za dati smeštaj" });
        }
        console.log("abcdefgh")
        let totalOcena = 0;
        let brojOcena = 0;

        smestajneJedinice.forEach(jedinica => {
            if (jedinica.prosecnaOcena) {
                totalOcena += jedinica.prosecnaOcena;
                brojOcena++;
            }
        });

        if (brojOcena > 0) {
            const prosecnaOcena = Math.round((totalOcena / brojOcena) * 10) / 10; 
            const updatedSmestaj = await Smestaj.findOneAndUpdate(
                { naziv: smestaj },
                { prosecnaOcena: prosecnaOcena },
                { new: true }
            );

            if (updatedSmestaj) {
                return res.status(200).json({ updatedSmestaj });
            } else {
                return res.status(404).json({ error: "Smeštaj nije pronađen" });
            }
        } else {
            return res.status(404).json({ error: "Nema ocena za dati smeštaj" });
        }

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getNajbolje = async (req, res) => {
    try {
        const smestaji = await Smestaj.find().sort({prosecnaOcena:-1}).limit(5); // Pronalazi sve smeštaje
        res.status(200).json(smestaji);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/*const searchSmestaj = async (req, res) => {
    const maxVrednost = Number.MAX_SAFE_INTEGER;
    const mesto = req.body.mesto;
    let ocena = req.body.ocena;
    let brojKreveta = req.body.brojOsoba;
    let cena = req.body.cena;

    if (cena === 0 || cena === null) {
        cena = maxVrednost;
    }
    if (brojKreveta === null) {
        brojKreveta = 0;
    }
    if (ocena === null) {
        ocena = 0;
    }

    try {
        let smestaji = [];
        if (mesto) {
            console.log(mesto)
            smestaji = await Smestaj.find({ naseljeIme: mesto, prosecnaOcena: { $gte: ocena } });
            console.log(smestaji)
        } else {
            smestaji = await Smestaj.find({ prosecnaOcena: { $gte: ocena } });
            console.log(smestaji)
        }

        const jedinice = await SmestajnaJedinica.find({ brojKreveta: { $gte: brojKreveta }, cena: { $lte: cena } });
        console.log(jedinice)
        // Filter the accommodations that meet the criteria
        const filtriraniSmestaji = smestaji.filter(smestaj => 
            jedinice.some(jedinica => jedinica.smestajId.toString() === smestaj._id.toString())
        );

        res.status(200).json(filtriraniSmestaji);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};*/


const searchSmestaj = async (req, res) => {
    const maxVrednost = Number.MAX_SAFE_INTEGER;
    const mesto = req.body.mesto;
    let ocena = req.body.ocena;
    let brojKreveta = req.body.brojOsoba;
    let cena = req.body.cena;
    if(cena===0 || cena===null){
        cena = maxVrednost;
    }
    if(brojKreveta===null){
        brojKreveta=0;
    }
    if(ocena===null){
        ocena=0;
    }
    
    console.log("Odrediste: "+mesto)
    console.log("Ocena: "+ocena)
    console.log("Osobe: "+brojKreveta)
    console.log("Cena: "+cena)

    try { 
        //kad je const smestaji, ne nalazi mesto
        let smestaji = [];
        if(mesto){
            //Zadato mesto, trazi se pomocu ove f-je, ako je zadata ocena, koristi se, ako nije onda je 0, pa
            //To znaci da se traze sve jedinice koje zadovoljavaju mesto, i imaju ocenu vecuo od 0
            console.log(mesto + " "+ ocena);
            smestaji = await Smestaj.find({naseljeIme:mesto, prosecnaOcena: {$gte: ocena}});
            console.log(smestaji)
            console.log("Smestaji najdeni");
        }
        else{
             console.log(mesto + " "+ ocena);
             //Nije zadato mesto, a za ocenu nemamo pojma, jer ocena ako je neka vrednost x, onda trazi smestaje sa vecom ocenom od x
             //Ako ocena nije zadata trazi sve smestaje sa ocenom vecom od 0 
             smestaji = await Smestaj.find({prosecnaOcena: {$gte: ocena}})
             console.log("Smestaji najdeni ocena samo");
            }
        
        console.log("a sad jedinice!")
        //Trazi sve jedinice koje imaju brojKkreveta i cenu manju od... 
        //Ako su zadate vrednosti one se koriste, a ako nisu, borjKreveta=0, a cena=maksimalna vrednost, posto se trazze sj sa cenom manjom od te cene
        //a to su efektivno sve
        const jedinice = await SmestajnaJedinica.find({brojKreveta:{$gte: brojKreveta}, cena: {$lte: cena}})  

        //vraca niz smestaja koji ispunjavaju uslove za mesto i ocenu, vrsi presek sa jedinicama koje zadovoljavaju 
        //filter za brojKreveta i cenu, i cije ime je jednako jedinicama koje ispunjavaju uslov za mesto i ocenu
        const filtriraniSmestaji = filterSmestaji(smestaji,jedinice)
    
        res.status(200).json(filtriraniSmestaji);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

function filterSmestaji(smestaji, jedinice) {
    return smestaji.filter(smestaj =>
      jedinice.some(jedinica => jedinica.imeSmestaja === smestaj.naziv)
    );
  }


module.exports = {
    getSmestajInfo,
    updateSmestajInfo,
    createSmestaj,
    deleteSmestaj,
    getSviSmestajiZaStanodavca,
    getSviSmestaji,
    getSmestajPage,
    getStanodavacPoSmestaju,
    getProsecnaOcenaSmestaja,
    getNajbolje,
    searchSmestaj
};
