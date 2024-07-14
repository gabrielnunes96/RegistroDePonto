const security = require("../utils/security.js");
const mappers = {
  mapToEmployee: function mapToEmployee(reqBody) {
    const employee = {
      name: reqBody.name,
      contact: reqBody.contact,
      cpf: reqBody.cpf,
      pin: security.generatePin(),
      password: security.encryptPassword(reqBody.password),
    };
    return employee;
  },
};
module.exports = mappers;
