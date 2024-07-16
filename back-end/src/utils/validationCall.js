const functions = require("../utils/validation.js");
const contactErrorMsg = "Contact number must be eleven (11) numeric digits.";
const reqMissingFields = "Required fields missing";
const cpfError = "Error while inserting CPF. Please check and try again";
const invalidObject = "Invalid Object.";
let msg = "";
const callValidation = {
  execValidations: function execValidations(obj) {
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
};
module.exports = callValidation;
