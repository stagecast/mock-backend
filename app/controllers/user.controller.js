const path = require('path');
const express = require('express');
const Database = require('../database');

var jwt = require('jsonwebtoken');
var config = require('../config');
var nodemailer = require('nodemailer');

module.exports = class UserController {

  constructor(auth) {
    this.User = require('../models/user.model');
    this.UserDB = new Database(this.User);
    this.auth = auth;
    this.init();
  }

  getRoutes() {
    return this.router;
  };

  /** get all users */
  GetAllUsers(req, res) {
    this.UserDB.getAll({}, { password: 0, _id: 0 })
      .then(result => res.status(200).json(result))
      .catch(error => res.status(404));
  };

  /** get user by email */
  GetUser(req, res) {
    let email = req.params['id'];
    this.UserDB.get({ email }, { password: 0, _id: 0 })
      .then(result => res.status(200).json(result))
      .catch(error => res.status(404));
  };

  /** delete user by email */
  DeleteUser(req, res) {
    let email = req.params['id'];
    this.UserDB.delete({ email })
      .then(result => res.status(200).json(result))
      .catch(error => res.status(404));
  };

  /** login */
  Login(req, res) {
    let email = req.body.email;
    this.UserDB.get({ email })
      .then(user => {
        if (user.password != req.body.password) {
          res.status(401).json({ success: false, message: 'Authentication failed.' });
          return;
        }

        res.json({
          success: true,
          message: 'Enjoy your token!',
          token: this.generateToken(user)
        });

      })
      .catch(error => {
        res.status(404).json({ success: false, message: 'Authentication failed. User not found.' });
      });
  };

  Register(req, res) {

    if (!req.body.email || !req.body.motivation) {
      res.status(400).json({ success: false, message: "You must provide additional parameters." });
      return;
    }

    let incomingUser = new this.User({
      email: req.body.email,
      name: req.body.name,
      lastname: req.body.lastname,
      company: req.body.company,
      isActive: false,
      phone: req.body.phone ? req.body.phone : '',
    });

    this.UserDB.insert(incomingUser)
      .then(result => result)
      .then(newUser => {
        let token = this.generateToken(newUser);
        this.sendEmail(newUser, token, incomingUser.motivation);
        res.sendStatus(200);
      })
      .catch(error => res.status(400).json({ success: false, message: error }));
  };

  Activate(req, res) {
    if (!req.body.password) {
      res.status(400).json({ success: false, message: 'You must set a password to activate' });
    }

    let user = {
      email: req.body.email,
      password: req.body.password,
      isActive: true,
    };

    this.UserDB.update({ email: user.email }, user)
      .then(user => {
        res.send(200)
      })
      .catch(error => res.sendStatus(404));
  };

  // util 
  generateToken(user) {
    return jwt.sign({ email: user.email, isActive: user.isActive }, config.secret);
  }

  sendEmail(user, token, motivation) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'testermail110@gmail.com',
        pass: 'testmyapi123'
      }
    });

    var mailOptions = {
      from: 'testermail110@gmail.com',
      to: `${user.email}, testermail110@gmail.com`,
      subject: `Register user ${user.name}`,
      html: `<p>Your motivation: ${motivation} </p>Click <a href="http://localhost:4200/register/password?token=${token}">http://localhost:4200/register/password?token=${token}</a> to reset your password</p>`
    };

    try {
      transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  init() {
    this.router = express.Router();

    this.router
      .get("/", this.auth, this.GetAllUsers.bind(this))
      .get("/:id", this.auth, this.GetUser.bind(this))
      .delete("/:id", this.DeleteUser.bind(this))
      .post("/login", this.Login.bind(this))
      .post("/register", this.Register.bind(this))
      .post("/activate", this.Activate.bind(this));
  };
}