const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/brand");
  },
  filename: (req, file, callback) => {
    if (file.fieldname === "brand_logo") {
      const uniqueSuffix = "" + Math.round(Math.random() * 1e9);

      callback(
        null,
        file.originalname + "_" + uniqueSuffix + path.extname(file.originalname)
      );
    }
    // console.log(filename)
  },
});
const filefilter = (req, file, callback) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};
const upload = multer({
  storage: storage,
  fileFilter: filefilter,
}).fields([
  {
    name: "brand_logo",
    maxCount: 1,
  },
]);

module.exports = { upload };
