const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');

const { bookmarkListValidation } = require('../validations/');
const { bookmarkListController } = require('../controllers');
const handleErrorAsync = require('../utils/handleErrorAsync');

const router = express.Router();

/* --------------------
---收藏名片
----------------------*/
router.post(
  '/cards/:cardId',
  isAuth(),
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.addBookmark
);

/* --------------------
---取消收藏名片
----------------------*/
router.delete(
  '/cards/:cardId',
  isAuth(),
  validate(bookmarkListValidation.checkCardId),
  bookmarkListController.removeBookmark
);

/* --------------------
---置頂名片
----------------------*/
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
router.patch(
  '/cards/:cardId/notes',
  isAuth(),
  validate(bookmarkListValidation.editBookmarkNote),
  bookmarkListController.editBookmarkNote
);

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
router.delete(
  '/groups/:followerGroupId/',
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
router.patch(
  '/groups/:followerGroupId/order',
  isAuth(),
  validate(bookmarkListValidation.updateBookmarkListOrder),
  bookmarkListController.updateBookmarkListOrder
);

/* --------------------
---取得群組內卡片
----------------------*/
router.get(
  '/groups/:followerGroupId/cards',
  isAuth(),
  validate(bookmarkListValidation.getBookmarks),
  bookmarkListController.getBookmarks
);

router.get('/tags', isAuth(), bookmarkListController.getTagList);

router.get('/tags/:tag', isAuth(), bookmarkListController.getTagBookmarks);

router.get('/search', isAuth(), bookmarkListController.searchBookmarks);

module.exports = router;
