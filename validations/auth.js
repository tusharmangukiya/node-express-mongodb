const Joi = require('joi');

exports.signup = {
  body: Joi.object({
    firstName : Joi.string().required().max(30).trim(),
    lastName  : Joi.string().required().max(30).trim(),
    email     : Joi.string().required().email().trim().lowercase(),
    password  : Joi.string().required().min(8).max(32).trim(),
  })
}

exports.login = {
  body: Joi.object({
    email     : Joi.string().email().required().trim().lowercase(),
    password  : Joi.string().required().max(128).trim(),
  })
}
