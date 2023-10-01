const db = require("../../config/database");
module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM employees";
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM employees WHERE id = ?";
      db.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        if (results.length === 0) {
          resolve(false);
        } else {
          resolve(results[0]);
        }
      });
    });
  },
  insertEmployee: (name, contact) => {
    return new Promise((resolve, reject) => {
      let query = "INSERT INTO employees (name, contact) VALUES (?, ?)";
      db.query(query, [name, contact], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results.insertId);
      });
    });
  },
  updateEmployee: (id, name, contact) => {
    return new Promise((resolve, reject) => {
      let query = "UPDATE employees SET name = ?, contact = ? WHERE id = ?";
      db.query(query, [name, contact, id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results.affectedRows > 0);
      });
    });
  },
  deleteEmployee: (id) => {
    return new Promise((resolve, reject) => {
      let query = "DELETE FROM employees WHERE id = ?";
      db.query(query, [id], (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results.affectedRows > 0);
      });
    });
  },
};
