const mongoose = require('mongoose');
const APIError = require('../utils/APIError');

const POST = require('../models/post');

const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const CommentSchema = new Schema({
  message       : { type: String, require: true },
  user          : { type: ObjectId, ref:'user', default: null },
  post          : { type: ObjectId, ref:'post', default: null },
  isDeleted     : { type: Boolean, default: false },
  deletedBy     : { type: ObjectId, ref:'user', default: null },
  deletedAt     : { type: Date, default: null },
},
{
  timestamps: true,
});

/**
**  Check post id is valid or not
*/
CommentSchema.pre(/^(save|findOneAndUpdate)$/, true, async function (next, done) {
  const self = this;
  const _query = { isDeleted: false };
  if(self.op && self.op === 'findOneAndUpdate') {
    _query._id = self._update['$set'].post;
  }
  else {
    _query._id = self.post;
  }
  if(!_query._id){ done(); next(); }

  POST.countDocuments(_query)
      .then((count) => count == 0 ? done(new APIError({status:422, message: 'Invaild post. Please provide a valid post'})) : done())
      .catch((err) => done(err));
  next();
});

module.exports = mongoose.model('comment', CommentSchema, 'comments');
