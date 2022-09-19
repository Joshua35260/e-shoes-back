const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./public/images/shoes");
  },
  filename: (req, file, callback) => {
    const uniqueSuffix = "" + Math.round(Math.random() * 1e9);

    if (file.fieldname === "shoes_img") {
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
    name: "shoes_img",
    maxCount: 1,
  },
]);

module.exports = { upload };
