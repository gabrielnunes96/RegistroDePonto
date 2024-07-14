const functions = require("../utils/validation.js");
const contactErrorMsg = "Contact number must be eleven (11) numeric digits.";
const reqMissingFields = "Required fields missing";
const cpfError = "Error while inserting CPF. Please check and try again";
const invalidObject = "Invalid Object.";
let msg = "";
const callValidation = {
  isValid: function isValid(obj) {
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
  isValidByValue: function isValidByValue(obj) {
    if (!functions.objectValidation(obj)) {
      msg = invalidObject;
    }
    if (obj.name) {
      if (!functions.nullValidation(obj.name)) msg = reqMissingFields;
    }
    if (obj.contact) {
      if (!functions.nullValidation(obj.contact)) msg = reqMissingFields;
      if (!functions.contactValidation(obj.contact)) msg = contactErrorMsg;
    }
    if (obj.cpf) {
      if (!functions.nullValidation(obj.cpf)) msg = reqMissingFields;
      if (!functions.CPFValidation(obj.cpf)) msg = cpfError;
    }
    if (obj.password) {
      if (!functions.nullValidation(obj.password)) msg = reqMissingFields;
    }
    if (obj.pin) {
      if (!functions.nullValidation(obj.pin)) msg = reqMissingFields;
    }
  },
};
module.exports = callValidation;
