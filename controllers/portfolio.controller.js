const httpStatus = require('http-status');

const { User, BookmarkList, Bookmark } = require('../models');
const { Card, Canvas } = require('../models/');

const { portfolioValidation } = require('../validations/');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');

const getPortfolio = handleErrorAsync(async (req, res, next, err) => {
  const userId = req.user._id;
  let { isPublished } = req.query;

  const cardArr = await Card.find({
    $and: [{ userId }],
  }).lean();

  const cardInfoArr = cardArr.map((ele) => {
    const {
      jobInfo,
      userId,
      _id: cardId,
      canvasId,
      createdAt,
      isPublished,
    } = ele;
    return {
      name: jobInfo?.name?.content,
      companyName: jobInfo?.companyName?.content,
      jobTitle: jobInfo?.jobTitle?.content,
      cardId,
      isPublished,
      createdAt,
    };
  });

  // TODO: 完成後續資料整理
  // TODO: 完成query string 篩選
  return res.status(httpStatus.CREATED).send({
    status: 'success',
    data: {
      records: cardInfoArr,
    },
  });
});

const getCard = handleErrorAsync(async (req, res, next, err) => {
  const userId = req.user._id;
  const { cardId } = req.params;

  const card = await Card.findOne({ _id: cardId, userId });

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  return res.status(httpStatus.CREATED).send({
    status: 'success',
    data: card,
  });
});

const createNewCard = handleErrorAsync(async (req, res, next, err) => {
  const { jobInfo, layoutDirection } = req.body;
  const CardData = {
    userId: req.user._id,
    jobInfo,
    isPublished: false,
  };

  const card = await Card.create(CardData);
  const cardId = card.id;

  // 以cardId作為_id
  const canvas = await Canvas.create({ cardId, _id: cardId });

  return res.status(httpStatus.CREATED).send({
    status: 'success',
    data: {
      cardId,
      canvasData: canvas,
    },
  });
});

const deleteCard = handleErrorAsync(async (req, res, next, err) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  const card = await Card.deleteOne({ _id: cardId, userId });
  const canvas = await Canvas.deleteOne({ _id: cardId });

  if (card.deletedCount === 0 || canvas.deletedCount === 0) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const bookmark = await Bookmark.deleteMany({ '_id.followedCardId': cardId });

  return res.status(httpStatus.CREATED).send({
    status: 'success',
  });
});

const getCardCanvas = handleErrorAsync(async (req, res, next, err) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  const card = await Card.findOne({ _id: cardId, userId }).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const canvas = await Canvas.findById({ _id: cardId });

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      cardId,
      jobInfo: card.jobInfo,
      isPublished: card.isPublished,
      canvasData: canvas.canvasData,
    },
  });
});

const saveCardCanvas = handleErrorAsync(async (req, res, next, err) => {
  const { canvasData, cardImageData, layoutDirection } = req.body;
  const { cardId } = req.params;

  const userId = req.user._id;
  const card = await Card.findOne({ _id: cardId, userId }).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  const updatedCard = await Card.findByIdAndUpdate(
    cardId,
    { cardImageData, layoutDirection },
    { new: true }
  );

  const updatedCanvas = await Canvas.findByIdAndUpdate(
    cardId,
    { canvasData },
    { new: true }
  );

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      cardId,
      canvasData: updatedCanvas.canvasData,
      layoutDirection,
    },
  });
});

const publishCard = handleErrorAsync(async (req, res, next, err) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  const card = await Card.findOneAndUpdate(
    { _id: cardId, userId },
    { isPublished: true },
    { new: true }
  ).exec();

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      cardId,
    },
  });
});

const editCardJobInfo = handleErrorAsync(async (req, res, next, err) => {
  const { jobInfo } = req.body;
  const { cardId } = req.params;
  const userId = req.user._id;

  const card = await Card.findOneAndUpdate(
    { _id: cardId, userId },
    { jobInfo },
    { new: true }
  );

  return res.status(httpStatus.CREATED).send({
    status: 'success',
    // data: {
    //   card,
    // },
  });
});

module.exports = {
  getPortfolio,
  createNewCard,
  deleteCard,
  publishCard,
  saveCardCanvas,
  getCardCanvas,
  editCardJobInfo,
  getCard,
};
