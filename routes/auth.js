const authRouter = require("express").Router();
const User = require("../models/user");
const { calculateToken, verifyToken } = require("../helpers/users");

authRouter.post("/checkCredentials", (req, res) => {
  const { email, password } = req.body;
  User.findByEmail(email).then((user) => {
    if (!user) res.status(401).send("Identifiants incorrects");
    else {
      User.verifyPassword(password, user.hashedPassword).then(
        (correctPassword) => {
          if (correctPassword) {
            const token = calculateToken(email, user.id);
            res.json(token);
            res.send();
          } else res.status(401).send("Identifiants incorrects");
        }
      );
    }
  });
});

const getToken = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  } else if (req.query && req.query.token) {
    return req.query.token;
  }
  return null;
};

authRouter.post("/checkToken", (req, res) => {
  const token = getToken(req);
  verifyToken(token, res);
});

module.exports = authRouter;
