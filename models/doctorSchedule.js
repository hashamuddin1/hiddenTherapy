const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schedule_schema = new mongoose.Schema({
  day: {
    type: String,
    trim: true,
    required: true,
    enum: [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ],
  },
  from: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    trim: true,
    required: true,
  },
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "doctors",
  },
  isBooked: {
    type: Boolean,
    trim: true,
    default: false,
  },
  bookedBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
});

//creating collection
const doctorSchedules = new mongoose.model("doctorSchedules", schedule_schema);

//export collection
module.exports = { doctorSchedules };
