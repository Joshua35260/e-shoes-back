const brandRouter = require("express").Router();
const connection = require("../config/db-config");

// GET brandsnames utile pour menu déroulant//

brandRouter.get("/brandsNames", (req, res) => {
  console.log("brand");

  let sqlBrand = "SELECT id, brand_name FROM brand";
  connection.query(sqlBrand, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

module.exports = brandRouter;
