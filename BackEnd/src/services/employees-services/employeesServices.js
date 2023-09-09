const db = require("../../database");
module.exports = {
  getAll: () => {
    return new Promise((accepted, rejected) => {
      let query = "SELECT * FROM employees";
      db.query(query, (error, results) => {
        if (error) {
          rejected(error);
          return;
        }
        accepted(results);
      });
    });
  },
  getById: (id) => {
    return new Promise((accepted, rejected) => {
      let query = "SELECT * FROM employees WHERE id = ?";
      db.query(query, [id], (error, results) => {
        if (error) {
          rejected(error);
          return;
        }
        if (results.length === 0) {
          accepted(false);
        } else {
          accepted(results[0]);
        }
      });
    });
  },
};
