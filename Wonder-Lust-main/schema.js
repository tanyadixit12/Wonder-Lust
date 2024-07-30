
const joi = require('joi');

const listingSchema = joi.object({
  listing : joi.object({
    title : joi.string().required(),
    description : joi.string().required(),
    location :  joi.string().required(),
    country :  joi.string().required(),
    price :  joi.number().required().min(0),
    image : joi.object().allow("", null)

  }).required()

});

module.exports = listingSchema;

const reviewSchema = joi.object({
  review : joi.object({
    rating : joi.number().min(1).max(5).required(),
    comment : joi.string().required()
    // body: joi.string().required()
  }).required()

});

module.exports = reviewSchema;