const express = require('express');

const { isAuth } = require('../services/auth');

const handleErrorAsync = require('../utils/handleErrorAsync');

const validate = require('../middlewares/validate');

const authValidation = require('../validations/auth.validation');

const { shortUrlController, authController } = require('../controllers');

const router = express.Router();

/* --------------------
---token測試
----------------------*/
router.get(
  '/check',
  isAuth,
  handleErrorAsync(async (req, res) =>
    res.status(200).json({
      status: 'success',
    })
  )
);

/* --------------------
---註冊
----------------------*/
router.post('/sign-up', validate(authValidation.signUp), authController.signUp);

/* --------------------
---登入
----------------------*/
router.post('/login', validate(authValidation.login), authController.login);

/* --------------------
---更新密碼
----------------------*/
// router.patch(
//   '/update-password',
//   isAuth,
//   validate(authValidation.updatePassword),
//   authController.updatePassword
// );

/* --------------------
---重置密碼
----------------------*/
router.put(
  '/password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

/* --------------------
---更新個人資料
----------------------*/
router.patch(
  '/profile',
  isAuth,
  validate(authValidation.updateProfile),
  authController.updateProfile
);

module.exports = router;
