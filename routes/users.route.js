const express = require('express');
const { isAuth } = require('../services/auth');
const handleErrorAsync = require('../utils/handleErrorAsync');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');
const { authController } = require('../controllers');

const router = express.Router();



/* --------------------
---token測試
----------------------*/

router.get(
  '/check',
  isAuth(),
  handleErrorAsync(async (req, res) =>
    res.status(200).json({
      status: 'success',
    })
  )
);

router.get('/', isAuth(), authController.getNavbarStatus);

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
router.put(
  '/password',
  isAuth(),
  validate(authValidation.updatePassword),
  authController.updatePassword
);

/* --------------------
---更新個人資料
----------------------*/
router.patch(
  '/profile',
  isAuth(),
  validate(authValidation.updateProfile),
  authController.updateProfile
);

router.post(
  '/send-reset-mail',
  validate(authValidation.sendResetMail),
  authController.sendResetMail
);

router.post(
  '/send-reset-mail',
  validate(authValidation.sendResetMail),
  authController.sendResetMail
);

router.put(
  '/reset-password',
  validate(authValidation.resetPassword),
  authController.resetPassword
);

module.exports = router;
