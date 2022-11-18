const multer = require('multer');
const path = require('path');

const AppError = require('../utils/AppError');

function uploadFile(req, res, next) {
  const uploadMulter = multer({
    // 限制上傳檔案大小
    limits: {
      fileSize: 2 * 1024 * 1024,
    },

    // fileFilter預設吃這三個函數
    fileFilter: (req, file, cb) => {
      console.log(`${file.originalname}`);

      const ext = path.extname(file.originalname).toLowerCase();
      if (ext !== '.jpg' && ext !== '.png' && ext !== '.jpeg') {
        return cb(
          new AppError(400, 'Wrong format, only accept jpg, jpeg and png')
        );
      }

      // 若無dest屬性, 將buffer放到下一個
      cb(null, true);
    },
  }).any();

  uploadMulter(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      next(new AppError(400, err.message));
    }
    // Everything went fine.
    next();
  });
}

// any: 不用得知field name

module.exports = uploadFile;
