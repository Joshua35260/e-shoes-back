const brandRouter = require("express").Router();
const connection = require("../config/db-config");
const { upload } = require("../helpers/brandImg");
const { validatePutBrand } = require("../validators/validatorPutBrand");
const { validatePostBrand } = require("../validators/validatorPostBrand");
const fs = require("fs");

// GET //
brandRouter.get("/", (req, res) => {
  let sqlbrand = "SELECT * FROM brand ORDER BY brand_name";
  connection.query(sqlbrand, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

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

//GET -COUNT-BRAND//
brandRouter.get("/count", (req, res) => {
  let sqlBRAND = "SELECT COUNT(*) FROM BRAND";
  connection.query(sqlBRAND, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

//get id//
brandRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  let sqlBRAND = "SELECT * FROM BRAND WHERE id = ?";
  connection.query(sqlBRAND, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

//POST//
brandRouter.post("/add", upload, validatePostBrand, (req, res) => {
  let brand = {
    brand_name: req.body.brand_name,
    brand_logo: req.files.brand_logo[0].filename,
  };
  console.log("brand", brand);

  const sqlAdd = "INSERT INTO BRAND (brand_name, brand_logo) VALUES (?, ?)";
  connection.query(
    sqlAdd,
    [brand.brand_name, brand.brand_logo],
    (error, result) => {
      if (error) {
        res.status(500).json({
          status: false,
          message: "there are some error with query",
        });
        console.log(error);
      } else {
        res.status(200).json({ success: 1 });
      }
    }
  );
});

brandRouter.put(
  "/edit/:id",
  upload,
  validatePutBrand,
  async function (req, res) {
    const { id } = req.params;
    const lesUpdates = Object.entries(req.body).concat(
      Object.entries(req.files)
    );
    console.log(lesUpdates);
    const brand = {};
    for (const entry of lesUpdates) {
      brand[entry[0]] =
        typeof entry[1] !== "string" ? entry[1][0].filename : entry[1];
    }

    const [[imagePUTOldPath]] = await connection
      .promise()
      .query("SELECT brand_logo FROM brand WHERE id = ? ", [id]);
    const oldPUTFile = imagePUTOldPath.brand_img;

    const sqlPut = "UPDATE brand SET ? WHERE id = ?";
    connection.query(sqlPut, [brand, id], (error, result) => {
      if (error) {
        res.status(500).json({
          status: false,
          message: "there are some error with query",
        });
        console.log(error);
      } else {
        if (brand.brand_logo) {
          console.log("Saved successfully");
          fs.unlink("./public/images/brand/" + oldPUTFile, (err) => {
            if (err) {
              throw err;
            }
            console.log("Delete File successfully.");
          });
        }
        return res.status(200).json({ success: 1 });
      }
    });
  }
);

brandRouter.delete("/:id", async (req, res) => {
  const brandId = req.params.id;

  const [[imageOldPath]] = await connection
    .promise()
    .query("SELECT brand_logo FROM brand WHERE id = ? ", [brandId]);
  const oldFile = imageOldPath.brand_logo;

  connection.query(
    "DELETE FROM brand WHERE id = ?",
    [brandId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting a brand");
      } else {
        fs.unlinkSync("./public/images/brand/" + oldFile, (err) => {
          if (err) {
            throw err;
          }
          console.log("Delete File successfully.");
        });
        res.sendStatus(204);
      }
    }
  );
});

module.exports = brandRouter;
