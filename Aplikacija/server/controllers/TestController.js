//kao workoutController.js
const Temp = require("../models/WorkoutModel")
const mongoose = require("mongoose")

//get sve probe
const getProbe = async (req, res) => {
  //Pronalazi sve probe, i sortira ih po datumu kreiranja u opadajucem redosledu
  const probe = await Temp.find({}).sort({ createdAt: -1 })

  res.status(200).json(probe)
}

//get single proba
const getProba = async (req, res) => {
  const { id } = req.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    //ako id nije validan
    return res.status(404).json({ error: "Nema probe" })
  }
  const proba = await Temp.findById(id)

  if (!proba) {
    return res.status(404).json({ error: "No such proba" })
  }

  res.status(200).json(proba)
}
//kreiraj novu probu
const kreirajProbu = async (req, res) => {
  const { title, load, reps } = req.body

  let praznaPolja = []

  //Error handling
  if(!title){
    praznaPolja.push('title')
  }
  if(!load){
    praznaPolja.push('load')
  }
  if(!reps){
    praznaPolja.push('reps')
  }
  if(praznaPolja.length >0){
    
  return res.status(400).json({error:'Pounite sledeca polja: ' + praznaPolja.toString() ,praznaPolja})
  }
  //dodaj dokument u bazu
  try {
    const workout = await Temp.create({ title, load, reps })
    res.status(200).json(workout)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
  //Potencijalni problem, jer pokusava na isti http yahtev da odgovori 2 puta, a to nijie moguce, jer je http konekcija takva da se prekida kada se primi jedan odgovor
  //res.json({msg: "Dobrodosao u app, ovo je handler za POST" })
}

//obrisi probu
const obrisiProbu = async (req, res) => {
  //Uzimanje ID koji je poslat zahtevom kroz reqest objekat, iy propertija params
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    //ako id nije validan
    return res.status(404).json({ error: "Nema probe" })
  }

  //U mongoose, property za id se zove _id, pa je značenje sledeće linije:
  //nađi i obriši objekat čiji je property _id jednak parametru id koji smo dobili iz reqest objekta
  const probaZaBrisanje = await Temp.findOneAndDelete({ _id: id })

  if (!probaZaBrisanje) {
    return res.status(404).json({ error: "No such proba" })
  }

  res.status(200).json(probaZaBrisanje)
}
//azuriraj probu
const azurirajProbu = async (req,res) => {
    const {id} = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        //ako id nije validan
        return res.status(404).json({ error: "Nema probe" })
      }
    const probaZaAzuriranje = await Temp.findOneAndUpdate({_id:id},{
        ...req.body
    })
    if (!probaZaAzuriranje) {
        return res.status(404).json({ error: "No such proba" })
      }
      res.status(200).json(probaZaAzuriranje)
}

module.exports = {
  getProba,
  getProbe,
  kreirajProbu,
  obrisiProbu,
  azurirajProbu
}
