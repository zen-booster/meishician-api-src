const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { User, BookmarkList, Message } = require('../models');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');
const nodemailer = require('nodemailer');

const signUp = handleErrorAsync(async (req, res, next) => {
  // #swagger.tags = ['Users']
  // 這樣會失效
  const { email } = req.body;
  const existedUser = await User.findOne({ email });
  if (existedUser)
    return next(new AppError(httpStatus.BAD_REQUEST, 'Email already taken'));
  const user = await User.create(req.body);
  const token = generateJWT({ id: user._id });

  const bookmarkList = await BookmarkList.create({ userId: user._id });

  return res.status(httpStatus.CREATED).send({
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

const updatePassword = handleErrorAsync(
  // eslint-disable-next-line no-unused-vars
  async (req, res, next) => {
    const { password } = req.body;

    await User.findByOneAndUpdate({ _id: req.user._id }, { password }).exec();

    return res.status(httpStatus.OK).json({
      status: 'success',
    });
  }
);

const updateProfile = handleErrorAsync(async (req, res) => {
  const userId = req.user._id;
  const updateData = req.body;
  const user = await User.findByIdAndUpdate({ _id: userId }, updateData, {
    new: true,
  });

  return res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      user: {
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    },
  });
});

const getNavbarStatus = handleErrorAsync(async (req, res) => {
  const userId = req.user._id;
  const updateData = req.body;
  const user = await User.findOne({
    _id: userId,
  });
  const unreadMessages = await Message.find({
    recipientuserId: userId,
    isRead: false,
  });

  const messageCount = unreadMessages.length;
  console.log(user);
  return res.status(httpStatus.OK).json({
    status: 'success',
    data: {
      user: {
        avatar: user.avatar,
        messageCount,
      },
    },
  });
});

const sendResetMail = handleErrorAsync(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({
    email,
  });

  if (!user) {
    return next(AppError(httpStatus.NOT_FOUND, 'email not found'));
  }

  const token = generateJWT(
    { email, usage: 'RESET_PASSWORD' },
    (expiresIn = '30m')
  );

  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD,
    },
  });

  const options = {
    //寄件者
    from: process.env.GMAIL,
    to: email,

    //主旨
    subject: 'MEISHIcain 密碼重設信件',
    html: `
    <h2>MEISHIcian密碼重設</h2>
    <p>親愛的用戶您好，請在30分鐘內點選<a href="/">此連結</a>進行密碼重設，請勿回復此信件，謝謝您</p>
    <p>驗證碼為 ${token}</p>
    `,
  };

  //發送信件方法
  try {
    const sendResult = transporter.sendMail(options);
    return res.status(httpStatus.OK).json({
      status: 'success',
    });
  } catch (error) {
    next(new AppError(httpStatus.EXPECTATION_FAILED, '發送失敗'));
  }
});

const resetPassword = handleErrorAsync(
  // eslint-disable-next-line no-unused-vars
  async (req, res, next) => {
    const { password } = req.body;

    let token = req.headers.authorization;

    if (!token || !token.startsWith('Bearer')) {
      return next(new AppError(httpStatus.UNAUTHORIZED, 'token is required'));
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

    const { email, usage } = decodedPayload;

    if (usage !== 'RESET_PASSWORD')
      return next(new AppError(httpStatus.NOT_ACCEPTABLE, 'invalid token'));

    const user = await User.findOneAndUpdate({ email }, { password }).exec();

    if (!user) next(new AppError(httpStatus.NOT_FOUND, 'user not found'));

    const loginToken = generateJWT({ id: user._id });
    return res.status(httpStatus.OK).json({
      status: 'success',
      token: loginToken,
      data: {
        user: {
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      },
    });
  }
);

module.exports = {
  signUp,
  login,
  updatePassword,
  updateProfile,
  getNavbarStatus,
  sendResetMail,
  resetPassword,
};
