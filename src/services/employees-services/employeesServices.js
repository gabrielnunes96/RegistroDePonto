const db = require("../../config/database");
module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM employees";
      db.query(query, (error, results) => {
        error ? reject(error) : resolve(results);
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM employees WHERE id = '${id}'`;
      db.query(query, (error, results) => {
        error
          ? reject(error)
          : resolve(results.length === 0 ? resolve(false) : resolve(results));
      });
    });
  },
  insertEmployee: (name, contact, cpf) => {
    return new Promise((resolve, reject) => {
      let query = `INSERT INTO employees (name, contact, cpf) VALUES ('${name}','${contact}','${cpf}')`;
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },
  updateEmployee: (id, name, contact, cpf) => {
    return new Promise((resolve, reject) => {
      let query = `UPDATE employees SET name = '${name}', contact = '${contact}', cpf = '${cpf}'  WHERE id = '${id}'`;
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },
  deleteEmployee: (id) => {
    return new Promise((resolve, reject) => {
      let query = `DELETE FROM employees WHERE id = '${id}'`;
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },
};
