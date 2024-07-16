//#region Imports
const { Employees } = require("../../models/Employees.js");
const validations = require("../../utils/validationCall.js");
const mapper = require("../../mappers/employee-mapper.js");
//#endregion
module.exports = {
  getAll: async (req, res) => {
    try {
      const response = await Employees.find(
        {},
        { name: 1, contact: 1, cpf: 1, pin: 1 }
      );
      if (!response.errors) {
        return res.status(200).json({ msg: "OK", result: response });
      } else {
        return res.status(404).json({ msg: "None:", result: response });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server Error:", result: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      const response = await Employees.findOne(
        { _id: req.params.id },
        { __v: 0 }
      );
      if (!response.errors) {
        return res.status(200).json({ msg: "OK", result: response });
      } else {
        return res
          .status(404)
          .json({ msg: "Employee not found", result: response });
      }
    } catch (erro) {
      return res.status(500).json({ msg: "Server error", result: `${erro}` });
    }
  },
  insertEmployee: async (req, res) => {
    try {
      let msg = validations.execValidations(req.body);

      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }
      const response = await Employees.create(mapper.mapToEmployee(req.body));
      if (!response.errors) {
        return res.status(200).json({ msg: "OK" });
      } else {
        return res.status(400).json({ msg: "Error while inserting employee" });
      }
    } catch (erro) {
      console.log(erro);
      return res.status(500).json({ msg: "Server error", error: `${erro}` });
    }
  },
  updateEmployee: async (req, res) => {
    try {
      let msg = validations.execValidations(req.body);
      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }
      const response = await Employees.findByIdAndUpdate(
        req.params.id,
        mapper.mapToEmployee(req.body),
        {
          returnDocument: "after",
        }
      );
      if (response) {
        return res.status(200).json({
          msg: "OK",
          result: { updated: [response] },
        });
      } else {
        return res
          .status(500)
          .json({ msg: "Error while updating employee", result: null });
      }
    } catch (erro) {
      res.status(500).json({ error: "Server error", result: `${erro}` });
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      let id = req.params.id;
      const response = await Employees.findByIdAndDelete(id);
      if (response) {
        return res.json({
          result: {
            msg: "OK",
            id: `${id}`,
          },
        });
      } else {
        return res.status(404).json({
          msg: "Employee not found or could not be deleted.",
          result: null,
        });
      }
    } catch (erro) {
      res.status(500).json({ msg: "Server error", result: `${erro}` });
    }
  },
};
