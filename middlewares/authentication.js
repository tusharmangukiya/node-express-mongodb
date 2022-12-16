const passport = require('passport');
const APIError = require('../utils/APIError');
const { capitalize } = require('../utils/helper');

/**
 * To authenticate user as well as their roles
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {*} roles Roles can be string or array of string
 */
const handleJWT = (req, res, next, roles) => async (err, user, info) => {
  try {
    if (err || info || !user) {
      const error = err || info.message;
      throw new APIError({status: 401, message: error ? capitalize(error) : 'Unauthorized access'})
    }
    if(roles !== undefined){
      roles = typeof roles === 'string' ? [roles] : roles ;
      if(!roles.includes(user.role.name))
          throw new APIError({status: 403, message: "You don't have sufficient access permission!"});
    }
    req.user = user;
    return next();
  } catch (err) {next(err);}
};

/**
 * Authentication middleware
 * @param {*} roles Roles can be string or array of string
 */
exports.isAuth = (roles) => (req, res, next) => {
  passport.authenticate('authentication', { session: false }, handleJWT(req, res, next, roles))(req, res, next)
};
