const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  location: Joi.string().required(),
  image: Joi.string().required(),
});

module.exports.reviewSchema = Joi.object({
  body: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
});
