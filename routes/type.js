const typeRouter = require("express").Router();
const connection = require("../config/db-config");

// GET typesNames utile pour menu déroulant//

typeRouter.get("/typesNames", (req, res) => {
  console.log("type");

  let sqlType = "SELECT id, type_name FROM type";
  connection.query(sqlType, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = typeRouter;
