const Joi = require("joi");

const brandPutSchema = Joi.object({
  brand_name: Joi.string().max(45),
  filename: Joi.string().max(255),
});

const validatePutBrand = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  console.log(
    "req.body dans validator",
    req.body,
    "req.files dans validator",
    req.files
  );

  const { brand_name } = req.body;

  let filename;
  Object.keys(req.files).length &&
    (filename = req.files.brand_logo[0].filename);

  const { error } = brandPutSchema.validate(
    {
      brand_name,
      filename,
    },
    { abortEarly: false }
  );

  if (error) {
    console.log({ message: "depuis le Joi", validationErrors: error.details });
    res
      .status(255)
      .json({ message: "depuis le Joi", validationErrors: error.details });
  } else {
    next();
  }
};

module.exports = { validatePutBrand };
