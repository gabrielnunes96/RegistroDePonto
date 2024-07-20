const mongoose = require("mongoose");
const { Schema } = mongoose;

const entriesSchema = new Schema({
  punchIn: {
    type: Date,
  },
  punchOut: {
    type: Date,
  },
  employeePin: {
    type: String,
    required: true,
  },
  employeeNAme: {
    type: String,
  },
});
const Entries = mongoose.model("Entries", entriesSchema);
module.exports = Entries;
