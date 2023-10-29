const joi = require("joi");
const logger = require("../logger");

const ValidateBlogCreation = async (req, res, next) => {
  try {
    const schema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      tags: joi.array().items(joi.string()).required(),
      author: joi.string().required(),
      state: joi.string().valid("draft", "published").optional(),
      body: joi.string().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });

    next();
  } catch (error) {
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

const ValidateBlogUpdate = async (req, res, next) => {
  try {
    const schema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      tags: joi.array().items(joi.string()).required(),
      author: joi.string().required(),
      state: joi.string().valid("draft", "completed").optional(),
      body: joi.string().required(),
    });

    await schema.validateAsync(req.body, { abortEarly: true });

    next();
  } catch (error) {
    logger.error(`Error fetching tasks: ${error.message}`);
    return res.status(422).json({
      message: error.message,
      success: false,
    });
  }
};

module.exports = {
  ValidateBlogCreation,
  ValidateBlogUpdate,
};
