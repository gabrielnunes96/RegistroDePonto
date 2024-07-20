//#region Imports
const Employees = require("../../models/Employees.js");
const validationCall = require("../../validations/validationCall.js");
const mapper = require("../../mappers/employee-mapper.js");
//#endregion
module.exports = {
  getAllEmployees: async (req, res) => {
    try {
      const response = await Employees.find(
        {},
        { name: 1, contact: 1, cpf: 1, pin: 1 }
      );
      if (response != null) {
        return res.status(200).json({ msg: "OK", result: response });
      } else {
        return res.status(404).json({ msg: "None:", result: response });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Internal server error:", result: error.message });
    }
  },
  getEmployeeById: async (req, res) => {
    try {
      const response = await Employees.findById(req.params.id);
      if (response != null) {
        return res.status(200).json({ msg: "OK", result: response });
      } else {
        return res
          .status(404)
          .json({ msg: "Employee not found", result: response });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
  insertEmployee: async (req, res) => {
    try {
      let msg =
        validationCall.execPasswordValidation(req.body.password) ||
        validationCall.execEmployeeValidations(req.body);
      if (!msg == "") {
        return res.status(404).json({ msg: msg, result: null });
      }
      const response = await Employees.create(mapper.mapToEmployee(req.body));
      if (response) {
        return res.status(201).json({ msg: "Created", result: response });
      } else {
        return res.status(404).json({
          msg: "Error while inserting employee",
          result: response.errors,
        });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
  updateEmployee: async (req, res) => {
    try {
      let oldValue = await Employees.findById(req.params.id);
      let newValue = mapper.mapToEmployee(req.body, oldValue);
      let msg = validationCall.execEmployeeValidations(newValue);
      if (!msg == "") {
        return res.status(400).json({ msg: msg, result: null });
      }
      const response = await Employees.findByIdAndUpdate(
        req.params.id,
        newValue,
        { returnDocument: "after" }
      );
      if (response) {
        return res.status(200).json({ msg: "Updated", result: response });
      } else {
        return res
          .status(400)
          .json({ msg: "Bad Request", result: response.errors });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      const response = await Employees.findByIdAndDelete(req.params.id);
      if (response) {
        return res.status(200).json({ msg: "Deleted", result: req.params.id });
      } else {
        return res
          .status(400)
          .json({ msg: "Bad Request", result: response.errors });
      }
    } catch (erro) {
      return res
        .status(500)
        .json({ msg: "Internal server error", result: erro.message });
    }
  },
};
