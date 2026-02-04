const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BrojVauceraSchema = new Schema({
  maxBrojVaucera:{ type: Number, required:true},
  brojNeizdatihVaucera: {type: Number, required: true},
  iznos: { type: Number, required: true },
});

const BrojVaucera = mongoose.model('Broj vaucera', BrojVauceraSchema);

module.exports = BrojVaucera;