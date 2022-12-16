const passport = require('passport');

const APIError = require('../utils/APIError');
const { toObject, generateJwt, removeFields } = require('../utils/helper');

const USER = require('../models/user');
const ROLE = require('../models/role');

/**
 * User signup
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.signup = async (req, res, next) => {
  try{
    const payload = req.body;
    const role = await ROLE.findOne({name: new RegExp('user', 'i')}, '_id');
    if(!role) throw new APIError({message: 'It seems that the system role are not generated yet.'});
    payload.role = role._id;
    let user = await USER.create(payload);
    const body = { _id: user._id, firstName: user.firstName, email: user.email};
    const token = generateJwt({ user: body });
    user = toObject(user);
    user.token = "Bearer "+token;
    return res.sendJson(200, { data: removeFields(user, ['password', 'role']), message: "Signup done successfully." });
  }
  catch(err) { next(err) }
};

/**
 * User login
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
exports.login = async (req, res, next) => {
  passport.authenticate('login', async (err, user, info) => {
    try {
      if (err || !user) throw new APIError({status: 401, message: err ? err.message : 'Unauthorized access'});

      req.login(user, { session: false }, async (err) => {
        if (err) throw new APIError();
        const body = { _id: user._id, firstName: user.firstName, email: user.email};
        const token = generateJwt({ user: body });
        user = toObject(user);
        user.token = "Bearer "+token;
        return res.sendJson(200, { data: user, message: info.message });
      });

    }
    catch (err) { next(err); }

  })(req, res, next);
};