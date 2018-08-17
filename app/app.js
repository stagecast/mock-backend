/* Express Web Application - REST API Host */
let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
let jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
let config = require('./config')
  // App routes
const ApiController = require('./controllers/api.controller');
const BaseController = require('./controllers/base.controller');
const EventController = require('./controllers/event.controller');
const WelcomeController = require('./controllers/welcome.controller');
const UserController = require('./controllers/user.controller');

module.exports = class App {

  constructor() {
    this.express = express();
    this.express.disable('etag');
    this.express.set('superSecret', config.secret); // secret variable


    this
      .setMiddlewares()
      .setRoutes();
  }

  setMiddlewares() {
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: false }));

    return this;
  }

  auth(req, res, next) {
    // check header or url parameters or post parameters for token
    var token = req.headers['x-token'];

    // decode token
    if (token) {

      // verifies secret and checks exp
      jwt.verify(token, this.express.get('superSecret'), function(err, decoded) {
        if (err || !decoded.isActive) {
          return res.json({ success: false, message: 'Not authorized' });
        } else {
          // if everything is good, save to request for use in other routes
          req.decoded = decoded;
          next();
        }
      });

    } else {

      // if there is no token
      // return an error
      return res.status(403).send({
        success: false,
        message: 'No token provided.'
      });

    }
  }

  setRoutes() {
    let router = express.Router({ mergeParams: true });

    let uc = new UserController(this.auth.bind(this));
    let ec = new EventController(this.auth.bind(this));
    let wc = new WelcomeController();
    let ac = new ApiController();
    let bc = new BaseController();

    // apiRoutes
    //   .use('/welcome', welcomeRoutes)
    //   .use('/users', userRoutes);
    this.express
      .use('/api/v1/users', uc.getRoutes())
      .use('/api/v1/events', ec.getRoutes())
      .use('/api/v1/welcome', wc.getRoutes())
      .use('/api/v1', ac.getRoutes())
      .use('/', bc.getRoutes());
    return this;
  }

}