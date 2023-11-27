const { doctorSchedules } = require("../models/doctorSchedule");
const { doctors } = require("../models/doctor");
const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.Secret_Key);

const doctorScheduleCreate = async (req, res) => {
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

    const insertSchedule = new doctorSchedules({
      day: req.body.day,
      from: req.body.from,
      to: req.body.to,
      price: req.body.price,
      doctorId: DoctorId,
    });

    await insertSchedule.save();

    return res.status(200).send({
      success: true,
      message: "Create Schedule Successfully",
      data: insertSchedule,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const doctorScheduleFetch = async (req, res) => {
  try {
    const checkDoctor = await doctors.findOne({
      _id: new ObjectId(req.query.doctorId),
    });

    if (!checkDoctor) {
      return res.status(400).send({
        success: false,
        message: "Doctor is Not Found",
      });
    }

    const fetchSchedule = await doctorSchedules.find({
      doctorId: new ObjectId(req.query.doctorId),
      isBooked: false,
    });

    return res.status(200).send({
      success: true,
      message: "Fetch Schedule Successfully",
      data: fetchSchedule,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const doctorScheduleBook = async (req, res) => {
  try {
    const customer = await stripe.customers.create();

    const param = {};
    param.card = {
      number: req.body.cardNumber,
      exp_month: req.body.expMonth,
      exp_year: req.body.expYear,
      cvc: req.body.cvc,
    };

    stripe.tokens.create(param, function (err, token) {
      if (err) {
        // console.log(err);
        // return res.status(400).send({
        //   success: false,
        //   message: "Something went wrong",
        // });
      }
      if (token) {
        stripe.customers.createSource(
          customer.id,
          { source: token.id },
          async function (err, card) {
            if (err) {
              console.log(err);
              return res.status(400).send({
                success: false,
                message: "Something went wrong",
              });
            }
          }
        );
      }
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount * 100,
      currency: "gbp",
      customer: customer.id,
      payment_method_types: ["card"],
    });

    const paymentIntent2 = await stripe.paymentIntents.confirm(
      paymentIntent.id,
      { payment_method: req.body.payment_method }
    );

    await doctorSchedules.findByIdAndUpdate(
      { _id: new ObjectId(req.body.scheduleId) },
      {
        isBooked: true,
        bookedBy: req.body.userId,
      }
    );

    return res.status(200).send({
      success: true,
      message: "Payment Inserted Successfully For Book the Schedule",
    });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      success: false,
      message: "Something went wrong",
    });
  }
};

const doctorScheduleUpcoming = async (req, res) => {
  try {
    const fetchSchedule = await doctorSchedules.find({
      doctorId: new ObjectId(req.query.doctorId),
      isBooked: true,
    });

    return res.status(200).send({
      success: true,
      message: "Fetch Upcomming Appointment Successfully",
      data: fetchSchedule,
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
  doctorScheduleCreate,
  doctorScheduleFetch,
  doctorScheduleBook,
  doctorScheduleUpcoming,
};
