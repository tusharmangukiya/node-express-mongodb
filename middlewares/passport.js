const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const { secretKeys } = require('../config');

const USER = require('../models/user');

const localStrategyOpts = { usernameField: 'email', passwordField: 'password'};

const jwtStrategyOpts = { jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(), secretOrKey: secretKeys.jwt };

/**
 * To validate user login
 * @param {*} email User email
 * @param {*} password User password
 * @param {*} done
 */
const loginLocalStrategy = async (email, password, done) => {
  try {
    let user = await USER
      .findOne({ email, isDeleted: false})
      .populate({path:'role', select:'name'});
    if (!user) return done(new Error('Invalid email and password' ));
    if (!await user.isValidPassword(password)) return done(new Error('Invalid email and password' ));

    return done(null, user.deleteFields(['password']), { message: 'Logged in Successfully' });
  }
  catch (error) { return done(error); }
};

/**
 * To authenticate current user's session using JWT verification
 * @param {*} jwtPayload Current user's JWT token
 * @param {*} done
 */
const authenticateJwtStrategy = async (jwtPayload, done) => {
  try {
    let user = await USER
      .findOne({_id: jwtPayload.user._id, isDeleted: false})
      .populate({path:'role', select:'name'});
    if (user) { return done(null, user.deleteFields(['password','activationToken'])); }
    else { return done('Invalid access token'); }
  } catch (error) { done(error); }
};

passport.use('login', new localStrategy(localStrategyOpts, loginLocalStrategy));
passport.use('authentication',new JWTstrategy(jwtStrategyOpts, authenticateJwtStrategy));