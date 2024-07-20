const security = require("../utils/security.js");
const mappers = {
  mapToEmployee: function mapToEmployee(reqBody, response) {
    const employee = {
      name: reqBody.name ? reqBody.name : response.name,
      contact: reqBody.contact ? reqBody.contact : response.contact,
      cpf: reqBody.cpf ? reqBody.cpf : response.cpf,
      pin: response ? response.pin : security.generatePin(4),
      password: response
        ? response.password
        : security.encryptPassword(reqBody.password),
    };
    return employee;
  },
};

module.exports = mappers;
