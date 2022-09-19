const express = require("express");
const connection = require("./config/db-config");
require("dotenv").config();
const app = express();
const cors = require("cors");
const morgan = require("morgan");
// fournit des utilitaires pour travailler avec les chemins d'accès aux fichiers et aux répertoires.
const path = require("path");
// Analyser les corps des requêtes entrantes dans un middleware avant manipulations, disponible sous la propriété req.body.
const bodyParser = require("body-parser");

const PORT = process.env.PORT_SERVER || 5002;

// routesRouter --> requière le chemin d'accès
// const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const usersRouter = require("./routes/users");
const shoesRouter = require("./routes/shoes");

// Middleware
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: false }))
// app.use(bodyParser.json())

// utiliser le middleware express.static pour rendre possible l'accès aux fichiers de ce dossier via HTTP
app.use(express.static(path.join(__dirname, "public")));

// Routes
// app.use("/auth", authRouter);
app.use("/shoes", shoesRouter);
app.use("/admin", adminRouter);
app.use("/login", usersRouter);

// connexion au server

connection.connect((err) => {
  if (err) {
    console.error("error connecting: " + err.stack);
  } else {
    console.log(
      "connected to database with threadId :  " + connection.threadId
    );
  }
});
app.listen(PORT, (err) => {
  // eslint-disable-next-line no-console
  if (err) console.error(err);
  // eslint-disable-next-line no-console
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
