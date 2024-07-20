const employeeFunctions = require("./employee-validation.js");
const entriesFunctions = require("./entries-validation.js");
const contactErrorMsg = "Contact number must be eleven (11) numeric digits.";
const reqMissingFields = "Required fields missing";
const cpfError = "Error while inserting CPF. Please check and try again";
const invalidObject = "Invalid Object.";
const noPassword = "Password is required.";
const undefined = "Please inform the following field:";

const validationCall = {
  execEmployeeValidations: function execEmployeeValidations(obj) {
    let msg = "";
    if (!employeeFunctions.objectValidation(obj)) {
      msg = invalidObject;
    }
    if (
      !employeeFunctions.nullValidation(obj.name) ||
      !employeeFunctions.nullValidation(obj.contact) ||
      !employeeFunctions.nullValidation(obj.cpf)
    ) {
      msg = reqMissingFields;
    }
    if (!employeeFunctions.contactValidation(obj.contact)) {
      msg = contactErrorMsg;
    }
    if (!employeeFunctions.CPFValidation(obj.cpf)) {
      msg = cpfError;
    }
    return msg;
  },
  execPasswordValidation: function execPasswordValidation(password) {
    if (password == null) return `${undefined} password`;
    if (password.length <= 0) return noPassword;
  },
  execEntriesValidations: function execEntriesValidations(obj) {
    let msg = "";
    if (obj == null || obj != null) msg = "deu";
    return msg;
  },
};

module.exports = validationCall;
