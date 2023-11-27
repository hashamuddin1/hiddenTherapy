const express = require("express");
const storeRouter = express.Router();
const { createStore,fetchAllStore } = require("../controller/storeController");
const verifyToken = require("../middleware/verifyToken");

storeRouter.post("/api/createStore", verifyToken, createStore);
storeRouter.get("/api/fetchAllStore", verifyToken, fetchAllStore);

module.exports = storeRouter;
