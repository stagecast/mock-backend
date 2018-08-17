const express = require('express');
const path = require('path');

module.exports = class BaseController {
  constructor() {
    this.init();
  }
  getRoutes() {
    return this.router;
  };
  GetBase(req, res) {
    res.status(200).sendFile(path.join(global.basePath + '/views/intro.html'));
  };
  init() {
    this.router = express.Router();
    this.router
      .get("/", this.GetBase)
  };
}