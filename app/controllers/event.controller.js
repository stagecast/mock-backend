const path = require('path');
const express = require('express');
const Database = require('../database');

var config = require('../config');

module.exports = class EventController {

  constructor(auth) {
    this.Event = require('../models/event.model');
    this.EventDB = new Database(this.Event);
    this.auth = auth;
    this.init();
  }

  getRoutes() {
    return this.router;
  };

  /** get all users */
  GetAllEvents(req, res) {
    let pagination = {};
    if (req.query.offset && req.query.limit) {
      pagination = {
        skip: parseInt(req.query.offset),
        limit: parseInt(req.query.limit)
      }
    }
    this.EventDB.getAll({ $query: {}, $orderby: { start_time: -1 } }, {}, pagination)
      .then(result => res.status(200).json(result))
      .catch(error => res.status(404));
  };

  /** get user by email */
  GetEvent(req, res) {
    let _id = req.params['id'];
    this.EventDB.get({ _id }, {})
      .then(result => res.status(200).json(result))
      .catch(error => res.status(404));
  };

  //   /** delete user by email */
  //   DeleteEvent(req, res) {
  //     let email = req.params['id'];
  //     this.EventDB.delete({ email })
  //       .then(result => res.status(200).json(result))
  //       .catch(error => res.status(404));
  //   };

  //   /** delete user by email */
  //   CreateEvent(req, res) {
  //     let email = req.params['id'];
  //     this.EventDB.delete({ email })
  //       .then(result => res.status(200).json(result))
  //       .catch(error => res.status(404));
  //   };

  //   /** delete user by email */
  //   UpdateEvent(req, res) {
  //     let email = req.params['id'];
  //     this.EventDB.delete({ email })
  //       .then(result => res.status(200).json(result))
  //       .catch(error => res.status(404));
  //   };

  init() {
    this.router = express.Router();

    this.router
      .get("/", this.GetAllEvents.bind(this))
      //   .post("/", this.CreateEvent.bind(this))
      .get("/:id", this.GetEvent.bind(this))
      //   .post("/:id", this.UpdateEvent.bind(this))
      //   .delete("/:id", this.DeleteEvent.bind(this))
  };
}