const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');
const { portfolioValidation } = require('../validations/');

const { portfolioController } = require('../controllers');

const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');

/* --------------------
---取得個人名片所有卡片
----------------------*/

router.get(
  '/',
  isAuth(),
  validate(portfolioValidation.getPortfolio),
  portfolioController.getPortfolio
);

router.delete(
  '/:cardId',
  isAuth(),
  validate(portfolioValidation.deleteCard),
  portfolioController.deleteCard
);

/* --------------------
---新增卡片
----------------------*/

router.post(
  '/',
  isAuth(),
  validate(portfolioValidation.createNewCard),
  portfolioController.createNewCard
);

/* --------------------
---卡片存檔
----------------------*/

router.get('/:cardId/canvas', isAuth(), portfolioController.getCardCanvas);

router.patch(
  '/:cardId/canvas',
  isAuth(),
  validate(portfolioValidation.saveCardCanvas),
  portfolioController.saveCardCanvas
);

/* --------------------
---發佈卡片
----------------------*/
router.post('/:cardId/publish', isAuth(), portfolioController.publishCard);

router.put(
  '/:cardId/job-info',
  isAuth(),
  validate(portfolioValidation.editCardJobInfo),
  portfolioController.editCardJobInfo
);

router.get(
  '/:cardId/',
  isAuth(),
  validate(portfolioValidation.getCard),
  portfolioController.getCard
);

module.exports = router;
