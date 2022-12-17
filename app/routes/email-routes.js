module.exports = app => {
  const email = require("../controllers/email.controller.js");

  var router = require("express").Router();

  router.post("/", email.send);

  app.use("/api/email", router);
};
