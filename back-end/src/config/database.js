const mssql = require("mssql");

const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  options: {
    trustedconnection: true,
    trustServerCertificate: true
  },
};

const connection = mssql.connect(config, (err) => {
  if (err) {
    console.error("SQL Server Connection Error:", err);
  }
});

module.exports = connection;
