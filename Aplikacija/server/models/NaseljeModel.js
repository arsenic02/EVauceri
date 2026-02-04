const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const naseljeSchema = new Schema({
  ime: { type: String, required: true },
  ulice: { type: [{ type: String }], default: [] }
});

module.exports = mongoose.model('Naselje', naseljeSchema);