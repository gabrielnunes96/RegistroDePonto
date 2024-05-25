const db = require("../../config/database.js");
const querys = require("../../utils/sqlBasicQuery.js");
const _tableName = "employees";

module.exports = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      let query = querys.getAll({ tableName: _tableName });
      db.query(query, (error, results) => {
        error ? reject(error) : resolve(results);
      });
    });
  },
  getById: (_id) => {
    return new Promise((resolve, reject) => {
      let query = querys.getById({ tableName: _tableName, id: _, id });
      db.query(query, (error, results) => {
        error
          ? reject(error)
          : resolve(results.length === 0 ? resolve(false) : resolve(results));
      });
    });
  },
  insertEmployee: (_obj) => {
    return new Promise((resolve, reject) => {
      const req = {
        tableName: _tableName,
        columns: {
          name: _obj.name,
          contact: _obj.contact,
          cpf: _obj.cpf,
          pin: _obj.pin,
          password: _obj.password,
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
  updateEmployee: (obj) => {
    return new Promise((resolve, reject) => {
      const req = {
        tableName: _tableName,
        id: obj._id,
        columns: {
          name: obj._name,
          contact: obj._contact,
          cpf: obj._cpf,
        },
      };
      let query = querys.updateById(req);
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },
  updateValueByParam: (obj) => {
    return new Promise((resolve, reject) => {
      const req = {
        tableName: _tableName,
        id: obj._id,
        columns: { key: obj._val },
      };
      let query = querys.updateById(req);
      db.query(query, (error, results) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(results);
      });
    });
  },
  deleteEmployee: (_id) => {
    return new Promise((resolve, reject) => {
      const req = {
        tableName: _tableName,
        id: _id,
      };
      let query = querys.deleteById(req);
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
