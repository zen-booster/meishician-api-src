const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');
const { portfolioValidation } = require('../validations/');

const { portfolioController } = require('../controllers');

const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');

/**
 * @openapi
 * tags:
 *  - name: 個人名片
 *    description: 個人名片製作相關功能
 */

/* --------------------
---取得個人名片所有卡片
----------------------*/
/**
 * @openapi
 * /api/portfolio/:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: 取得個人名片所有卡片
 *     summary: 取得個人名片所有卡片
 *     tags:
 *      - 個人名片
 *     parameters:
 *       - in: query
 *         name: isPublished
 *         default: true
 *         schema:
 *           type: boolean
 *         description: 篩選個人名片
 *     responses:
 *       200:
 *         description: Returns a mysterious string.
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
 *                          type: object
 *                          properties:
 *                            name:
 *                              type: string
 *                            companyName:
 *                              type: string
 *                            jobTitle:
 *                              type: string
 *                            cardId:
 *                              type: string

 */
router.get('/', isAuth, portfolioController.getPortfolio);

/* --------------------
---新增卡片
----------------------*/
/**
 * @openapi
 * /api/portfolio/:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: 新增名片
 *     summary: 新增名片
 *     tags:
 *      - 個人名片
 *     requestBody:
 *      required: true
 *      content:
 *        application/json:
 *           schema:
 *              $ref: '#/components/schemas/createNewCard'
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
 *                      cardId:
 *                        type: string

 */
router.post(
  '/',
  isAuth,
  validate(portfolioValidation.createNewCard),
  portfolioController.createNewCard
);

/* --------------------
---卡片存檔
----------------------*/
/**
 * @openapi
 * /api/portfolio/{cardId}/canvas:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     description: 獲取卡片canvas
 *     summary: 獲取卡片canvas
 *     tags:
 *      - 個人名片
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
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      cardId:
 *                        type: string
 *                      canvasData:
 *                        type: string
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     description: 名片存檔
 *     summary: 名片存檔
 *     tags:
 *      - 個人名片
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
 *              $ref: '#/components/schemas/saveCardCanvas'
 *     responses:
 *       200:
 *         description: 存檔成功
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
 *                      cardId:
 *                        type: string
 *                      canvasData:
 *                        type: string
 */

router.get('/:cardId/canvas', isAuth, portfolioController.getCardCanvas);
router.patch(
  '/:cardId/canvas',
  isAuth,
  validate(portfolioValidation.saveCardCanvas),
  portfolioController.saveCardCanvas
);

/* --------------------
---發佈卡片
----------------------*/
/**
 * @openapi
 * /api/portfolio/{cardId}/publish:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     description: 發佈卡片
 *     summary: 發佈卡片
 *     tags:
 *      - 個人名片
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: The card ID
 *
 *     responses:
 *       200:
 *         description: 發佈成功
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
 *                      cardId:
 *                        type: string
 */
router.post('/:cardId/publish', isAuth, portfolioController.publishCard);

module.exports = router;
