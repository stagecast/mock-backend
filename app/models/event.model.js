var mongoose = require('mongoose');
//Define a schema
var Schema = mongoose.Schema;

var EventModelSchema = new Schema({
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
  isPublic: {
    type: Boolean,
    default: false,
  },

}, { timestamps: { createdAt: 'created_at' } });

// db.users.createIndex({ "email": 1 }, { unique: true });
module.exports = db.model('events', EventModelSchema);