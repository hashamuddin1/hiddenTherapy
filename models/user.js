const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const user_schema = new mongoose.Schema({
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
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  phone_number: {
    type: String,
    trim: true,
    required: true,
    unique: true,
  },
  profilePicture: {
    type: String,
  },
});

//creating collection
const users = new mongoose.model("users", user_schema);

//export collection
module.exports = { users };
