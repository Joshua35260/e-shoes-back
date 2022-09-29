const colorRouter = require("express").Router();
const connection = require("../config/db-config");

// GET colorsnames utile pour menu déroulant//

colorRouter.get("/colorsNames", (req, res) => {
  console.log("ok");

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

//get id//
colorRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  let sql = "SELECT c.id, c.color_name FROM color AS c WHERE c.id=?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error requesting GET content data");
    } else {
      res.status(200).json(result);
    }
  });
});

//put//
colorRouter.put("/edit/:id", (req, res) => {
  // On récupère l'id depuis les paramètres de la requête
  const { id } = req.params;

  const colorPropsToUpdate = req.body;

  console.log(colorPropsToUpdate);
  connection.query(
    "UPDATE color SET ? WHERE id = ?",
    [colorPropsToUpdate, id],

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
colorRouter.post("/add", (req, res) => {
  const sqlAdd = "INSERT INTO color (color_name) VALUES (?)";
  connection.query(sqlAdd, [color.color_name], (error, res) => {
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
colorRouter.delete("/:id", (req, res) => {
  const colorId = req.params.id;

  connection.query(
    "DELETE FROM cepages WHERE id = ?",
    [cepageId],
    (err, res) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting an cepage");
      } else {
        res.status(200).json({ success: 1 });
      }
      res.sendStatus(204);
    }
  );
});

module.exports = colorRouter;
