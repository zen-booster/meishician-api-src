const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');
const { homepageValidation } = require('../validations/');

const { homepageController } = require('../controllers');

const router = express.Router();
const handleErrorAsync = require('../utils/handleErrorAsync');

/* --------------------
---獲取名片資訊頁面
----------------------*/
router.get(
  '/:cardId',
  isAuth(true),
  validate(homepageValidation.getHomepageInfo),
  homepageController.getHomepageInfo
);

/* --------------------
---更改名片資訊標題
----------------------*/
router.put(
  '/:cardId/page-title',
  isAuth(),
  validate(homepageValidation.renameHomepageTitle),
  homepageController.renameHomepageTitle
);

/* --------------------
---新增資訊連結
----------------------*/
router.post(
  '/:cardId/link',
  isAuth(),
  validate(homepageValidation.addLink),
  homepageController.addLink
);

/* --------------------
---刪除連結
----------------------*/

router.delete(
  '/:cardId/link/:linkId',
  isAuth(),
  validate(homepageValidation.deleteLink),
  homepageController.deleteLink
);

router.patch(
  '/:cardId/link/:linkId',
  isAuth(),
  validate(homepageValidation.editLink),
  homepageController.editLink
);

router.patch(
  '/:cardId/link/:linkId/order',
  isAuth(),
  validate(homepageValidation.updateLinkOrder),
  homepageController.updateLinkOrder
);

router.patch(
  '/:cardId/job-info/toggle',
  isAuth(),
  validate(homepageValidation.jobInfoToggle),
  homepageController.jobInfoToggle
);

module.exports = router;
