const express = require("express");
const router = express.Router();

/* Controller Variables */
const employeesController = require("../controllers/employees-controller/employeesController.js");
const punchinController = require("../controllers/punch-in-controller/punchInController.js");

/* Controller Routes */

/* Employees Routes */
router.get("/getEmployees", employeesController.getAll);
router.get("/getEmployeesById/:id", employeesController.getById);
router.post("/insertEmployee", employeesController.insertEmployee);
router.put("/updateEmployee", employeesController.updateEmployee);
router.delete("/deleteEmployee/:id", employeesController.deleteEmployee);

/* Punch-in Routes */

module.exports = router;
