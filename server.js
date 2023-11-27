const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT;
require("./config/db");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const { options } = require("./swagger/swagger");
const specs = swaggerJsDoc(options);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
const userRouter = require("./router/userRoute");
const doctorRouter = require("./router/doctorRoute");
const scheduleRouter = require("./router/doctorSchedule");
const storeRouter = require("./router/medicalStoreRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use([userRouter, doctorRouter, scheduleRouter, storeRouter]);

app.listen(port, () => {
  console.log(
    `Our Server is running at port ${port} in Development Environment`
  );
});
