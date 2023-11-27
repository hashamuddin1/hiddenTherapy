const express = require("express");
const userRouter = express.Router();

const {
  userSignUp,
  userSignIn,
  userChatBot,
  userComplain,
} = require("../controller/userController");

userRouter.post("/api/userSignUp", userSignUp);
userRouter.post("/api/userSignIn", userSignIn);
userRouter.post("/api/userChatBot", userChatBot);
userRouter.post("/api/complain", userComplain);

module.exports = userRouter;
