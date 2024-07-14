require("dotenv").config({ path: "variaveis.env" });

const express = require("express");
const app = express();
const bodyParser = express.json();

//database
const conn = require("./database");
conn();

//cors
const cors = require("cors");
app.use(cors());

//body parser
app.use(bodyParser);

// routes
const routes = require("./routes");
app.use("/api", routes);

//listener after starting
app.listen(process.env.PORT, () => {
  console.log(`app running at: http://localhost:${process.env.PORT}`);
});
