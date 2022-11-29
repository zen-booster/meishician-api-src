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
 *         required: true
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
  isAuth(),
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
 *         required: true
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
  isAuth(),
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
 *         required: true
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
 *         required: true
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
  isAuth(),
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.pinBookmark
);

router.delete(
  '/cards/:cardId/pin',
  isAuth(),
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
 *         required: true
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
  isAuth(),
  validate(bookmarkListValidation.editBookmarkNote),
  bookmarkListController.editBookmarkNote
);

/**
 * @openapi
 * /api/bookmark-list/groups:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: 取得群組列表
 *     summary: 取得群組列表
 *     tags:
 *      - 名片管理
 *     responses:
 *       200:
 *         description: 取得成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      records:
 *                        type: array
 *                        items:
 *                          types: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            isDefaultGroup:
 *                              type: boolean
 *                              example: false
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: 新增群組
 *     summary: 新增群組
 *     tags:
 *      - 名片管理
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/createBookmarkList'
 *     responses:
 *       200:
 *         description: 新增成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      records:
 *                        type: array
 *                        items:
 *                          types: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            isDefaultGroup:
 *                              type: boolean
 *                              example: false
 */

/* --------------------
---取得群組列表
----------------------*/
router.get('/groups', isAuth(), bookmarkListController.getBookmarkList);

/* --------------------
---新增群組
----------------------*/
router.post(
  '/groups',
  isAuth(),
  validate(bookmarkListValidation.createBookmarkList),
  bookmarkListController.createBookmarkList
);

/* --------------------
---刪除群組
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/groups/{followerGroupId}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     description: 刪除群組，若刪除預設群組將不生效
 *     summary: 刪除群組
 *     tags:
 *      - 名片管理
 *     parameters:
 *       - in: path
 *         name: followerGroupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The group ID
 *     responses:
 *       200:
 *         description: 刪除成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      records:
 *                        type: array
 *                        items:
 *                          types: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            isDefaultGroup:
 *                              type: boolean
 *                              example: false
 * /api/bookmark-list/groups/{followerGroupId}/name:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: 群組更名
 *     summary: 群組更名
 *     tags:
 *      - 名片管理
 *     parameters:
 *       - in: path
 *         name: followerGroupId
 *         required: true
 *         schema:
 *           type: string
 *         description: The group ID
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/renameBookmarkList'
 *     responses:
 *       200:
 *         description: 更名成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      records:
 *                        type: array
 *                        items:
 *                          types: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            isDefaultGroup:
 *                              type: boolean
 *                              example: false
 */

router.delete(
  '/groups/:followerGroupId/name',
  isAuth(),
  validate(bookmarkListValidation.deleteBookmarkList),
  bookmarkListController.deleteBookmarkList
);

/* --------------------
---群組更名
----------------------*/
router.patch(
  '/groups/:followerGroupId',
  isAuth(),
  validate(bookmarkListValidation.renameBookmarkList),
  bookmarkListController.renameBookmarkList
);
/* --------------------
---群組變更順序
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/groups/order:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: 群組順序調整
 *     summary: 群組順序調整
 *     tags:
 *      - 名片管理
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/updateBookmarkListOrder'
 *     responses:
 *       200:
 *         description: 調整成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      records:
 *                        type: array
 *                        items:
 *                          types: object
 *                          properties:
 *                            id:
 *                              type: string
 *                            name:
 *                              type: string
 *                            isDefaultGroup:
 *                              type: boolean
 *                              example: false
 */
router.patch(
  '/groups/order',
  isAuth(),
  validate(bookmarkListValidation.updateBookmarkListOrder),
  bookmarkListController.updateBookmarkListOrder
);

/* --------------------
---取得群組內卡片
----------------------*/
/**
 * @openapi
 * /api/bookmark-list/groups/{followerGroupId}/cards:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: 取得群組內卡片列表
 *     summary: 取得群組內卡片列表
 *     tags:
 *      - 名片管理
 *     parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: 第幾頁
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *          description: 一頁幾筆
 *        - in: query
 *          name: asc
 *          schema:
 *            type: integer
 *          description: 排序
 *        - in: path
 *          name: followerGroupId
 *          required: true
 *          schema:
 *            type: string
 *          description: The group ID
 *     responses:
 *       200:
 *         description: 取得成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      records:
 *                        type: array
 *                        items:
 *                          types: object
 *                          properties:
 *                            cardId:
 *                              type: string
 *                            name:
 *                              type: string
 *                            companyName:
 *                              type: string
 *                            jobTitle:
 *                              type: string
 *                            avatar:
 *                              type: string
 */

router.get(
  '/groups/:followerGroupId/cards',
  isAuth(),
  validate(bookmarkListValidation.getBookmarks),
  bookmarkListController.getBookmarks
);

router.get('/tags', isAuth(), bookmarkListController.getTagList);

router.get('/tags/:tag', isAuth(), bookmarkListController.getTagBookmarks);

module.exports = router;
