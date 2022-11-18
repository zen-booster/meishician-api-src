const express = require('express');
const { ImgurClient } = require('imgur');
// const sizeOf = require('image-size');

const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');
const upload = require('../middlewares/image-multer');
const { isAuth } = require('../services/auth');

const router = express.Router();

router.post(
  '/image',
  isAuth,
  upload,
  handleErrorAsync(async (req, res, next, err) => {
    if (!req.files.length) {
      return next(new AppError('No file detected', 400));
    }

    // const dimensions = sizeOf(req.files[0].buffer);
    // if (dimensions.width !== dimensions.height) {
    //   return next(new AppError('不符合長寬1:1尺寸', 400));
    // }
    const client = new ImgurClient({
      clientId: process.env.IMGUR_CLIENTID,
      clientSecret: process.env.IMGUR_CLIENT_SECRET,
      refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    });
    const response = await client.upload({
      image: req.files[0].buffer.toString('base64'),
      type: 'base64',
      album: process.env.IMGUR_ALBUM_ID,
    });
    return res.status(200).json({
      status: 'success',
      imgUrl: response.data.link,
    });
  })
);

module.exports = router;
