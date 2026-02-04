const mongoose = require("mongoose");
const SmestajnaJedinica = require("../models/SmestajnaJedninicaModel");

const getSmestajneJedinicePage = async(req,res) =>{
    const {smestaj,stranica} = req.params;
    const sjPerPage = 10;
    try{
        const preskok = (parseInt(stranica) - 1) * sjPerPage; // Izračunavanje koliko elemenata treba preskočiti
        const sj = await SmestajnaJedinica.find({ imeSmestaja: smestaj },null,{skip:preskok,limit:sjPerPage}); 
        res.status(200).json(sj);
    }
    catch(error)
    {
        res.status(500).json({error:error.message})
    }
}
const getSmestajneJediniceSmestaja = async(req,res) =>{
    const {smestaj} = req.params;
    try {
        const smestajneJedinice = await SmestajnaJedinica.find({ imeSmestaja: smestaj });
        if (smestajneJedinice.length > 0) {
            res.status(200).json(smestajneJedinice);
        } else {
            res.status(404).json({ error: "Nije pronađena nijedna smeštajna jedinica" });
        }
    }
    catch(error)
    {
        res.status(500).json({error:error.message})
    }
}
const getSmestajnaJedinicaInfo = async (req, res) => {
    const { smestaj,jedinica } = req.params;

    try {
        const smestajnaJedinica = await SmestajnaJedinica.findOne({
            imeSmestaja: smestaj,
            imeJedinice: jedinica
        });
        
        if (!smestajnaJedinica) {
            return res.status(404).json({ error: "Smestajna jedinica ne postoji" });
        }

        res.status(200).json(smestajnaJedinica);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
const updateSmestajnaJedinicaInfo = async (req, res) => {
    const { smestaj, jedinica } = req.params;
    try {
        // Pronalaženje smeštajne jedinice
        const smestajnaJedinica = await SmestajnaJedinica.findOne({
            imeSmestaja: smestaj,
            imeJedinice: jedinica
        });

        if (!smestajnaJedinica) {
            return res.status(404).json({ error: "Smeštajna jedinica nije pronađena" });
        }

        // Ažuriranje pronađene smeštajne jedinice sa podacima iz req.body
        Object.keys(req.body).forEach(key => {
            smestajnaJedinica[key] = req.body[key];
        });

        // Čuvanje ažurirane smeštajne jedinice
        const updatedSmestajnaJedinica = await smestajnaJedinica.save();

        res.status(200).json(updatedSmestajnaJedinica);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const createSmestajnaJedinica = async (req, res) => {
    const {
        imeSmestaja = "",
        imeJedinice = "",
        brojSobe,
        klima = false,
        brojKreveta,
        kuhinja = false,
        wifi,
        tv,
        terasa = false,
        cena
    } = req.body;
    let praznaPolja = [];
    /*
    console.log("Ime smeštaja: " + imeSmestaja);
    console.log("Ime jedinice: " + imeJedinice);
    console.log("Broj sobe: " + brojSobe);
    console.log("Klima: " + klima);
    console.log("Broj kreveta: " + brojKreveta);
    console.log("Kuhinja: " + kuhinja);
    console.log("WiFi: " + wifi);
    console.log("TV: " + tv);
    console.log("Terasa: " + terasa);
    console.log("Cena: "+ cena)
    */
    // Provera praznih polja
    if(!imeSmestaja){
        praznaPolja.push("imeSmestaja");
    }
    if (!imeJedinice) {
        praznaPolja.push("imeJedinice");
    }
    if (!brojSobe) {
        praznaPolja.push("brojSobe");
    }
    if (!brojKreveta) {
        praznaPolja.push("brojKreveta");
    }

    if (praznaPolja.length > 0) {
        return res.status(400).json({
            error: "Popunite sledeća polja Inspektora: " + praznaPolja.toString(),
            praznaPolja,
        });
    }

    try {
        const newSmestajnaJedinica = await SmestajnaJedinica.create({
            imeSmestaja,
            imeJedinice,
            brojSobe,
            klima,
            brojKreveta,
            kuhinja,
            wifi,
            tv,
            terasa,
            cena,
        });
        res.status(200).json(newSmestajnaJedinica);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const deleteSveSmestajneJediniceSmestaja = async (req,res) =>{
    const {ime} = req.params;
    try {
        console.log(ime);
       const ll = await SmestajnaJedinica.findAndDelete({ imeSmestaja : ime });
       if(ll===null || (ll.length>0)){
        res.status(200).json();
    }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

}

const deleteSmestajnaJedinica = async (req, res) => {
    const { ime } = req.params;
    try {
        const deletedSmestajnaJedinica = await SmestajnaJedinica.findOneAndDelete({ imeJedinice: ime });

        if (!deletedSmestajnaJedinica) {
            return res.status(404).json({ error: "Smestajna jedinica ne postoji" });
        }

        res.status(200).json({ message: "Smestajna jedinica uspešno obrisana", deletedSmestajnaJedinica });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const oceniSmestajnuJedinicu = async(req, res) => {
    const { id } = req.params;
  const { rating } = req.body;

  try {
    const smestajnaJedinica = await SmestajnaJedinica.findById(id);
    if (!smestajnaJedinica) {
      return res.status(404).json({ error: 'Smeštajna jedinica nije pronađena' });
    }

    smestajnaJedinica.ocene.push(rating);

    const total = smestajnaJedinica.ocene.reduce((sum, ocena) => sum + ocena, 0);
    smestajnaJedinica.prosecnaOcena = smestajnaJedinica.ocene.length ? total / smestajnaJedinica.ocene.length : 0;
    smestajnaJedinica.prosecnaOcena =  Math.round(smestajnaJedinica.prosecnaOcena * 10) / 10; 
    await smestajnaJedinica.save();
    
    res.status(200).json({ prosecnaOcena: smestajnaJedinica.prosecnaOcena });
  } catch (error) {
    res.status(500).json({ error: 'Greška prilikom ocenjivanja smeštajne jedinice' });
  }
};

const getProsecnaOcenaSmestajnihJedinica = async (req, res) => {
    const { smestaj } = req.params;
  
    try {
      const smestajneJedinice = await SmestajnaJedinica.find({ imeSmestaja: smestaj });
      if (!smestajneJedinice.length) {
        return res.status(404).json({ error: "Nema smestajnih jedinica za dati smeštaj" });
      }
  
      let totalOcena = 0;
      let brojJedinica = 0;
  
      smestajneJedinice.forEach(jedinica => {
        if (jedinica.prosecnaOcena) {
          totalOcena += jedinica.prosecnaOcena;
          brojJedinica++;
        }
      });
  
      const prosecanRating = brojJedinica > 0 ? totalOcena / brojJedinica : 0;
  
      res.status(200).json({ prosecanRating });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };


module.exports = {
    getSmestajneJedinicePage,
    getSmestajnaJedinicaInfo,
    updateSmestajnaJedinicaInfo,
    createSmestajnaJedinica,
    deleteSmestajnaJedinica,
    getSmestajneJediniceSmestaja,
    deleteSveSmestajneJediniceSmestaja,
    oceniSmestajnuJedinicu,
    getProsecnaOcenaSmestajnihJedinica
};
