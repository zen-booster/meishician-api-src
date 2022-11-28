const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');
const { homepageValidation } = require('../validations/');

const { homepageController } = require('../controllers');

const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');

/**
 * @openapi
 * tags:
 *  - name: 名片資訊頁面
 *    description: 名片資訊頁面相關功能
 */

/* --------------------
---獲取名片資訊頁面
----------------------*/
/**
 * @openapi
 * /api/homepage/{cardId}:
 *   get:
 *     description: 獲取名片頁面資訊
 *     summary: 獲取名片頁面資訊
 *     tags:
 *      - 名片資訊頁面
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The card ID
 *     responses:
 *       200:
 *         description: 獲取成功
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
 *                      jobInfo:
 *                        type: object
 *                      cardId:
 *                        type: string
 *                      layoutDirection:
 *                        type: string
 *                      homepageLink:
 *                        type: array
 *                        items:
 *                          type: object
 *                      isAuthor:
 *                        type: boolean
 */
router.get(
  '/:cardId',
  isAuth(true),
  validate(homepageValidation.getHomepageInfo),
  homepageController.getHomepageInfo
);

router.get(
  '/:cardId/canvas',
  isAuth(),
  // validate(homepageValidation.renameHomepageTitle),
  homepageController.getHomepageInfo
);

/* --------------------
---更改名片資訊標題
----------------------*/
/**
 * @openapi
 * /api/homepage/{cardId}/page-title:
 *   put:
 *     description: 修改名片頁面資訊標題
 *     summary: 修改名片頁面資訊標題
 *     tags:
 *      - 名片資訊頁面
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
 *              $ref: '#/components/schemas/renameHomepageTitle'
 *     responses:
 *       200:
 *         description: 修改成功
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
 *                      jobInfo:
 *                        type: object
 *                      cardId:
 *                        type: string
 *                      layoutDirection:
 *                        type: string
 *                      homepageLink:
 *                        type: array
 *                        items:
 *                          type: object
 *                      isAuthor:
 *                        type: boolean
 */

router.put(
  '/:cardId/page-title',
  isAuth(),
  // validate(homepageValidation.renameHomepageTitle),
  homepageController.renameHomepageTitle
);

/* --------------------
---新增資訊連結
----------------------*/
/**
 * @openapi
 * /api/homepage/{cardId}/link:
 *   post:
 *     description: 新增名片頁面資訊連結
 *     summary: 新增名片頁面資訊連結
 *     tags:
 *      - 名片資訊頁面
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
 *              $ref: '#/components/schemas/addLink'
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
 *                    default: 'success'
 *                  data:
 *                    type: object
 *                    properties:
 *                      jobInfo:
 *                        type: object
 *                      cardId:
 *                        type: string
 *                      layoutDirection:
 *                        type: string
 *                      homepageLink:
 *                        type: array
 *                        items:
 *                          type: object
 *                      isAuthor:
 *                        type: boolean
 */

router.post(
  '/:cardId/link',
  isAuth(),
  validate(homepageValidation.addLink),
  homepageController.addLink
);

/* --------------------
---刪除連結
----------------------*/
/**
 * @openapi
 * /api/homepage/{cardId}/link/{linkId}:
 *   delete:
 *     description: 刪除名片頁面資訊連結
 *     summary: 刪除名片頁面資訊連結
 *     tags:
 *      - 名片資訊頁面
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The card ID
 *       - in: path
 *         name: linkId
 *         required: true
 *         schema:
 *           type: string
 *         description: The link ID
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
 *                    default: 'success'
 *                  data:
 *                    type: object
 *                    properties:
 *                      jobInfo:
 *                        type: object
 *                      cardId:
 *                        type: string
 *                      layoutDirection:
 *                        type: string
 *                      homepageLink:
 *                        type: array
 *                        items:
 *                          type: object
 *                      isAuthor:
 *                        type: boolean
 */

router.delete(
  '/:cardId/link/:linkId',
  isAuth(),
  validate(homepageValidation.deleteLink),
  homepageController.deleteLink
);

/**
 * @openapi
 * /api/homepage/{cardId}/link/{linkId}:
 *   patch:
 *     description: 修改名片頁面資訊連結
 *     summary: 修改名片頁面資訊連結
 *     tags:
 *      - 名片資訊頁面
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The card ID
 *       - in: path
 *         name: linkId
 *         required: true
 *         schema:
 *           type: string
 *         description: The link ID
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/editLink'
 *     responses:
 *       200:
 *         description: 修改成功
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
 *                      jobInfo:
 *                        type: object
 *                      cardId:
 *                        type: string
 *                      layoutDirection:
 *                        type: string
 *                      homepageLink:
 *                        type: array
 *                        items:
 *                          type: object
 *                      isAuthor:
 *                        type: boolean
 */
router.patch(
  '/:cardId/link/:linkId',
  isAuth(),
  validate(homepageValidation.editLink),
  homepageController.editLink
);

/**
 * @openapi
 * /api/homepage/{cardId}/link/{linkId}/order:
 *   patch:
 *     description: 修改名片頁面資訊連結順序
 *     summary: 修改名片頁面資訊連結順序
 *     tags:
 *      - 名片資訊頁面
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The card ID
 *       - in: path
 *         name: linkId
 *         required: true
 *         schema:
 *           type: string
 *         description: The link ID
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/updateLinkOrder'
 *     responses:
 *       200:
 *         description: 修改成功
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
 *                      jobInfo:
 *                        type: object
 *                      cardId:
 *                        type: string
 *                      layoutDirection:
 *                        type: string
 *                      homepageLink:
 *                        type: array
 *                        items:
 *                          type: object
 *                      isAuthor:
 *                        type: boolean
 */
router.patch(
  '/:cardId/link/:linkId/order',
  isAuth(),
  validate(homepageValidation.updateLinkOrder),
  homepageController.updateLinkOrder
);

/**
 * @openapi
 * /api/homepage/{cardId}/job-info/toggle:
 *   patch:
 *     description: toggle 名片職務資訊是否公開
 *     summary: toggle 名片職務資訊是否公開
 *     tags:
 *      - 名片資訊頁面
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
 *              $ref: '#/components/schemas/jobInfoToggle'
 *     responses:
 *       200:
 *         description: 修改成功
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
 *                      jobInfo:
 *                        type: object
 *                      cardId:
 *                        type: string
 *                      layoutDirection:
 *                        type: string
 *                      homepageLink:
 *                        type: array
 *                        items:
 *                          type: object
 *                      isAuthor:
 *                        type: boolean
 */

router.patch(
  '/:cardId/job-info/toggle',
  isAuth(),
  validate(homepageValidation.jobInfoToggle),
  homepageController.jobInfoToggle
);

module.exports = router;
