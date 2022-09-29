const Joi = require("joi");

const colorPutSchema = Joi.object({
  color_name: Joi.string().max(10),
});

const validatePutColor = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  console.log("req.body dans validator", req.body);

  const { color_name } = req.body;

  const { error } = colorPutSchema.validate(
    {
      color_name,
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

module.exports = { validatePutColor };
