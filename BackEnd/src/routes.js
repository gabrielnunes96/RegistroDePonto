const express = require("express");
const router = express.Router();
const employeesController = require("./controllers/employees-controller/employeesController.js");
router.get("/getEmployees", employeesController.getAll);
router.get("/getEmployeesById/:id", employeesController.getById);
router.post("/insertEmployee", employeesController.insertEmployee);
router.put("/updateEmployee", employeesController.updateEmployee);
router.delete("/deleteEmployee/:id", employeesController.deleteEmployee);
module.exports = router;
