const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const PostSchema = new Schema({
  title         : { type: String, require: true },
  description   : { type: String, require: true },
  user          : { type: ObjectId, ref:'user', default: null },
  comments      : [{ type: ObjectId, ref:'comment', default: null }],
  isDeleted     : { type: Boolean, default: false },
  deletedBy     : { type: ObjectId, ref:'user', default: null },
  deletedAt     : { type: Date, default: null },
},
{
  timestamps: true,
});

module.exports = mongoose.model('post', PostSchema, 'posts');
