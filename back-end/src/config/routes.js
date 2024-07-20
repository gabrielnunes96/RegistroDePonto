const router = require("express").Router();

//#region  Controller Variables
const employeesController = require("../controllers/employees-controller/employeesController.js");
const entriesController = require("../controllers/entries-controller/entriesController.js");
//#endregion

//#region Controller Routes

/* Employees Routes */
router.get("/getEmployees", employeesController.getAllEmployees);
router.get("/getEmployeesById/:id", employeesController.getEmployeeById);
router.post("/insertEmployee", employeesController.insertEmployee);
router.put("/updateEmployee/:id", employeesController.updateEmployee);
router.delete("/deleteEmployee/:id", employeesController.deleteEmployee);

/* Entries Routes */
router.get("/getAllEntries", entriesController.getAllEntries);
router.get("getByEntrieById/:id", entriesController.getByEntrieById);
router.post("/insertEntrie", entriesController.insertEntrie);
router.put("/updateEntrie/:id", entriesController.updateEntrie);
router.delete("/deleteEntrie/:id", entriesController.deleteEntrie);
//#endregion Controller Routes

module.exports = router;
