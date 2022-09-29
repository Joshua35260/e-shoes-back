const Joi = require("joi");

const typePutSchema = Joi.object({
  type_name: Joi.string().max(45),
});

const validatePutType = (req, res, next) => {
  // validate req.body then call next() if everything is ok
  console.log("req.body dans validator", req.body);

  const { type_name } = req.body;

  const { error } = typePutSchema.validate(
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

module.exports = { validatePutType };
