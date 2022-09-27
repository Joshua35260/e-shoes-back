const Joi = require("joi");

const shoesPostSchema = Joi.object({
  shoes_name: Joi.string().max(255).required(),
  shoes_description: Joi.string().max(255).required(),
  filename: Joi.string().max(255), //.required(),//
  brand_id: Joi.number().integer().required(),
  size_id: Joi.number().integer().required(),
  color: Joi.string().required(),
});

const validatePostShoes = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  console.log(
    "req.body dans validator",
    req.body,
    "req.files dans validator",
    req.files
  );

  const { shoes_name, shoes_description, brand_id, size_id, color } = req.body;

  const filename = req.files.location_image[0].filename;

  const { error } = shoesPostSchema.validate(
    {
      shoes_name,
      shoes_description,
      filename,
      brand_id,
      size_id,
      color,
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

module.exports = { validatePostShoes };
