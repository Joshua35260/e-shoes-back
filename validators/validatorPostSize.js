const Joi = require("joi");

const sizePostSchema = Joi.object({
  size_name: Joi.string().max(45).required(),
});

const validatePostSize = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  console.log("req.body dans validator", req.body);

  const { size_name } = req.body;

  const { error } = sizePostSchema.validate(
    {
      size_name,
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

module.exports = { validatePostSize };
