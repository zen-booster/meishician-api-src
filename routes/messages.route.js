const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');
const { messageValidation } = require('../validations/');

const { messageController } = require('../controllers');

const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');

/**
 * @openapi
 * tags:
 *  - name: 名片訊息頁面
 *    description: 名片訊息相關功能
 */

/**
 * @openapi
 * /api/messages/{cardId}/:
 *   post:
 *     description: 發送訊息
 *     summary: 發送訊息
 *     tags:
 *      - 名片訊息頁面
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
 *              $ref: '#/components/schemas/sendMessages'
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
 */

router.post(
  '/:cardId/',
  isAuth(),
  validate(messageValidation.sendMessages),
  messageController.sendMessages
);

/**
 * @openapi
 * /api/messages/:
 *   get:
 *     description: 獲得訊息列表
 *     summary: 獲取訊息列表
 *     tags:
 *      - 名片訊息頁面
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
 *              $ref: '#/components/schemas/sendMessages'
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
 *                      records:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            messageId:
 *                              type: string
 *                            isRead:
 *                              type: boolean
 *                            messageBody:
 *                              type: string
 *                            createdAt:
 *                              type: string
 */

router.get(
  '/',
  isAuth(),
  // validate(messageValidation.get),
  messageController.getMessages
);

/**
 * @openapi
 * /api/messages/{messageId}:
 *   patch:
 *     description: 已讀訊息
 *     summary: 已讀訊息
 *     tags:
 *      - 名片訊息頁面
 *     parameters:
 *       - in: path
 *         name: messageId
 *         required: true
 *         schema:
 *           type: string
 *         description: The message ID
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
 *                      messageId:
 *                        type: string
 *                      isRead:
 *                        type: boolean
 *                      messageBody:
 *                        type: string
 *                      createdAt:
 *                        type: string
 *
 *
 */
router.patch(
  '/:messageId/read',
  isAuth(),
  validate(messageValidation.get),
  messageController.readMessages
);

module.exports = router;
