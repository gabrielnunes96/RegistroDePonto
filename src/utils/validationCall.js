const functions = require("../utils/validation.js");
const callValidation = {
  isValid: function isValid(obj) {
    let msg = "";
    if (!functions.contactValidation(obj.contact)) {
      msg = "Contact number must be eleven (11) numeric digits.";
    }
    if (!functions.nullValidation(obj.name, obj.contact)) {
      msg = "Name and contact are required";
    }
    if (!functions.CPFValidation(obj.cpf)) {
      msg = "Error while inserting CPF. Please check and try again.";
    }
    return msg;
  },
};
module.exports = callValidation;
