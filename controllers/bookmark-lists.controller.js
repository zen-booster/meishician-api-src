const httpStatus = require('http-status');
const bcrypt = require('bcrypt');

const { User, Bookmark, BookmarkList, Card } = require('../models');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');

const addBookmark = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  const card = await Card.findById(cardId).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const bookmarkList = await BookmarkList.findOne({ userId })
    .populate({
      path: 'group',
      match: { isDefaultGroup: true },
    })
    .exec();

  const defaultGroupID = bookmarkList.group[0]._id;

  try {
    const newBookmark = await Bookmark.create({
      _id: { followerUserId: userId, followedCardId: cardId },
      followerGroupId: defaultGroupID,
    });
    return res.status(httpStatus.CREATED).send({
      status: 'success',
      data: {
        userId: newBookmark._id.followerUserId,
        groupId: newBookmark.followerGroupId,
        cardId: newBookmark._id.followedCardId,
      },
    });
  } catch (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      return next(new AppError(400, 'Duplicated Card'));
    }
  }
});

const removeBookmark = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  const card = await Card.findById(cardId).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const deletedResult = await Bookmark.deleteOne({
    '_id.followerUserId': userId,
    '_id.followedCardId': cardId,
  });
  console.log(deletedResult);

  if (deletedResult.deletedCount > 0) {
    return res.status(httpStatus.OK).send({
      status: 'success',
    });
  } else {
    next(new AppError(400, 'Delete failed'));
  }
});

module.exports = { addBookmark, removeBookmark };
