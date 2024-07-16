const securedPin = require("secure-pin");
const bcrypt = require("bcrypt");

const security = {
  generatePin: function generatePin(param) {
    return securedPin.generatePinSync(param);
  },
  encryptPassword: function encryptPassword(password) {
    return bcrypt.hashSync(password, 5);
  },
};
module.exports = security;
