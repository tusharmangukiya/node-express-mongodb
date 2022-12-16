const Joi = require('joi');

const APIError = require('../utils/APIError');
const JoiObjectId = require('../utils/joi-objectid')(Joi);

const COMMENT = require('../models/comment');

exports.all = {
  params: Joi.object({
    id : JoiObjectId().required(),
  })
};

exports.show = {
  params: Joi.object({
    id : JoiObjectId().required(),
  })
};

exports.create = {
  body: Joi.object({
    message    : Joi.string().required().trim(),
    post       : JoiObjectId().required().trim(),
  })
}

exports.update = {
  params: Joi.object({
    id : JoiObjectId().required(),
  }),
  body: Joi.object({
    message    : Joi.string().required().trim(),
  }).required().not({})
}

exports.destroy = {
  params: Joi.object({
    id : JoiObjectId().required(),
  })
};

exports.isExists = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const count = await COMMENT.countDocuments({_id, isDeleted: false});
    if(count === 0) throw new APIError({status: 404, message: `No record were found for given id`});
    next();
  }
  catch(err) {next( err);}
}