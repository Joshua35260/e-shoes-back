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
sizeRouter.put("/edit/:id", (req, res) => {
  // On récupère l'id depuis les paramètres de la requête
  const { id } = req.params;

  const sizePropsToUpdate = req.body;

  console.log(sizePropsToUpdate);
  connection.query(
    "UPDATE size SET ? WHERE id = ?",
    [sizePropsToUpdate, id],

    (err, res) => {
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
sizeRouter.post("/add", (req, res) => {
  const sqlAdd = "INSERT INTO size (size_name) VALUES (?)";
  connection.query(sqlAdd, [size.size_name], (error, res) => {
    if (error) {
      res.status(500).json({
        status: false,
        message: "there are some error with query",
      });
      console.log(error);
    } else {
      res.status(200).json({ success: 1 });
    }
  });
});

//DELETE//
sizeRouter.delete("/:id", (req, res) => {
  const sizeId = req.params.id;

  connection.query("DELETE FROM size WHERE id = ?", [sizeId], (err, res) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting an cepage");
    } else {
      res.status(200).json({ success: 1 });
    }
    res.sendStatus(204);
  });
});

module.exports = sizeRouter;
