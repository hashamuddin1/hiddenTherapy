const express = require("express");
const doctorRouter = express.Router();
const {
  doctorSignUp,
  doctorSignIn,
  uploadDegree,
  activateAccount,
  allDoctors,
  searchdoctors,
  SpecificDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controller/doctorController");
const verifyToken = require("../middleware/verifyToken");
const multer = require("multer");
const upload = multer();

doctorRouter.post("/api/doctorSignUp", doctorSignUp);
doctorRouter.post("/api/doctorSignIn", doctorSignIn);
doctorRouter.post(
  "/api/uploadDegree",
  [verifyToken, upload.single("degreeImg")],
  uploadDegree
);
doctorRouter.post("/api/activateAccount", verifyToken, activateAccount);
doctorRouter.get("/api/alldoctors", verifyToken, allDoctors);
doctorRouter.get("/api/SpecificDoctor", verifyToken, SpecificDoctor);
doctorRouter.post("/api/searchdoctors", verifyToken, searchdoctors);
doctorRouter.put("/api/updateDoctor", verifyToken, updateDoctor);
doctorRouter.delete("/api/deleteDoctor", verifyToken, deleteDoctor);

module.exports = doctorRouter;
