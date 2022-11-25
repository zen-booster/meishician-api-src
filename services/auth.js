const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');

const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');
const { User } = require('../models');

const isAuth = (isBypass = false) =>
  handleErrorAsync(async (req, res, next) => {
    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer')) {
      return next(
        !isBypass && new AppError(httpStatus.UNAUTHORIZED, '尚未登入')
      );
    }

    [, token] = token.split(' ');

    const decodedPayload = await new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        if (err) {
          reject(err);
        } else {
          resolve(payload);
        }
      });
    });
    // 尋找是否有此id
    const currentUser = await User.findById(decodedPayload.id);

    if (currentUser === null) {
      return next(
        !isBypass && new AppError(httpStatus.NOT_FOUND, '找不到此用戶')
      );
    }
    req.user = currentUser;
    return next();
  });

const generateJWT = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE_TIME,
  });
  return token;
};

module.exports = { isAuth, generateJWT };
