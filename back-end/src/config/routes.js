const router = require("express").Router();

/* Controller Variables */
const employeesController = require("../controllers/employees-controller/employeesController.js");
const entriesController = require("../controllers/entries-controller/entriesController.js");

/* Controller Routes */

/* Employees Routes */
router.get("/getEmployees", employeesController.getAll);
router.get("/getEmployeesById/:id", employeesController.getById);
router.post("/insertEmployee", employeesController.insertEmployee);
router.put("/updateEmployee/:id", employeesController.updateEmployee);
router.delete("/deleteEmployee/:id", employeesController.deleteEmployee);

/* Punch-in Routes */

module.exports = router;
