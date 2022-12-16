const APIError = require('../utils/APIError');
const { removeFields } = require('../utils/helper');

const COMMENT = require('../models/comment');
const POST = require('../models/post');

/**
 * Get all comment for given post id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.all = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const _project = '-__v -isDeleted -createdAt -updatedAt -deletedAt -deletedBy -post';
    const comments = await COMMENT
      .find({post: postId, isDeleted: false}, _project)
      .populate({path: 'user', select: 'firstName lastName'});
    return res.sendJson(200, comments);
  } catch (error) { next(error); }
}

/**
 * Get comment by given id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.show = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const comment = await COMMENT
      .findOne({_id, isDeleted: false})
      .populate({path: 'user', select: 'firstName lastName'});
    return res.sendJson(200, removeFields(comment.toObject()));
  } catch (error) { next(error); }
}

/**
 * Create new comment
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.store = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.user = req.user._id;
    const comment = await COMMENT.create(payload);
    await POST.findByIdAndUpdate({_id: payload.post, isDeleted: false}, {$addToSet: {comments: comment._id}});
    return res.sendJson(200, removeFields(comment.toObject(), 'user'));
  } catch (error) { next(error); }
}

/**
 * Update comment by given id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.update = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const payload = req.body;
    const comment = await COMMENT.findOneAndUpdate({_id, isDeleted: false}, {$set: payload}, {new: true});
    return res.sendJson(200, removeFields(comment.toObject(), 'user'));
  } catch (error) { next(error); }
}

/**
 * Delete comment by given id
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.destroy = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = req.user;
    const _query = {_id, isDeleted: false};
    const comment = await COMMENT.findOne(_query);
    const postUser = await POST.findOne({_id: comment.post}, 'user -_id');
    if(user.role.name !== 'admin' && user._id.toString() !== postUser.user.toString() && user._id.toString() !== comment.user.toString()){
      throw new APIError({status: 403, message: `You don't have sufficient access permission to delete this comment!`});
    }
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.deletedBy = user._id;
    await comment.save();
    return res.sendJson(200, "Comment deleted successfully");
  } catch (error) { next(error); }
}