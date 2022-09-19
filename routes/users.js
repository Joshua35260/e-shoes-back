const usersRouter = require("express").Router();
const User = require("../models/user");
const { calculateToken, checkAdmin } = require("../helpers/users");

// Créer un utilisateur

usersRouter.post("/", (req, res) => {
  User.create(req.body)
    .then((createdUser) => {
      res.status(201).json(createdUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Impossible de créer l'utilisateur");
    });
});

usersRouter.put("/", checkAdmin, (req, res) => {
  User.update(req.body)
    .then((modifiedUser) => {
      res.status(201).json(modifiedUser);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Impossible de créer l'utilisateur");
    });
});

module.exports = usersRouter;
