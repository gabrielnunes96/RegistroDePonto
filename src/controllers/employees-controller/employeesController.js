const employeesService = require("../../services/employees-services/employeesServices");
const validations = require("../../utils/validationCall.js");
module.exports = {
  getAll: async (req, res) => {
    try {
      const employees = await employeesService.getAll();
      if (!employees || employees.recordsets[0].length === 0) {
        return res
          .status(404)
          .json({ msg: "None", result: employees.recordset });
      } else {
        return res
          .status(200)
          .json({ msg: "OK:", result: employees.recordset });
      }
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Database Error:", result: error.message });
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
      return res
        .status(500)
        .json({ msg: "Error searching employee by Id", result: `${erro}` });
    }
  },
  insertEmployee: async (req, res) => {
    try {
      const { name, contact, cpf } = req.body;

      if (!req.body || Object.keys(req.body).length === 0)
        return res.status(400).json({ msg: "Invalid object", result: null });

      let msg = validations.isValid(req.body);
      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }
      const employee = await employeesService.insertEmployee(
        name,
        contact,
        cpf
      );
      if (employee.rowsAffected != 0) {
        return res.status(200).json({
          msg: "OK",
          result: {
            name: req.body.name,
            contact: req.body.contact,
            cpf: req.body.cpf,
          },
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
      const { id, name, contact, cpf } = req.body;

      let msg = validations.isValid(req.body);
      if (!msg == "") {
        return res.status(400).json({ msg: `${msg}`, result: null });
      }

      const updatedEmployee = await employeesService.updateEmployee(
        id,
        name,
        contact,
        cpf
      );

      if (updatedEmployee.rowsAffected != 0) {
        return res.status(200).json({
          msg: "OK",
          result: {
            name: req.body.name,
            contact: req.body.contact,
            cpf: req.body.cpf,
          },
        });
      } else {
        return res
          .status(500)
          .json({ msg: "Error while inserting employee", result: null });
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
          result: { msg: "OK", id: `${id}` },
        });
      } else {
        return res.status(404).json({
          msg: "Employee not found or could not be deleted.",
          result: null,
        });
      }
    } catch (erro) {
      res
        .status(500)
        .json({ msg: "Error searching employee by Id", result: `${erro}` });
    }
  },
};
