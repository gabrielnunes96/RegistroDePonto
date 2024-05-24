require("dotenv").config({ path: "variaveis.env" });

const express = require("express");
const cors = require("cors");
const bodyParser = express.json();

const routes = require("./routes");

const server = express();
server.use(cors());
server.use(bodyParser);
server.use("/api", routes);

server.listen(process.env.PORT, () => {
  console.log(`Server running at: http://localhost:${process.env.PORT}`);
});
