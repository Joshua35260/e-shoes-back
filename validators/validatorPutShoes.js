const Joi = require("joi");

const shoesPutSchema = Joi.object({
  shoes_name: Joi.string().max(45),
  shoes_description: Joi.string().max(1000),
  shoes_img: Joi.string().max(255), //.required(),//
  brand_id: Joi.number().integer(),
  size_id: Joi.number().integer(),
  type_id: Joi.number().integer(),
  color_id: Joi.number().integer(),
});

const validatePutShoes = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  console.log(
    "req.body dans validator",
    req.body,
    "req.files dans validator",
    req.files
  );

  const {
    shoes_name,
    shoes_description,
    brand_id,
    size_id,
    type_id,
    color_id,
  } = req.body;

  console.log("req.files dans Joi", req.files);
  let photos = {};
  for (const image in req.files) {
    photos[image] = req.files[image][0].filename;
  }

  const { error } = shoesPutSchema.validate(
    {
      shoes_name,
      shoes_description,
      shoes_img: photos.shoes_img,
      brand_id,
      size_id,
      type_id,
      color_id,
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

module.exports = { validatePutShoes };
