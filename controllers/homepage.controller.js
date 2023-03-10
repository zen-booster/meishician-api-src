const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const mongoose = require('mongoose');
const { User, Bookmark, BookmarkList, Card } = require('../models');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');
const { update } = require('lodash');

const ObjectId = mongoose.Types.ObjectId;

const getHomepageInfo = handleErrorAsync(async (req, res, next) => {
  const userId = req?.user?._id;
  const { cardId } = req.params;
  const card = await Card.findOne({ _id: cardId, isPublished: true });

  if (card === null) {
    return next(
      new AppError(httpStatus.NOT_FOUND, 'cardId not found or not published')
    );
  }
  let { jobInfo } = card;

  if (!userId) {
    jobInfo = Object.entries(jobInfo)
      .filter((ele) => ele[1].isPublic === true)
      .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        role: 'guest',
        isPublished: card.isPublished,
        jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        isAuthor: false,
        homepageTitle: card.homepageTitle,
        cardImageData: card.cardImageData,
      },
    });
  }

  if (!!userId && card.userId.toString() === userId.toString()) {
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        role: 'author',
        jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        isAuthor: true,
        cardImageData: card.cardImageData,
        homepageTitle: card.homepageTitle,
        isPublished: card.isPublished,
      },
    });
  }

  if (!!userId && card.userId.toString() !== userId.toString()) {
    const bookmark = await Bookmark.findOne({
      '_id.followerUserId': userId,
      '_id.followedCardId': cardId,
    });
    jobInfo = Object.entries(jobInfo)
      .filter((ele) => ele[1].isPublic === true)
      .reduce((a, v) => ({ ...a, [v[0]]: v[1] }), {});
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        role: bookmark ? 'bookmarkedMember' : 'nonBookmarkedMember',
        jobInfo,
        isPublished: card.isPublished,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        isAuthor: false,
        homepageTitle: card.homepageTitle,
        cardImageData: card.cardImageData,
      },
    });
  }
});

const getCardCanvas = handleErrorAsync(async (req, res, next) => {
  const userId = req?.user?._id;
  const { cardId } = req.params;
  const card = await Card.findOne({ _id: cardId, isPublished: true });

  if (card === null) {
    return next(
      new AppError(httpStatus.NOT_FOUND, 'cardId not found or not published')
    );
  }

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      cardImageData: card.cardImageData,
    },
  });
});

const renameHomepageTitle = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  const { homepageTitle } = req.body;
  const card = await Card.findOneAndUpdate(
    { _id: cardId, userId },
    { homepageTitle },
    { new: true }
  );

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  } else {
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        jobInfo: card.jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        homepageTitle: card.homepageTitle,
        isAuthor: true,
      },
    });
  }
});

const addLink = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  const { type, title, subTitle, icon, link } = req.body;

  const card = await Card.findOneAndUpdate(
    { _id: cardId, userId },
    {
      $push: {
        homepageLink: {
          type,
          title,
          subTitle,
          icon,
          link,
        },
      },
    },
    { new: true }
  );

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  } else {
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        jobInfo: card.jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        homepageTitle: card.homepageTitle,
        isAuthor: true,
      },
    });
  }
});

const deleteLink = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId, linkId } = req.params;
  console.log(cardId, linkId);
  const card = await Card.findOneAndUpdate(
    { _id: cardId, userId },
    {
      $pull: { homepageLink: { _id: linkId } },
    },
    { new: true }
  );

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  } else {
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        jobInfo: card.jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        homepageTitle: card.homepageTitle,
        isAuthor: true,
      },
    });
  }
});

const editLink = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId, linkId } = req.params;

  const card = await Card.findOne({ _id: cardId, userId });
  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  } else {
    const newOne = {
      ...card.homepageLink.id(linkId).toObject(),
      ...req.body,
    };
    card.homepageLink.id(linkId).set(newOne);
    card.save({ validateBeforeSave: false });
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        jobInfo: card.jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        homepageTitle: card.homepageTitle,
        isAuthor: true,
      },
    });
  }
});

const updateLinkOrder = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId, linkId } = req.params;
  const { newIndex } = req.body;
  const card = await Card.findOne({ _id: cardId, userId });
  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  } else {
    const oldIndex = card.homepageLink.findIndex((ele) => {
      return ele._id.toString() === linkId;
    });

    if (oldIndex === -1) {
      return next(new AppError(400, 'linkId not found'));
    }
    let [oldValue, newValue] = [
      card.homepageLink[oldIndex],
      card.homepageLink[newIndex],
    ];

    const count = card.homepageLink.length;

    if (newIndex >= count) {
      return next(new AppError(400, 'wrong index'));
    }

    card.homepageLink.set(oldIndex, newValue);
    card.homepageLink.set(newIndex, oldValue);
    card.save();
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        jobInfo: card.jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        homepageTitle: card.homepageTitle,
        isAuthor: true,
      },
    });
  }
});

const jobInfoToggle = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { cardId } = req.params;
  const { jobInfo } = req.body;

  const card = await Card.findOne({ _id: cardId, userId });
  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  } else {
    card.jobInfo[jobInfo].isPublic = !card.jobInfo[jobInfo].isPublic;

    card.save();
    return res.status(httpStatus.OK).send({
      status: 'success',
      data: {
        jobInfo: card.jobInfo,
        cardId: card._id,
        layoutDirection: card.layoutDirection,
        homepageLink: card.homepageLink,
        homepageTitle: card.homepageTitle,
        isAuthor: true,
      },
    });
  }
});

module.exports = {
  renameHomepageTitle,
  getHomepageInfo,
  addLink,
  deleteLink,
  editLink,
  updateLinkOrder,
  jobInfoToggle,
  getCardCanvas,
};
