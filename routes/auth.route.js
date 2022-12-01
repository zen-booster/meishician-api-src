const express = require('express');
const handleErrorAsync = require('../utils/handleErrorAsync');
const validate = require('../middlewares/validate');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { User, BookmarkList, Message } = require('../models');
const httpStatus = require('http-status');
const { generateJWT } = require('../services/auth');

const router = express.Router();
passport.use(
  new GoogleStrategy(
    {
      clientID:
        '1026723495111-oeqvvv1tju43uds0fjrhd306ciu8rn8t.apps.googleusercontent.com',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/google/callback',
    },
    async function (accessToken, refreshToken, profile, cb) {
      return cb(err, profile);
    }
  )
);

router.get(
  '/google',
  passport.authenticate('google', {
    scope: ['email', 'profile'],
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  handleErrorAsync(async (req, res) => {
    const profile = req.user;
    const password = Date.now();
    const email = profile.emails[0].value;
    const user = await User.findOne({ email });
    if (user) {
      const token = generateJWT({ id: user._id });
      return res.status(httpStatus.OK).json({
        status: 'success',
        token,
        data: {
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        },
      });
    }
    if (!user) {
      const user = await User.create({
        name: profile.displayName,
        email,
        avatar: profile.photos[0].value,
        password,
      });

      const bookmarkList = await BookmarkList.create({ userId: user._id });
      const token = generateJWT({ id: user._id });

      return res.status(httpStatus.OK).json({
        status: 'success',
        token,
        data: {
          user: {
            name: user.name,
            email: user.email,
            avatar: user.avatar,
          },
        },
      });
    }
  })
);

module.exports = router;
