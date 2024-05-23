const employeesService = require("../../services/employees-services/employeesServices");
const validations = require("../../utils/validation.js");
module.exports = {
  getAll: async (req, res) => {
    try {
      const employees = await employeesService.getAll();
      res.json({
        result: employees.map((employee) => ({
          id: employee.id,
          name: employee.name,
          contact: employee.contact,
        })),
      });
    } catch (error) {
      res.status(500).json({ error: "Error.", result: [] });
    }
  },
  getById: async (req, res) => {
    try {
      let id = req.params.id;
      let employee = await employeesService.getById(id);

      if (!employee)
        return res
          .status(404)
          .json({ error: "Employee not found", result: null });
      res.json({ result: { name: employee.name, contact: employee.contact } });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error searching employee by Id", result: null });
    }
  },
  insertEmployee: async (req, res) => {
    try {
      const { name, contact, cpf } = req.body;

      if (!validations.contactValidation(contact)) {
        return res.status(400).json({
          error: "Contact number must be eleven (11) numeric digits.",
          result: null,
        });
      }
      if (!validations.nullValidation(name, contact)) {
        return res
          .status(400)
          .json({ error: "Name and contact are required", result: null });
      }
      if (!validations.CPFValidation(cpf)) {
        return res.status(400).json({
          error: "Error while inserting CPF. Please check and try again.",
          result: null,
        });
      }
      const employeeId = await employeesService.insertEmployee(name, contact);
      if (employeeId === null) {
        return res
          .status(500)
          .json({ error: "Error while inserting employee", result: null });
      }
      res.json({ result: { id: employeeId } });
    } catch (error) {
      res.status(500).json({ error: "Server error", result: null });
    }
  },
  updateEmployee: async (req, res) => {
    try {
      const { id, name, contact, cpf } = req.body;

      if (!contactValidation(contact)) {
        return res.status(400).json({
          error: "Contact number must be eleven (11) numeric digits.",
          result: null,
        });
      }
      if (!nullValidation(name, contact)) {
        return res
          .status(400)
          .json({ error: "Name and contact are required", result: null });
      }
      if (CPFValidation(cpf)) {
        return res.status(400).json({
          error: "Error while inserting CPF. Please check and try again.",
          result: null,
        });
      }

      const updated = await employeesService.updateEmployee(id, name, contact, cpf);
      if (!updated) {
        return res
          .status(500)
          .json({ error: "Error while updating employee", result: null });
      }
      res.status(200).json({ result: `Updated fields: ${ id, name, contact, cpf}` });
      
    } catch (error) {
      res.status(500).json({ error: "Server error", result: null });
    }
  },
  deleteEmployee: async (req, res) => {
    try {
      let id = req.params.id;
      let deleted = await employeesService.deleteEmployee(id);

      if (!deleted)
        return res.status(404).json({
          error: "Employee not found or could not be deleted.",
          result: null,
        });
      res.json({
        result: { message: "Employee deleted sucessfully" },
      });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Error searching employee by Id", result: null });
    }
  },
};
