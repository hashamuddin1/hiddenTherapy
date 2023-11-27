const { users } = require("../models/user");
const { Complain } = require("../models/complain");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const axios = require("axios");
const request = require("request");

const userSignUp = async (req, res) => {
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
    const checkEmail = await users.findOne({ email: req.body.email });
    if (checkEmail) {
      return res.status(400).send({
        success: false,
        message: "This Email is already Exist",
      });
    }

    const checkPhone = await users.findOne({
      phone_number: req.body.phone_number,
    });
    if (checkPhone) {
      return res.status(400).send({
        success: false,
        message: "This Phone Number is already Exist",
      });
    }

    const user = new users({
      email: req.body.email,
      phone_number: req.body.phone_number,
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      password: req.body.password,
    });
    let saltPassword = await bcrypt.genSalt(10);
    let encryptedPassword = await bcrypt.hash(user.password, saltPassword);
    user.password = encryptedPassword;

    await user.save();

    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.TOKEN_KEY,
      {
        expiresIn: "30d",
      }
    );

    return res.status(200).send({
      success: true,
      message: "User Registered Successfully",
      data: user,
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

const userSignIn = async (req, res) => {
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

    const checkUser = await users.findOne({ email: req.body.email });

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
        message: "User Login Successfully",
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

const userChatBot = async (req, res) => {
  try {
    var limit = 1;
    request.get(
      {
        url: "https://api.api-ninjas.com/v1/jokes?limit=" + limit,
        headers: {
          "X-Api-Key": process.env.jokeApiKey,
        },
      },
      function (error, response, body) {
        if (error) {
          console.error("Request failed:", error);
          return res.status(400).send({
            success: false,
            message: error,
          });
        } else if (response.statusCode != 200) {
          console.error("Error:", response.statusCode, body.toString("utf8"));
          return res.status(400).send({
            success: false,
            message: "something went wrong",
          });
        } else {
          return res.status(200).send({
            success: true,
            message: body,
          });
        }
      }
    );
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const userComplain = async (req, res) => {
  try {
    const insertComplain = new Complain({
      appointmentId: req.body.appointmentId,
      complain: req.body.complain,
      userId: req.body.userId,
    });
    await insertComplain.save();

    return res.status(200).send({
      success: true,
      message: "Complain Registered Successfully",
      data: insertComplain,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { userSignUp, userComplain, userSignIn, userChatBot };
