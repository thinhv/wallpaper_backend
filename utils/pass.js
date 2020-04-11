'use strict';

const passport = require('passport');
const passportJWT = require('passport-jwt');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');

const User = require('../models/User');

const saltRound = 12;

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ username: username });
      if (user === undefined) {
        return done(null, false, { message: 'Wrong credentials' });
      }
      if (!(await bcrypt.compare(password, user.password))) {
        return done(null, false, { message: 'Wrong credentials' });
      }
      return done(null, { ...user }, { message: 'Logged in Successfully' });
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.SECRET,
    },
    async (payload, done) => {
      try {
        const user = await User.findById(payload._id);
        if (user !== null && user !== undefined) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (err) {
        return done(null, false);
      }
    }
  )
);
