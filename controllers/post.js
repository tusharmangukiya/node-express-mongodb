const { removeFields } = require('../utils/helper');

const POST = require('../models/post');

/**
 * Get all posts
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.all = async (req, res, next) => {
  try {
    const posts = await POST.find({isDeleted: false}, '-__v -isDeleted -createdAt -updatedAt -deletedAt -deletedBy')
      .populate({path: 'user', select: 'firstName lastName'})
      .populate({path: 'comments', select: 'message', populate: {path: 'user', select: 'firstName lastName'}});
    return res.sendJson(200, posts);
  } catch (error) { next(error); }
}

/**
 * Get post by given id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.show = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const post = await POST.findOne({_id, isDeleted: false})
      .populate({path: 'user', select: 'firstName lastName'})
      .populate({path: 'comments', select: 'message', populate: {path: 'user', select: 'firstName lastName'}});
    return res.sendJson(200, removeFields(post.toObject()));
  } catch (error) { next(error); }
}

/**
 * Create new post
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.store = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.user = req.user._id;
    const post = await POST.create(payload);
    return res.sendJson(200, removeFields(post.toObject(), ['user', 'comments']));
  } catch (error) { next(error); }
}

/**
 * Update post by given id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.update = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const payload = req.body;
    const _query = {_id, isDeleted: false};
    const post = await POST.findOneAndUpdate(_query, {$set: payload}, {new: true});
    return res.sendJson(200, removeFields(post.toObject(), ['user', 'comments']));
  } catch (error) { next(error); }
}

/**
 * Delete post by given id
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.destroy = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const userId = req.user._id;
    const _query = {_id, isDeleted: false};
    const _delete = {$set: {isDeleted: true, deletedAt: new Date(), deletedBy: userId}};
    await POST.findOneAndUpdate(_query, _delete);
    return res.sendJson(200, "Post deleted successfully");
  } catch (error) { next(error); }
}