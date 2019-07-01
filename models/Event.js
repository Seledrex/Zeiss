const mongoose = require("mongoose");

var EventSchema = new mongoose.Schema({
  machine_id: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = Event = mongoose.model("Event", EventSchema);
