const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Online Treatment API",
      version: "1.0.0",
      description: "This is swagger docs of Online Treatment API",
    },
    servers: [
      {
        url: "http://localhost:3005",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [`${__dirname}/Routes/doctor.js`],
};

module.exports = { options };
