const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const mongoose = require('mongoose');
const { User, Bookmark, BookmarkList, Card } = require('../models');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');

const ObjectId = mongoose.Types.ObjectId;

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
    })
    .exec();

  const defaultGroupID = bookmarkList.group.filter(
    (ele) => ele.isDefaultGroup === true
  )[0]._id;

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

  if (updatedBookmark) {
    return res.status(httpStatus.OK).send({
      status: 'success',
    });
  } else {
    next(new AppError(400, 'Update failed'));
  }
});

const getBookmarkList = handleErrorAsync(async (req, res, next) => {
  // TODO: 新增篩選query string
  const userId = req.user._id;
  const bookmarkList = await BookmarkList.findOne({ userId }).lean();

  const groupList = bookmarkList.group;
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      records: groupList,
    },
  });
});

const createBookmarkList = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { groupName } = req.body;

  // let groupCount = await BookmarkList.aggregate([
  //   {
  //     $match: { userId: ObjectId(userId) },
  //   },
  //   {
  //     $project: {
  //       id: 1,
  //       totalCount: { $size: '$group' },
  //     },
  //   },
  // ]);
  // groupCount = groupCount[0].totalCount;

  const bookmarkList = await BookmarkList.findOneAndUpdate(
    { userId },
    { $push: { group: { name: groupName } } },
    { new: true }
  );
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      records: bookmarkList.group,
    },
  });
});

const deleteBookmarkList = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { followerGroupId } = req.params;

  let defaultGroupId = await BookmarkList.aggregate([
    {
      $match: {
        userId: ObjectId(userId),
      },
    },
    { $unwind: '$group' },
    {
      $match: {
        'group.isDefaultGroup': true,
      },
    },

    {
      $project: {
        _id: '$group._id',
        name: '$group.name',
      },
    },
  ]);

  defaultGroupId = defaultGroupId[0];

  const updatedBookmarks = await Bookmark.updateMany(
    { followerGroupId: followerGroupId },
    { followerGroupId: defaultGroupId._id },
    { new: true }
  );

  const updatedBookmarkList = await BookmarkList.findOneAndUpdate(
    { userId },
    {
      $pull: {
        group: {
          _id: followerGroupId,
          isDefaultGroup: false,
        },
      },
    },
    { new: true }
  );

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      records: updatedBookmarkList.group,
    },
  });
});

const updateBookmarkListOrder = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;

  const { followerGroupId, newIndex } = req.body;
  const doc = await BookmarkList.findOne({ userId });

  const oldIndex = doc.group.findIndex((ele) => {
    console.log(ele._id.toString());
    return ele._id.toString() === followerGroupId;
  });

  if (oldIndex === -1) {
    return next(new AppError(400, 'followerGroupId not found'));
  }
  let [oldValue, newValue] = [doc.group[oldIndex], doc.group[newIndex]];

  const groupCount = doc.group.length;

  if (newIndex >= groupCount) {
    return next(new AppError(400, 'wrong index'));
  }

  doc.group.set(oldIndex, newValue);
  doc.group.set(newIndex, oldValue);

  const updatedBookmarkList = await doc.save();

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      records: updatedBookmarkList.group,
    },
  });
});

const renameBookmarkList = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { followerGroupId } = req.params;
  const { newGroupName } = req.body;

  const updatedBookmarkList = await BookmarkList.findOneAndUpdate(
    { userId, 'group._id': ObjectId(followerGroupId) },
    { $set: { 'group.$.name': newGroupName } },
    { new: true }
  ).exec();

  if (updatedBookmarkList === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'Not found'));
  }

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      records: updatedBookmarkList.group,
    },
  });
});

const getBookmarks = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { followerGroupId } = req.params;
  const { limit, page, desc } = req.query;

  const Bookmarks = await Bookmark.find({ followerGroupId })
    .limit(limit)
    .skip(limit * page)
    .sort('created_at');

  const totalCount = await Bookmark.find({ followerGroupId }).count();

  const totalPage = Math.ceil(totalCount / limit);

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {},
  });
});

module.exports = {
  addBookmark,
  removeBookmark,
  pinBookmark,
  unpinBookmark,
  editBookmarkNote,
  getBookmarkList,
  createBookmarkList,
  deleteBookmarkList,
  updateBookmarkListOrder,
  renameBookmarkList,
  getBookmarks,
};
