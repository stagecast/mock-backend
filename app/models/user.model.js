var mongoose = require('mongoose');
//Define a schema
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
module.exports = db.model('users', UserModelSchema);