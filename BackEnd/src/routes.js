const express = require("express");
const router = express.Router();
const employeesController = require("./controllers/employees-controller/employeesController.js");
router.get("/getEmployees", employeesController.getAll);
router.get("/getEmployeesById/:id", employeesController.getById);
module.exports = router;
