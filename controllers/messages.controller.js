const httpStatus = require('http-status');
const bcrypt = require('bcrypt');

const { User, BookmarkList, Message, Bookmark, Card } = require('../models');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');

const readMessages = handleErrorAsync(async (req, res, next, err) => {
  const userId = req.user._id;
  let { messageId } = req.params;

  const message = await Message.findByIdAndUpdate(
    messageId,
    { $set: { isRead: true } },
    { new: true }
  );

  if (message === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'messageId not found'));
  }

  const responsePayload = {
    messageId: message._id,
    isRead: message.isRead,
    messageBody: message.messageBody,
    createdAt: message.createdAt,
    category: message.category,
  };
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      ...responsePayload,
    },
  });
});

const getMessages = handleErrorAsync(async (req, res, next, err) => {
  const userId = req.user._id;
  let { category } = req.query;
  const messages = await Message.find({ recipientUserId: userId, category });

  if (messages === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'messageId not found'));
  }

  const responsePayload = messages.map((ele) => ({
    messageId: ele._id,
    isRead: ele.isRead,
    messageBody: ele.messageBody,
    createdAt: ele.createdAt,
    category: ele.category,
  }));
  return res.status(httpStatus.OK).send({
    status: 'success',
    data: {
      records: responsePayload,
    },
  });
});

const sendMessages = handleErrorAsync(async (req, res, next, err) => {
  const { cardId } = req.params;
  const userId = req.user._id;
  const { messageBody, category } = req.body;

  const card = await Card.findOne({ _id: cardId, userId }).exec();
  const follower = await Bookmark.find({ '_id.followedCardId': cardId });

  if (card === null) {
    return next(new AppError(httpStatus.NOT_FOUND, 'cardId not found'));
  }
  const messagesArr = follower.map((ele) => {
    return {
      senderUserId: userId,
      senderCardId: cardId,
      recipientUserId: ele._id.followerUserId,
      messageBody,
      category,
    };
  });

  const messages = Message.insertMany(messagesArr);
  return res.status(httpStatus.OK).send({
    status: 'success',
  });
});

module.exports = {
  sendMessages,
  getMessages,
  readMessages,
};
