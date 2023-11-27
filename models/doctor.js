const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctor_schema = new mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true,
    },
    middle_name: {
        type: String,
    },
    last_name: {
        type: String,
        trim: true,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    phone_number: {
        type: String,
        trim: true,
        required: true,
        unique:true
    },
    profilePicture: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    degreePic:{
        type: String,
    },
    field:{
        type: String,
        required:true,
        enum:["Psychiatrist","Psychologist"]
    }

})

//creating collection
const doctors = new mongoose.model('doctors', doctor_schema)

//export collection
module.exports = { doctors };