const express = require('express');

module.exports = class WelcomeController {

  constructor() {
    this.init();
  }

  getRoutes() {
    return this.router;
  }

  GetWelcome(req, res) {
    res.status(200).send(`Welcome to the test!`);
  }

  GetWelcomeName(req, res) {
    res.status(200).send(`Welcome ${req.params['id']}`);
  }

  init() {
    this.router = express.Router();
    this.router
      .get("/", this.GetWelcome)
      .get("/:id", this.GetWelcomeName);
  }
}