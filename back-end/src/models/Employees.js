const mongoose = require("mongoose");
const { Schema } = mongoose;

const employeeSchema = new Schema({
  name: {
    type: String,
  },
  contact: {
    type: String,
  },
  cpf: {
    type: String,
    unique: true,
  },
  pin: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  isAdmin: {
    type: Boolean,
  },
});
const Employees = mongoose.model("Employees", employeeSchema);
module.exports = Employees;
