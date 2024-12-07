const router = require("express").Router();
const authenticate = require("../utils/authenticate.js");

//#region  Controller Variables
const employeesController = require("../controllers/employees-controller/employeesController.js");
const entriesController = require("../controllers/entries-controller/entriesController.js");
//#endregion

//#region Controller Routes

/* Employees Routes */
router.get("/getEmployees",authenticate, employeesController.getAllEmployees);
router.get("/getEmployeesById/:id", authenticate, employeesController.getEmployeeById);
router.post("/insertEmployee",authenticate, employeesController.insertEmployee);
router.put("/updateEmployee/:id", authenticate, employeesController.updateEmployee);
router.delete("/deleteEmployee/:id", authenticate, employeesController.deleteEmployee);
router.post("/signIn", employeesController.signIn);

/* Entries Routes */
router.get("/getAllEntries", authenticate, entriesController.getAllEntries);
router.get("getByEntrieById/:id", authenticate, entriesController.getByEntrieById);
router.post("/insertEntrie", authenticate, entriesController.insertEntrie);
router.put("/updateEntrie/:id", authenticate, entriesController.updateEntrie);
router.delete("/deleteEntrie/:id", authenticate, entriesController.deleteEntrie);
//#endregion Controller Routes

module.exports = router;
