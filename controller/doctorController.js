const { doctors } = require("../models/doctor");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { ObjectId } = require("mongodb");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const doctorSignUp = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).send({
        success: false,
        message: "This Email Is Required",
      });
    }

    if (!req.body.phone_number) {
      return res.status(400).send({
        success: false,
        message: "This Phone Number Is Required",
      });
    }

    if (!req.body.first_name) {
      return res.status(400).send({
        success: false,
        message: "This First Name Is Required",
      });
    }

    if (!req.body.last_name) {
      return res.status(400).send({
        success: false,
        message: "This Last Name Is Required",
      });
    }

    if (!req.body.field) {
      return res.status(400).send({
        success: false,
        message: "This Field Is Required",
      });
    }

    const checkEmail = await doctors.findOne({ email: req.body.email });
    if (checkEmail) {
      return res.status(400).send({
        success: false,
        message: "This Email is already Exist",
      });
    }

    const checkPhone = await doctors.findOne({
      phone_number: req.body.phone_number,
    });
    if (checkPhone) {
      return res.status(400).send({
        success: false,
        message: "This Phone Number is already Exist",
      });
    }

    const doctor = new doctors({
      email: req.body.email,
      phone_number: req.body.phone_number,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
      field: req.body.field,
    });
    let saltPassword = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(doctor.password, saltPassword);
    doctor.password = encryptedPassword;

    await doctor.save();

    const token = jwt.sign(
      { _id: doctor._id, email: doctor.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).send({
      success: true,
      message: "Doctor Registered Successfully",
      data: doctor,
      token,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const doctorSignIn = async (req, res) => {
  try {
    if (!req.body.email) {
      return res.status(400).send({
        success: false,
        message: "Email Is Required",
      });
    }

    if (!req.body.password) {
      return res.status(400).send({
        success: false,
        message: "Password Is Required",
      });
    }

    const checkUser = await doctors.findOne({ email: req.body.email });

    if (!checkUser) {
      return res.status(400).send({
        success: false,
        message: "Invalid Email",
      });
    }

    if (
      checkUser &&
      (await bcrypt.compare(req.body.password, checkUser.password))
    ) {
      const token = jwt.sign(
        { _id: checkUser._id, email: checkUser.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "30d",
        }
      );

      return res.status(200).send({
        success: true,
        message: "Doctor Login Successfully",
        data: checkUser,
        token,
      });
    } else {
      return res.status(400).send({
        success: false,
        message: "Invalid Credentials",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const uploadDegree = async (req, res) => {
  try {
    const localDate = new Date();
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const days = [
      "Sunday",
      "Monday ",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const currentDay = days[localDate.getDay()];

    const currentDate = localDate.getDate();

    const currentMonth = months[localDate.getMonth()];

    const currentYear = localDate.getFullYear();

    const response = await cloudinary.uploader.upload(
      `data:image/png;base64,${req.file.buffer.toString("base64")}`
    );
    const degreeUpdate = await doctors.findOneAndUpdate(
      { _id: req.query.doctorId },
      { degreePic: `${response.url}` },
      { new: true }
    );

    const msg = {
      to: process.env.RECEIVER_EMAIL,
      from: {
        name: "HIDDEN THERAPY",
        email: process.env.SENDGRID_SENDER_EMAIL,
      },
      subject: "PROPOSAL TO ACTIVATE ACCOUNT",
      templateId: process.env.SENDGRID_SENDDEGREE_TEMPLATE_ID,
      dynamicTemplateData: {
        DOCTOR_EMAIL: req.body.doctorEmail,
        DOCTOR_ID: req.query.doctorId,
        DATE: `${currentDay} ${currentDate} ${currentMonth} ${currentYear}`,
        DEGREE_PIC: `${response.url}`,
      },
    };
    sgMail.send(msg).then(() => {
      return res.status(200).send({
        success: true,
        message: "Email Sent Successfully",
      });
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const activateAccount = async (req, res) => {
  try {
    const { doctorId } = req.body;

    const checkDoctor = await doctors.findOne({ _id: new ObjectId(doctorId) });

    if (!checkDoctor) {
      return res.status(400).send({
        success: false,
        message: "Invalid Doctor ID",
      });
    }

    const activateAccount = await doctors.findOneAndUpdate(
      { _id: new ObjectId(doctorId) },
      { isVerified: true },
      { new: true }
    );

    return res.status(200).send({
      success: true,
      message: "Doctor Account Verified Successfully",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const allDoctors = async (req, res) => {
  try {
    const fetchDoctors = await doctors.find({ isVerified: true });

    return res.status(200).send({
      success: true,
      message: "These are all verified Doctors",
      data: fetchDoctors,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const searchdoctors = async (req, res) => {
  try {
    if (req.body.doctorName && !req.body.doctorField) {
      const fetchDoctor = await doctors.find({
        first_name: { $regex: new RegExp(req.body.doctorName, "i") },
        isVerified: true,
      });

      return res.status(200).send({
        success: true,
        message: "Your Searching Result",
        data: fetchDoctor,
      });
    }

    if (!req.body.doctorName && req.body.doctorField) {
      const fetchDoctor = await doctors.find({
        field: req.body.doctorField,
        isVerified: true,
      });

      return res.status(200).send({
        success: true,
        message: "Your Searching Result",
        data: fetchDoctor,
      });
    }

    if (req.body.doctorName && req.body.doctorField) {
      const fetchDoctor = await doctors.find({
        first_name: { $regex: new RegExp(req.body.doctorName, "i") },
        field: req.body.doctorField,
        isVerified: true,
      });

      return res.status(200).send({
        success: true,
        message: "Your Searching Result",
        data: fetchDoctor,
      });
    }

    if (!req.body.doctorName && !req.body.doctorField) {
      const fetchDoctor = await doctors.find({ isVerified: true });

      return res.status(200).send({
        success: true,
        message: "Your Searching Result",
        data: fetchDoctor,
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const SpecificDoctor = async (req, res) => {
  try {
    if (!req.query.doctorId) {
      return res.status(400).send({
        success: false,
        message: "Kindly Provide Doctor ID",
      });
    }

    const fetchDoctor = await doctors.find({
      _id: new Object(req.query.doctorId),
    });

    return res.status(200).send({
      success: true,
      message: "Your Doctor",
      data: fetchDoctor,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const updateDoctor = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;
    await doctors.findByIdAndUpdate(
      { _id: doctorId },
      {
        first_name: req.body.first_name,
        middle_name: req.body.middle_name,
        last_name: req.body.last_name,
      },
      {
        new: true,
      }
    );

    return res.status(200).send({
      success: true,
      message: "Doctor Profile Has Been Updated",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.query.doctorId;
    await doctors.findByIdAndDelete({ _id: doctorId });
    return res.status(200).send({
      success: true,
      message: "Doctor Profile Has Been Deleted",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = {
  doctorSignUp,
  doctorSignIn,
  uploadDegree,
  activateAccount,
  allDoctors,
  searchdoctors,
  SpecificDoctor,
  updateDoctor,
  deleteDoctor,
};
