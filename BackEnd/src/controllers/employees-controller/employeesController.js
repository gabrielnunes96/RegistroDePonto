const employeesService = require("../../services/employees-services/employeesServices");
module.exports = {
  getAll: async (req, res) => {
    try {
      const employees = await employeesService.getAll();
      res.json({
        result: employees.map((employee) => ({
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
};
