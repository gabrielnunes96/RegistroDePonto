const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    cpf: {
      type: String,
      required: true,
      unique: true,
    },
    pin: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);
const Employees = mongoose.model("Employees", employeeSchema);
module.exports = { Employees };
