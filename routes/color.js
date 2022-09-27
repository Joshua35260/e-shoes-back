const colorRouter = require("express").Router();
const connection = require("../config/db-config");

// GET colorsnames utile pour menu déroulant//

colorRouter.get("/colorsNames", (req, res) => {
  console.log("ok");
  // res.send("Ici ce sont les régions de la champagne !")
  let sqlColor = "SELECT id, color_name FROM color";
  connection.query(sqlColor, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = colorRouter;
