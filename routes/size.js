const sizeRouter = require("express").Router();
const connection = require("../config/db-config");

// GET sizesNames utile pour menu déroulant//

sizeRouter.get("/sizes", (req, res) => {
  console.log("size");

  let sqlSize = "SELECT id, size_name FROM size";
  connection.query(sqlSize, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = sizeRouter;
