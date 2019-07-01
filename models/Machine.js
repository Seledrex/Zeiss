const mongoose = require("mongoose");

var MachineSchema = new mongoose.Schema({
  machine_id: {
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

module.exports = Machine = mongoose.model("Machine", MachineSchema);
