const db = require("../../config/database");
const querys = require("../../utils/sqlBasicQuery");
const _tableName = "registers";
module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      let query = query.getAll({ tableName: _tableName });
      db.query(query, (error, results) => {
        error ? reject(error) : resolve(results);
      });
    });
  },
  getById: (_id) => {
    return new Promise((resolve, reject) => {
      let query = querys.getById({ tableName: _tableName, id: _id });
      db.query(query, (error, results) => {
        error
          ? reject(error)
          : resolve(results.length === 0 ? resolve(false) : resolve(results));
      });
    });
  },
  insertRegister: () => {
    return new Promise((resolve, reject) => {
      const req = {
        tableName: _tableName,
        columns: {
          clockIn: "",
          clockOut: null,
        },
      };
      let query = querys.insert(req);
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
