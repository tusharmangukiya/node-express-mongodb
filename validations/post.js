const Joi = require('joi');

const APIError = require('../utils/APIError');
const JoiObjectId = require('../utils/joi-objectid')(Joi);

const POST = require('../models/post');

exports.show = {
  params: Joi.object({
    id : JoiObjectId().required(),
  })
};

exports.create = {
  body: Joi.object({
    title       : Joi.string().required().trim().replace(/\s\s+/g, ' '),
    description : Joi.string().required(),
  })
}

exports.update = {
  params: Joi.object({
    id : JoiObjectId().required(),
  }),
  body: Joi.object({
    title       : Joi.string().optional().trim().replace(/\s\s+/g, ' '),
    description : Joi.string().optional().trim(),
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
    const user = req.user;
    const record = await POST.findOne({_id, isDeleted: false});
    if(!record) throw new APIError({status: 404, message: `No record were found for given id`});    
    if(JSON.stringify(record.user) !== JSON.stringify(user._id) && user.role.name === 'user'){
      throw new APIError({status: 403, message: "You don't have sufficient access permission!"});
    }
    next();
  }
  catch(err) {next( err);}
}