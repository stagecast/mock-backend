const express = require('express');
const path = require('path');

module.exports = class ApiController {
  constructor() {
    this.init();
  }
  getRoutes() {
    return this.router;
  };
  GetVersion(req, res) {
    res.json({ version: '1.0' });
  };
  GetApiDocs(req, res) {
    res.status(200).sendFile(path.join(global.basePath + '/views/docs.html'));
  };
  init() {
    this.router = express.Router();

    this.router
      .get("/", this.GetVersion)
      .get("/docs", this.GetApiDocs);
  };
}