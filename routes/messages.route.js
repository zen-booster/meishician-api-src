const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');
const { messageValidation } = require('../validations/');

const { messageController } = require('../controllers');

const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');

router.post(
  '/:cardId/',
  isAuth(),
  validate(messageValidation.sendMessages),
  messageController.sendMessages
);

router.get(
  '/',
  isAuth(),
  // validate(messageValidation.get),
  messageController.getMessages
);

router.patch(
  '/:messageId/read',
  isAuth(),
  validate(messageValidation.get),
  messageController.readMessages
);

module.exports = router;
