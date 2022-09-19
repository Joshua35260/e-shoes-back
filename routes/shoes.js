const express = require("express");
const shoesRouter = express.Router();
const connection = require("../config/db-config");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const { uploads } = require("../helpers/helpersMultiFiles");
const { validatePostShoes } = require("../validators/validatorPostShoes");
const { validatePut } = require("../validators/validatorPutShoes");

// GET //
shoesRouter.get("/", (req, res) => {
  // res.send("Ici ce sont les régions de la champagne !")
  let sqlshoes = "SELECT * FROM shoes ORDER BY shoes_name";
  connection.query(sqlshoes, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

// GET -COUNT-shoes //
shoesRouter.get("/count", (req, res) => {
  let sqlshoes = "SELECT COUNT(*) FROM shoes";
  connection.query(sqlshoes, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

// GET //
shoesRouter.get("/:id", (req, res) => {
  const { id } = req.params;
  let sqlshoes = "SELECT * FROM shoes WHERE id = ?";
  connection.query(sqlshoes, [id], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.status(200).json(result);
    }
  });
});

// POST //
shoesRouter.post("/add", uploads, validatePostRegion, (req, res) => {
  let shoes = {
    shoes_name: req.body.shoes_name,
    shoes_description: req.body.shoes_name,
    shoes_img: req.files.shoes_img[0].filename,
  };

  console.log("req.body de la route shoes/add", req.body);
  const sqlAdd = "INSERT INTO shoes SET ?";
  connection.query(sqlAdd, shoes, (error, results) => {
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

// PUT - shoes///////////////avec retour sur les modifications réalisées en console.log///////////////////////////

shoesRouter.put(
  "/edit/:id",
  uploads,
  validatePutRegion,
  async function (req, res, next) {
    const { id } = req.params;

    // console.log('req.body', req.body)
    // console.log('req.files', req.files)
    const lesUpdates = Object.entries(req.body).concat(
      Object.entries(req.files)
    );
    // console.log('lesUpdates', lesUpdates)
    const shoes = {};

    for (const entry of lesUpdates) {
      shoes[entry[0]] =
        typeof entry[1] !== "string" ? entry[1][0].filename : entry[1];
    }

    const oldImages = Object.keys(req.files).join();
    // console.log('oldImages', oldImages)
    let shoesOldImages;
    if (oldImages.length) {
      [[shoesOldImages]] = await connection
        .promise()
        .query(`SELECT ${oldImages} FROM shoes WHERE id = ${id}`);
    }

    // console.log('shoesOldImages', shoesOldImages)
    // console.log('shoes', shoes)

    const sqlPut = "UPDATE shoes SET ? WHERE id = ?";

    if (lesUpdates.length) {
      connection.query(sqlPut, [shoes, id], (error, results) => {
        if (error) {
          res.status(500).json({
            status: false,
            message: "there are some error with query",
            success: 0,
          });
          console.log(error);
        } else {
          for (const property in shoesOldImages) {
            console.log("shoesOldImages[property]", shoesOldImages[property]);
            fs.unlink(
              "./public/images/shoes/" + shoesOldImages[property],
              (err) => {
                if (err) {
                  throw err;
                }
              }
            );
          }
          console.log("Delete File(s) successfully.");
          console.log("Saved successfully");
          return res.status(200).json({ success: 1 });
        }
      });
    } else {
      return res.status(200).json({ success: 1 });
    }
  }
);

// DELETE - shoes//////////////////////////////////////////

shoesRouter.delete("/:id", async (req, res) => {
  const shoesId = req.params.id;

  const [[shoesOldImages]] = await connection
    .promise()
    .query(
      `SELECT region_photo, region_image_mobile, region_image_pin FROM shoes WHERE id = ${regionId}`
    );

  connection.query(
    "DELETE FROM shoes WHERE id = ?",
    [regionId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting an region");
      } else {
        for (const property in shoesOldImages) {
          console.log("shoesOldImages[property]", shoesOldImages[property]);
          fs.unlink(
            "./public/images/shoes/" + shoesOldImages[property],
            (err) => {
              if (err) {
                throw err;
              }
              console.log("Delete File successfully.");
            }
          );
        }
        res.sendStatus(204);
      }
    }
  );
});

module.exports = shoesRouter;
