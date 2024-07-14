const mongoose = require("mongoose");
const connectionString = "mongodb://localhost:27017/WorkLog_Employees";
async function db() {
  try {
    mongoose.connect(connectionString);
    console.log(`Connected to MongoDB: ${connectionString}`);
  } catch (err) {
    console.log(`Error: ${err}`);
  }
}
module.exports = db;
