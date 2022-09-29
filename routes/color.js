const colorRouter = require("express").Router();
const connection = require("../config/db-config");
const { validatePutColor } = require("../validators/validatorPutColor");
const { validatePostColor } = require("../validators/validatorPostColor");

// GET //
colorRouter.get("/", (req, res) => {
  let sqlcolor = "SELECT * FROM color ORDER BY color_name";
  connection.query(sqlcolor, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

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
colorRouter.put("/edit/:id", validatePutColor, (req, res) => {
  // On récupère l'id depuis les paramètres de la requête
  const { id } = req.params;

  const colorPropsToUpdate = req.body;

  console.log(colorPropsToUpdate);
  connection.query(
    "UPDATE color SET ? WHERE id = ?",
    [colorPropsToUpdate, id],

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
colorRouter.post("/add", validatePostColor, (req, res) => {
  let color = {
    color_name: req.body.color_name,
  };
  const sqlAdd = "INSERT INTO color SET ?";
  connection.query(sqlAdd, color, (error, result) => {
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
    "DELETE FROM color WHERE id = ?",
    [colorId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting a color");
      } else {
        console.log("Delete File successfully.");
      }
      res.sendStatus(204);
    }
  );
});

module.exports = colorRouter;
