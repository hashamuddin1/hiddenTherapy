const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const medical_store_schema = new mongoose.Schema({
    doctorId: {
        type: Schema.Types.ObjectId,
        ref: "doctors"
    },
    store_name: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },

})

//creating collection
const store = new mongoose.model('medicalStore', medical_store_schema)

//export collection
module.exports = { store };