const { store } = require("../models/medicalStore");
const { doctors } = require("../models/doctor");
const { ObjectId } = require("mongodb");

const createStore = async (req, res) => {
  try {
    const DoctorId = new ObjectId(req.query.doctorId);

    const checkVerifiction = await doctors.findOne({ _id: DoctorId });

    if (!checkVerifiction) {
      return res.status(400).send({
        success: false,
        message: "Doctor is Not Found",
      });
    }

    if (checkVerifiction.isVerified === false) {
      return res.status(400).send({
        success: false,
        message: "Doctor is Not Verified",
      });
    }

    const insertStore = new store({
      doctorId: DoctorId,
      store_name: req.body.store_name,
      country: req.body.country,
      city: req.body.city,
      location: req.body.location,
    });

    await insertStore.save();

    return res.status(200).send({
      success: true,
      message: "Create Medical Store Successfully",
      data: insertStore,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const fetchAllStore = async (req, res) => {
  try {
    const fetchStore = await store.find();

    return res.status(200).send({
      success: true,
      message: "These are all Medical Store",
      data: fetchStore,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

module.exports = { createStore, fetchAllStore };
