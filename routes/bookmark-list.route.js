const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');

const { bookmarkListValidation } = require('../validations/');
const { bookmarkListController } = require('../controllers');
const handleErrorAsync = require('../utils/handleErrorAsync');

const router = express.Router();

/**
 * @openapi
 * tags:
 *  - name: 名片管理
 *    description: 名片管理相關功能
 */

/* --------------------
---收藏名片
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/{cardId}:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: 收藏名片
 *     summary: 收藏名片
 *     tags:
 *      - 名片管理
 *     parameters:
 *       - in: path
 *         name: cardId
 *         default: true
 *         schema:
 *           type: string
 *         description: The card ID
 *     responses:
 *       200:
 *         description: 收藏成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: 'success'
 *                  data:
 *                    type: object
 *                    properties:
 *                      userId:
 *                        type: string
 *                      groupId:
 *                        type: string
 *                      cardId:
 *                        type: string
 */
router.post(
  '/:cardId',
  isAuth,
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.addBookmark
);

/* --------------------
---取消收藏名片
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/{cardId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: 取消收藏名片
 *     summary: 取消收藏名片
 *     tags:
 *      - 名片管理
 *     parameters:
 *       - in: path
 *         name: cardId
 *         default: true
 *         schema:
 *           type: string
 *         description: The card ID
 *     responses:
 *       200:
 *         description: 取消成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 */
router.delete(
  '/:cardId',
  isAuth,
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.removeBookmark
);

module.exports = router;
