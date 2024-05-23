const mssql = require('mssql');

const config = {
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  auth: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
  },
};

const connection = new mssql.Connection(config);

connection.on('error', (error) => {
  console.error('SQL Server Connection Error:', error);
});
q
module.exports = connection;
