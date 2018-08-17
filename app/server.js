var mongoose = require('mongoose');
const App = require('./app');

let app;

const port = process.env.PORT || 3000;
global.basePath = __dirname;

const MONGO_HOST = process.env.MONGO_HOST || "localhost";
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const DB_NAME = process.env.DB_NAME || 27017;

// MongoDB connection
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`;
console.log(MONGO_URL);
mongoose.connect(MONGO_URL);

global.db = mongoose.connection;

// Retry connection
const connectWithRetry = () => {
  console.log('MongoDB connection with retry')
  mongoose.connect(MONGO_URL);
  db = mongoose.connection;
}

// Exit application on error
db.on('error', err => {
  console.log(`MongoDB connection error: ${err}`)
  setTimeout(connectWithRetry, 5000)
    // process.exit(-1)
})

db.on('connected', () => {
  console.log('MongoDB is connected')
  app = new App().express;
  startServer();
  app.emit('ready');
})

/** Start the service */
function startServer() {
  app.on('ready', function() {
    app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}/`);
    });
  });
}