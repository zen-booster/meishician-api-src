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
 * /api/bookmark-list/cards/{cardId}:
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
 *                      followerUserId:
 *                        type: string
 *                      followerGroupId:
 *                        type: string
 *                      followedCardId:
 *                        type: string
 */
router.post(
  '/cards/:cardId',
  isAuth,
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.addBookmark
);

/* --------------------
---取消收藏名片
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/cards/{cardId}:
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
  '/cards/:cardId',
  isAuth,
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.removeBookmark
);

/* --------------------
---置頂名片
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/cards/{cardId}/pin:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: 置頂名片
 *     summary: 置頂名片
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
 *         description: 置頂成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: 取消置頂名片
 *     summary: 取消置頂名片
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
 *         description: 取消置頂成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 */

router.post(
  '/cards/:cardId/pin',
  isAuth,
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.pinBookmark
);

router.delete(
  '/cards/:cardId/pin',
  isAuth,
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.unpinBookmark
);

/* --------------------
---更新名片註記
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/cards/{cardId}/notes:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: 編輯名片書籤資訊，如標籤、群組、註記
 *     summary: 編輯名片書籤資訊
 *     tags:
 *      - 名片管理
 *     parameters:
 *       - in: path
 *         name: cardId
 *         default: true
 *         schema:
 *           type: string
 *         description: The card ID
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/editBookmarkNote'
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
router.patch(
  '/cards/:cardId/notes',
  isAuth,
  validate(bookmarkListValidation.editBookmarkNote),
  bookmarkListController.editBookmarkNote
);

module.exports = router;
