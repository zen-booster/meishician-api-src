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

router.post(
  '/:cardId/link',
  isAuth(),
  validate(homepageValidation.addLink),
  homepageController.addLink
);

/**
 * @openapi
 * /api/homepage/{cardId}/{linkId}:
 *   deletes:
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
 *       - in: path
 *         name: linkId
 *         required: true
 *         schema:
 *           type: string
 *         description: The linkId ID
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
router.delete(
  '/:cardId/link/:linkId',
  isAuth(),
  //validate(homepageValidation.),
  homepageController.deleteLink
);

module.exports = router;
