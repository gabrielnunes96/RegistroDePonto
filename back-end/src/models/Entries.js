const mongoose = require("mongoose");
const { Schema } = mongoose;

const entriesSchema = new Schema({
  employeePin: {
    type: String,
    required: true,
  },
  employeeName: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  punches: [
    {
      checkIn: {
        time: {
          type: Date,
        },
        justification: {
          type: [String],
        },
        isLate: {
          type: Boolean,
          default: false,
        },
      },
      checkOut: {
        time: {
          type: Date,
        },
        justification: {
          type: [String],
        },
        isLate: {
          type: Boolean,
          default: false,
        },
      },
    },
  ],
});
const Entries = mongoose.model("Entries", entriesSchema);
module.exports = Entries;
