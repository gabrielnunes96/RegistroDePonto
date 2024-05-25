//#region Imports
const employeesService = require("./../../services/employees-services/employeesServices.js");
const validations = require("../../utils/validationCall.js");
const securedPin = require("secure-pin");
const bcrypt = require("bcrypt");
//#endregion
module.exports = {
  getAll: async (req, res) => {
    try {
      const _employees = await employeesService.getAll();
      if (!_employees || _employees.recordsets[0].length === 0) {
        return res
          .status(404)
          .json({ msg: "None", result: _employees.recordset });
      } else {
        return res
          .status(200)
          .json({ msg: "OK:", result: _employees.recordset });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Server Error:", result: error.message });
    }
  },
  getById: async (req, res) => {
    try {
      let id = req.params.id;
      const employee = await employeesService.getById(id);
      if (!employee || employee.recordsets[0].length === 0) {
        return res
          .status(404)
          .json({ msg: "Employee not found", result: employee.recordset });
      } else {
        return res.status(200).json({ msg: "OK", result: employee.recordset });
      }
    } catch (erro) {
      return res.status(500).json({ msg: "Server error", result: `${erro}` });
    }
  },
  insertEmployee: async (req, res) => {
    try {
      req.body.pin = securedPin.generatePinSync(4);
      req.body.password = await bcrypt.hash(req.body.password, 5);

      let msg = validations.isValid(req.body);
      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }

      const _employee = await employeesService.insertEmployee(req.body);
      if (_employee.rowsAffected != 0) {
        return res.status(200).json({
          msg: "OK",
          result: { employee: _employee.recordset },
        });
      } else {
        return res
          .status(500)
          .json({ msg: "Error while inserting employee", result: null });
      }
    } catch (erro) {
      return res.status(500).json({ msg: "Server error", result: `${erro}` });
    }
  },
  updateEmployee: async (req, res) => {
    try {
      let msg = validations.isValid(req.body);
      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }

      const updatedEmployee = await employeesService.updateEmployee(req.body);
      if (updatedEmployee.rowsAffected != 0) {
        return res.status(200).json({
          msg: "OK",
          result: { updated: updatedEmployee.recordset },
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
  updateValueByParam: async (req, res) => {
    try {
      let msg = validations.isValidByValue(req.body);
      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }

      const updatedEmployee = await employeesService.updateEmployee(req.body);
      if (updatedEmployee.rowsAffected != 0) {
        return res.status(200).json({
          msg: "OK",
          result: { updated: updatedEmployee.recordset },
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
      let deleted = await employeesService.deleteEmployee(id);
      if (deleted.rowsAffected != 0) {
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
