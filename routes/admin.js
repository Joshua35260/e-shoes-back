const adminRouter = require("express").Router();
const connection = require("../config/db-config");

adminRouter.get("/", (req, res) => {
  //Select tte les tables de la BDD//
  let sqlAdmin =
    'SELECT table_name as names_of_tables FROM information_schema.tables WHERE table_schema = "eshoes";';
  connection.query(sqlAdmin, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = adminRouter;
