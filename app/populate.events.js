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

  var EvenModelSchema = new Schema({
    title: String,
    venue: String,
    start_time: {
      type: Date,
      default: Date.now
    },
    end_time: {
      type: Date,
      default: Date.now
    },
    description: String,
    description: String,
    public: {
      type: Boolean,
      default: false,
    },

  }, { timestamps: { createdAt: 'created_at' } });

  // db.users.createIndex({ "email": 1 }, { unique: true });
  return db.model('events', EvenModelSchema);


}

function populate() {
  getSchema().insertMany(JSON.parse(fs.readFileSync(path.join(__dirname, '/static-storage/events.json'), 'utf8')))
    .then(function(mongooseDocuments) {
      console.log('pupulated successfully');
      db.close();
    })
    .catch(function(err) {
      console.log(err);
      db.close();
    });
}