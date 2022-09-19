const jwt = require("jsonwebtoken");

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const calculateToken = (userEmail = "", user_id = "") => {
  const pass = jwt.sign({ email: userEmail, userId: user_id }, PRIVATE_KEY);
  return pass;
};

const decodeToken = (token) => {
  const decoded = jwt.decode(token);
  return decoded;
};

const checkAdmin = (req, res, next) => {
  jwt.verify(req.body.token, PRIVATE_KEY, (err, decode) => {
    if (err) res.status(403).send("NOT_ADMIN");
    else next();
  });
};

const verifyToken = (token, res) => {
  jwt.verify(token, PRIVATE_KEY, (err, decode) => {
    if (err) res.status(403).send({ access: false });
    else res.status(200).send({ access: true });
  });
};

module.exports = { calculateToken, decodeToken, verifyToken, checkAdmin };
