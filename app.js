const express = require('express');
const cors = require('cors');
// const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

const swaggerDocs = require('./utils/swagger');

const uploadRouter = require('./routes/upload.route');
const userRouter = require('./routes/users.route');
const portfolioRouter = require('./routes/portfolio.route');
const bookmarkListRouter = require('./routes/bookmark-list.route');
const homepageRouter = require('./routes/homepage.route');
const messageRouter = require('./routes/messages.route');
const cardWallRouter = require('./routes/card-wall.route');
const authRouter = require('./routes/auth.route');
// const authRouter = require('./routes/auth.route');

require('./connections/mongodb');
require('./connections/passport');

const app = express();

app.use(logger('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
// app.set('view engine', 'ejs');

app.use(cors());

app.use('/api/users', userRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/portfolio', portfolioRouter);
app.use('/api/bookmark-list', bookmarkListRouter);
app.use('/api/homepage', homepageRouter);
app.use('/api/messages', messageRouter);
app.use('/api/card-wall', cardWallRouter);
app.use('/auth', authRouter);
swaggerDocs(app);

// 上線版本錯誤訊息
const resErrorProd = (err, res) => {
  // 先看是否為自定錯誤訊息(預期內)
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      data: null,
    });
    // 若非先導入罐頭訊息
  } else {
    console.log('未預期錯誤 請查明', err);
    res.status(500).json({
      status: 'error',
      message: '系統發生錯誤',
      data: null,
    });
  }
};

// 開發版本錯誤訊息
const resErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: 'error',
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

// 404 錯誤
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    message: '無此路由資訊',
  });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  function checkStatusCode(statusCode) {
    const parsedStatusCode = parseInt(statusCode, 10);
    return parsedStatusCode >= 100 && parsedStatusCode <= 599
      ? parsedStatusCode
      : 500;
  }
  // eslint-disable-next-line no-param-reassign
  err.statusCode = checkStatusCode(err.statusCode);

  // 先檢查目前屬於dev or prod版本

  if (process.env.NODE_ENV === 'dev') {
    return resErrorDev(err, res);
  }

  return resErrorProd(err, res);
});

// 未捕捉到catch掉進這裡
process.on('unhandledRejection', (err, promise) => {
  console.error('未捕捉到的 rejection: ', promise, '原因: ', err);
});

module.exports = app;
