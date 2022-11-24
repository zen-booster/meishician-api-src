const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');
const { homepageValidation } = require('../validations/');

const { homepageController } = require('../controllers');

const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');

router.post(
  '/:cardId/page-title'
  // isAuth,
  // validate(homepageValidation.renameHomepageTitle),
  // homepageController.renameHomepageTitle
);

module.exports = router;
