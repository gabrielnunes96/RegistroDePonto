const functions = require("./validations.js");
const contactErrorMsg = "Contact number must be eleven (11) numeric digits.";
const reqMissingFields = "Required fields missing";
const cpfError = "Error while inserting CPF. Please check and try again";
const invalidObject = "Invalid Object.";
const noPassword = "Password is required.";
const undefined = "Please inform the following field:";

const validationCall = {
  execEmployeeValidations: function execEmployeeValidations(obj) {
    let msg = "";
    if (!functions.objectValidation(obj)) {
      msg = invalidObject;
    }
    if (
      !functions.nullValidation(obj.name) ||
      !functions.nullValidation(obj.contact) ||
      !functions.nullValidation(obj.cpf)
    ) {
      msg = reqMissingFields;
    }
    if (!functions.contactValidation(obj.contact)) {
      msg = contactErrorMsg;
    }
    if (!functions.CPFValidation(obj.cpf)) {
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
    if (!functions.objectValidation(obj)) msg = invalidObject;
    if (
      !functions.nullValidation(obj.employeePin) ||
      !functions.nullValidation(obj.employeeName)
    )
      msg = reqMissingFields;
    if (
      obj.isLate === true &&
      (!obj.justification || obj.justification.trim() === "")
    ) {
      msg = "Justificativa obrigatória para registro em atraso.";
    }
    return msg;
  },
};

module.exports = validationCall;
