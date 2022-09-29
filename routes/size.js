const sizeRouter = require("express").Router();
const connection = require("../config/db-config");
const { validatePutSize } = require("../validators/validatorPutSize");
const { validatePostSize } = require("../validators/validatorPostSize");
// GET //
sizeRouter.get("/", (req, res) => {
  let sqlsize = "SELECT * FROM size ORDER BY size_name";
  connection.query(sqlsize, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

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

//get id//
sizeRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  let sql = "SELECT s.id, s.size_name FROM size AS s WHERE s.id=?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error requesting GET color data");
    } else {
      res.status(200).json(result);
    }
  });
});

//put//
sizeRouter.put("/edit/:id", validatePutSize, (req, res) => {
  // On récupère l'id depuis les paramètres de la requête
  const { id } = req.params;

  const sizePropsToUpdate = req.body;

  console.log(sizePropsToUpdate);
  connection.query(
    "UPDATE size SET ? WHERE id = ?",
    [sizePropsToUpdate, id],

    (err, result) => {
      if (err) {
        res.json({
          status: false,
          message: "there are some error with query",
        });
        console.log(err);
      } else {
        console.log("Saved successfully");
        res.json({ success: 1 });
      }
    }
  );
});

//ADD//
sizeRouter.post("/add", validatePostSize, (req, res) => {
  let size = {
    size_name: req.body.size_name,
  };
  console.log("size", size);
  const sqlAdd = "INSERT INTO size SET ?";
  connection.query(sqlAdd, size, (error, result) => {
    if (error) {
      res.status(500).json({
        status: false,
        message: "there are some error with query",
      });
      console.log(error);
    } else {
      console.log("Saved successfully");
      res.status(200).json({ success: 1 });
    }
  });
});

//DELETE//
sizeRouter.delete("/:id", (req, res) => {
  const sizeId = req.params.id;

  connection.query("DELETE FROM size WHERE id = ?", [sizeId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting a size");
    } else {
      console.log("Delete File successfully.");

      res.sendStatus(204);
    }
  });
});

module.exports = sizeRouter;
