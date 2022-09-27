const express = require("express");
const shoesRouter = express.Router();
const connection = require("../config/db-config");
const fs = require("fs");
const multer = require("multer");
const { upload } = require("../helpers/helpersImg");
const { validatePostShoes } = require("../validators/validatorPostShoes");
const { validatePutShoes } = require("../validators/validatorPutShoes");

// GET //
shoesRouter.get("/", (req, res) => {
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

// GET ID //
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

//POST//

shoesRouter.post("/add", upload, (req, res) => {
  console.log(
    "req.file",
    req.file,
    "req.files",
    req.files,
    "req.body",
    req.body
  );
  let shoes = {
    shoes_name: req.body.shoes_name,
    shoes_description: req.body.shoes_description,
    shoes_img: req.files.shoes_img[0].filename,
    brand_id: req.body.shoes_brand_id,
    size_id: req.body.size_id,
    type_id: req.body.type_id,
    color_id: req.body.color_id,
  };

  const sqlAdd = "INSERT INTO shoes SET ?";
  connection.query(sqlAdd, shoes, (error, results) => {
    console.log("shoes", req.body);
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

// shoesRouter.put(
//   "/edit/:id",
//   upload,
//   validatePutShoes,
//   async function (req, res, next) {
//     const { id } = req.params;
//     const lesUpdates = Object.entries(req.body).concat(
//       Object.entries(req.files)
//     );
//     console.log(lesUpdates);
//     const shoes = {};
//     for (const entry of lesUpdates) {
//       shoes[entry[0]] =
//         typeof entry[1] !== "string" ? entry[1][0].filename : entry[1];
//     }

//     const [[imagePUTOldPath]] = await connection
//       .promise()
//       .query("SELECT shoes_img FROM shoes WHERE id = ? ", [id]);
//     const oldPUTFile = imagePUTOldPath.shoes_img;

//     const sqlPut = "UPDATE shoes SET ? WHERE id = ?";
//     connection.query(sqlPut, [shoes, id], (error, results) => {
//       if (error) {
//         res.status(500).json({
//           status: false,
//           message: "there are some error with query",
//         });
//         console.log(error);
//       } else {
//         if (shoes.shoes_img) {
//           console.log("Saved successfully");
//           fs.unlink("./public/images/shoes/" + oldPUTFile, (err) => {
//             if (err) {
//               throw err;
//             }
//             console.log("Delete File successfully.");
//           });
//         }
//         return res.status(200).json({ success: 1 });
//       }
//     });
//   }
// );

// DELETE - shoes//////////////////////////////////////////

shoesRouter.delete("/:id", async (req, res) => {
  const shoesId = req.params.id;

  const [[imageOldPath]] = await connection
    .promise()
    .query("SELECT shoes_image FROM shoes WHERE id = ? ", [shoesId]);
  const oldFile = imageOldPath.shoes_img;

  connection.query(
    "DELETE FROM shoes WHERE id = ?",
    [shoesId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send("😱 Error deleting an shoes");
      } else {
        fs.unlinkSync("./public/images/shoes/" + oldFile, (err) => {
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

module.exports = shoesRouter;
