const Joi = require("joi");

const typePostSchema = Joi.object({
  type_name: Joi.string().max(45).required(),
});

const validatePostType = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  console.log("req.body dans validator", req.body);

  const { type_name } = req.body;

  const { error } = typePostSchema.validate(
    {
      type_name,
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

module.exports = { validatePostType };
