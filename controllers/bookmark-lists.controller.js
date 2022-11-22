const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const _ = require('lodash');

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
        followerUserId: newBookmark._id.followerUserId,
        followerGroupId: newBookmark.followerGroupId,
        followedCardId: newBookmark._id.followedCardId,
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

const pinBookmark = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  const card = await Card.findById(cardId).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const updatedBookmark = await Bookmark.findOneAndUpdate(
    {
      '_id.followerUserId': userId,
      '_id.followedCardId': cardId,
    },
    { isPinned: true },
    { new: true }
  );

  if (updatedBookmark) {
    return res.status(httpStatus.OK).send({
      status: 'success',
    });
  } else {
    next(new AppError(400, 'Update failed'));
  }
});

const unpinBookmark = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  const card = await Card.findById(cardId).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const updatedBookmark = await Bookmark.findOneAndUpdate(
    {
      '_id.followerUserId': userId,
      '_id.followedCardId': cardId,
    },
    { isPinned: false },
    { new: true }
  );

  if (updatedBookmark) {
    return res.status(httpStatus.OK).send({
      status: 'success',
    });
  } else {
    next(new AppError(400, 'Update failed'));
  }
});

const editBookmarkNote = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  const updateData = _.pickBy(req.body, _.identity);

  const card = await Card.findById(cardId).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const updatedBookmark = await Bookmark.findOneAndUpdate(
    {
      '_id.followerUserId': userId,
      '_id.followedCardId': cardId,
    },
    { $set: updateData },
    { new: true }
  );

  console.log(updateData);
  console.log(updatedBookmark);

  if (updatedBookmark) {
    return res.status(httpStatus.OK).send({
      status: 'success',
    });
  } else {
    next(new AppError(400, 'Update failed'));
  }
});

module.exports = {
  addBookmark,
  removeBookmark,
  pinBookmark,
  unpinBookmark,
  editBookmarkNote,
};
