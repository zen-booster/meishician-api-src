const httpStatus = require('http-status');

const { User, BookmarkList } = require('../models');
const { Card, Canvas } = require('../models/');

const { portfolioValidation } = require('../validations/');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');

const getPortfolio = handleErrorAsync(async (req, res, next, err) => {
  const userId = req.user._id;
  const cardArr = await Card.find({
    $and: [{ userId }, { isPublished: true }],
  }).lean();

  const cardInfoArr = cardArr.map((ele) => {
    const { jobInfo, userId, _id: cardId, canvasId } = ele;
    return {
      name: jobInfo?.name?.content,
      companyName: jobInfo?.companyName?.content,
      jobTitle: jobInfo?.jobTitle?.content,
      cardId,
      canvasId,
    };
  });

  // TODO: 完成後續資料整理
  // TODO: 完成query string 篩選
  return res.status(httpStatus.CREATED).send({
    status: 'success',
    data: {
      cardInfoArr,
    },
  });
});

const createNewCard = handleErrorAsync(async (req, res, next, err) => {
  const { jobInfo, layoutDirection } = req.body;
  const CardData = {
    userId: req.user._id,
    jobInfo,
    isPublished: false,
    layoutDirection,
  };

  const card = await Card.create(CardData);
  const cardId = card.id;

  const canvas = await Canvas.create({ cardId });
  const canvasId = canvas._id;

  const updatedCard = await Card.findByIdAndUpdate(
    cardId,
    { canvasId: canvasId },
    { new: true }
  );
  return res.status(httpStatus.CREATED).send({
    status: 'success',
    data: {
      cardId,
      canvasId,
    },
  });
});

const publishCard = handleErrorAsync(async (req, res, next, err) => {
  const canvasData = req.body.canvasData;
  const { cardId } = req.params;

  const card = await Card.findByIdAndUpdate(
    cardId,
    { isPublished: true },
    { new: true }
  );

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }
  const canvasId = card.canvasId;

  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      cardId,
      canvasId,
      canvasData,
    },
  });
});
module.exports = { getPortfolio, createNewCard, publishCard };
