const httpStatus = require('http-status');
const bcrypt = require('bcrypt');

const { User } = require('../models');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');

const signUp = handleErrorAsync(async (req, res, next) => {
  const { email } = req.body;
  const existedUser = await User.findOne({ email });
  if (existedUser)
    return next(new AppError(httpStatus.BAD_REQUEST, 'Email already taken'));
  const newUser = await User.create(req.body);
  const token = generateJWT({ id: newUser._id });
  return res.status(httpStatus.CREATED).send({
    status: 'success',
    token,
    data: {
      user: {
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
      },
    },
  });
});

const login = handleErrorAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.isPasswordMatch(password))) {
    return next(
      new AppError(httpStatus.UNAUTHORIZED, 'Incorrect email or password')
    );
  }

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
});

const resetPassword = handleErrorAsync(async (req, res, next) => {
  const { email, password, safetyQuestion, safetyAnswer } = req.body;

  const user = await User.findOne({ email }).select(
    '+safetyAnswer +safetyQuestion'
  );

  if (!user) return next(new AppError(httpStatus.NOT_FOUND, 'User not found'));

  const isSafetyAnswerMatch = await bcrypt.compare(
    safetyAnswer,
    user.safetyAnswer
  );
  if (user.safetyQuestion !== safetyQuestion || !isSafetyAnswerMatch) {
    return next(new AppError(httpStatus.BAD_REQUEST, 'Incorrect safety QA'));
  }

  await User.findOneAndUpdate({ email }, { password }).exec();

  return res.status(httpStatus.OK).json({
    status: 'success',
  });
});

const updateProfile = handleErrorAsync(async (req, res) => {
  const { name, avatar } = req.body;
  const userID = req.user._id;

  const newUserProfile = await User.findByIdAndUpdate(
    { _id: userID },
    { name },
    { new: true }
  );

  return res.status(httpStatus.OK).json({
    status: 'success',
    name: newUserProfile.name,
    email: newUserProfile.email,
  });
});

module.exports = {
  signUp,
  login,
  resetPassword,
  updateProfile,
};
