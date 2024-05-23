const db = require("../../config/database");
module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM punchintime";
      db.query(query, (error, results) => {
        error ? reject(error) : resolve(results);
      });
    });
  },
  getById: (id) => {
    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM punchintime WHERE id = ?";
      db.query(query, [id], (error, results) => {
        error
          ? reject(error)
          : resolve(
              results.length === 0 ? resolve(false) : resolve(results[0])
            );
      });
    });
  },
};
