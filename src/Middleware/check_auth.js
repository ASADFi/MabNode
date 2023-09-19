const jwt = require("jsonwebtoken");
const { error } = require("../Response/API-Response.js");

module.exports = (req, res, next) => {
  console.log("check-auth");
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (err) {
    return res.status(401).json(error( "Auth failed", ""));
  }
};
