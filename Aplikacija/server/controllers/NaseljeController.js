const mongoose = require("mongoose");
const Naselje = require('../models/NaseljeModel');

// CREATE - Dodavanje novog naselja
const createNaselje = async (req, res) => {
  try {
    const { ime, ulice} = req.body;
    const novoNaselje = await Naselje.create({ ime, ulice});
    res.status(200).json(novoNaselje);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Prikaz svih naselja
const getAllNaselja = async (req, res) => {
  try {
    const naselja = await Naselje.find();
    res.status(200).json(naselja);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// READ - Prikaz jednog naselja po ID-u
const getNaseljeById = async (req, res) => {
  try {
    const naselje = await Naselje.findById(req.params.id);
    if (!naselje) {
      return res.status(404).json({ success: false, error: 'Naselje nije pronađeno' });
    }
    res.status(200).json(naselje);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// UPDATE - Izmena postojećeg naselja
const updateNaselje = async (req, res) => {
  try {
    const { ime, postanskiBroj } = req.body;
    const naselje = await Naselje.findByIdAndUpdate(req.params.id, { ime, postanskiBroj }, { new: true });
    if (!naselje) {
      return res.status(404).json({ success: false, error: 'Naselje nije pronađeno' });
    }
    res.status(200).json(naselje);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// DELETE - Brisanje naselja
const deleteNaselje = async (req, res) => {
  try {
    const naselje = await Naselje.findByIdAndDelete(req.params.id);
    if (!naselje) {
      return res.status(404).json({ success: false, error: 'Naselje nije pronađeno' });
    }
    res.status(200).json(naselje);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
    createNaselje,
    getAllNaselja,
    getNaseljeById,
    updateNaselje,
    deleteNaselje
  }