const jwt = require("jsonwebtoken");

const sign = (data) => {
  if (!process.env.JWT_SECRET_KEY) return "JWT_SECRET_KEY NOT FOUND";
  const test = jwt.sign(data, process.env.JWT_SECRET_KEY, { expiresIn: "24h" });
  return test;
};

const verify = (jwtToken) => {
  if (!process.env.JWT_SECRET_KEY) return "JWT_SECRET_KEY NOT FOUND";

  try {
    const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    if (typeof decoded == "string") return "INVALID_TOKEN";
    return decoded;
  } catch (error) {
    return "INVALID_TOKEN";
  }
};

module.exports = {
  sign,
  verify,
};
