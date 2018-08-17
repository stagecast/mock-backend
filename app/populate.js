var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

global.basePath = __dirname;

const MONGO_HOST = "localhost";
const MONGO_PORT = 27017;
const DB_NAME = 'stagecast';

// MongoDB connection
const MONGO_URL = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${DB_NAME}`;
console.log(MONGO_URL);
mongoose.connect(MONGO_URL);

var db = mongoose.connection;


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

db.once('open', function() {
  console.log('MongoDB connection opened');
  console.log('populating...');
  populate();
});


function getSchema() {
  var Schema = mongoose.Schema;

  var UserModelSchema = new Schema({
    email: {
      type: String,
      required: true,
      index: true,
      unique: true,
    },
    name: {
      type: String,
      required: true
    },
    lastname: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    isActive: Boolean,
    password: String,
    phone: String
  });
  // db.users.createIndex({ "email": 1 }, { unique: true });

  return mongoose.model('users', UserModelSchema);


}

function populate() {
  getSchema().insertMany(JSON.parse(fs.readFileSync(path.join(__dirname, '/static-storage/users.json'), 'utf8')))
    .then(function(mongooseDocuments) {
      console.log('pupulated successfully');
      db.close();
    })
    .catch(function(err) {
      console.log(error);
      db.close();
    });
}