const typeRouter = require("express").Router();
const connection = require("../config/db-config");
const { validatePutType } = require("../validators/validatorPutType");
const { validatePostType } = require("../validators/validatorPostType");

// GET //
typeRouter.get("/", (req, res) => {
  let sqltype = "SELECT * FROM type ORDER BY type_name";
  connection.query(sqltype, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

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
//get id//
typeRouter.get("/:id", (req, res) => {
  const { id } = req.params;

  let sql = "SELECT t.id, t.type_name FROM type AS t WHERE t.id=?";
  connection.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error requesting GET type data");
    } else {
      res.status(200).json(result);
    }
  });
});

//put//
typeRouter.put("/edit/:id", validatePutType, (req, res) => {
  // On récupère l'id depuis les paramètres de la requête
  const { id } = req.params;

  const typePropsToUpdate = req.body;

  console.log(typePropsToUpdate);
  connection.query(
    "UPDATE type SET ? WHERE id = ?",
    [typePropsToUpdate, id],

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
typeRouter.post("/add", validatePostType, (req, res) => {
  let type = {
    type_name: req.body.type_name,
  };
  const sqlAdd = "INSERT INTO type SET ?";
  connection.query(sqlAdd, type, (error, result) => {
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
typeRouter.delete("/:id", (req, res) => {
  const typeId = req.params.id;

  connection.query("DELETE FROM type WHERE id = ?", [typeId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("😱 Error deleting a type");
    } else {
      console.log("Delete File successfully.");
    }
    res.sendStatus(204);
  });
});
module.exports = typeRouter;
