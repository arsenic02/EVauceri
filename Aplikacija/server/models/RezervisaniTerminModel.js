const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rezervisaniTerminSchema = new Schema({
    mejlGosta: {type: String, required:true},
    pocetakTermina: {type: Date, required: true},
    krajTermina: {type:Date,required:true}
}, { timestamps: true });