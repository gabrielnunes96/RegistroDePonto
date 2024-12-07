const token = require("../utils/token");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const tokenFromHeader = authHeader && authHeader.split(" ")[1];

  if (!tokenFromHeader) {
    return res
      .status(401)
      .json({ msg: "Token não fornecido", result: "Unauthorized" });
  }

  const decoded = token.verify(tokenFromHeader);

  if (decoded === "INVALID_TOKEN") {
    return res
      .status(401)
      .json({ msg: "Token inválido", result: "Unauthorized" });
  }

  req.user = decoded;
  next();
};

module.exports = authenticate;
