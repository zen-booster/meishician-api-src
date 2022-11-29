const express = require('express');
const { isAuth } = require('../services/auth');
const handleErrorAsync = require('../utils/handleErrorAsync');
const validate = require('../middlewares/validate');
const { authValidation } = require('../validations');
const { authController } = require('../controllers');

const router = express.Router();

/**
 * @openapi
 * tags:
 *  - name: 會員驗證
 *    description: 會員驗證
 */

/**

/* --------------------
---token測試
----------------------*/
/**
 * @openapi
 * /api/users/check:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: 權限測試
 *     summary: 權限測試
 *     tags:
 *      - 會員驗證
 *     responses:
 *       200:
 *         description: 認證成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *       400:
 *         description: 認證失敗
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "error"
 */
router.get(
  '/check',
  isAuth(),
  handleErrorAsync(async (req, res) =>
    res.status(200).json({
      status: 'success',
    })
  )
);

/* --------------------
---註冊
----------------------*/
/**
 * @openapi
 * /api/users/sign-up:
 *   post:
 *     description: 會員註冊
 *     summary: 會員註冊
 *     tags:
 *      - 會員驗證
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/signUp'
 *     responses:
 *       201:
 *         description: 註冊成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  token:
 *                    type: string
 *                  data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatar:
 *                           type: string
 */
router.post('/sign-up', validate(authValidation.signUp), authController.signUp);

/* --------------------
---登入
----------------------*/
/**
 * @openapi
 * /api/users/login:
 *   post:
 *     description: 會員登入
 *     summary: 會員登入
 *     tags:
 *      - 會員驗證
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/login'
 *     responses:
 *       200:
 *         description: 登入成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  token:
 *                    type: string
 *                    example: "Bearer ..."
 *                  data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatar:
 *                           type: string
 */
router.post('/login', validate(authValidation.login), authController.login);

/* --------------------
---更新密碼
----------------------*/
/**
 * @openapi
 * /api/users/password:
 *   put:
 *     description: 更新密碼
 *     summary: 更新密碼
 *     tags:
 *      - 會員驗證
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/updatePassword'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 */
router.put(
  '/password',
  isAuth(),
  validate(authValidation.updatePassword),
  authController.updatePassword
);

/* --------------------
---更新個人資料
----------------------*/
/**
 * @openapi
 * /api/users/profile:
 *   patch:
 *     description: 更新個人資料
 *     summary: 更新個人資料
 *     tags:
 *      - 會員驗證
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/updateProfile'
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         avatar:
 *                           type: string
 */
router.patch(
  '/profile',
  isAuth(),
  validate(authValidation.updateProfile),
  authController.updateProfile
);

/**
 * @openapi
 * /api/users/:
 *   get:
 *     description: 取得導覽列狀態
 *     summary: 取得導覽列狀態
 *     tags:
 *      - 會員驗證

 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         avatar:
 *                           type: string
 *                         messageCount:
 *                           type: integer
 */
router.get('/', isAuth(), authController.getNavbarStatus);

module.exports = router;
