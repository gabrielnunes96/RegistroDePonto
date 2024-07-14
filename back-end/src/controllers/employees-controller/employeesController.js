//#region Imports
const { Employees } = require("../../models/Employees.js");
const validations = require("../../utils/validationCall.js");
const mapper = require("../../mappers/employee-mapper.js");
//#endregion
module.exports = {
  
  getAll: async (res) => {
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
      let employee = mapper.mapToEmployee(req.body);
      let msg = validations.isValid(employee);

      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }
      const response = await Employees.create(employee);
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
