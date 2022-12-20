const Joi = require('joi');
const { objectID } = require('./custom.validation');

const checkCardId = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

const editBookmarkNote = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID).required(),
  }),
  body: Joi.object()
    .keys({
      note: Joi.string().allow('', null),
      tags: Joi.array().items(Joi.string()),
      followerGroupId: Joi.string().required().custom(objectID),
    })
    .required()
    .min(1),
};

const createBookmarkList = {
  body: Joi.object().keys({
    groupName: Joi.string().required(),
  }),
};

const deleteBookmarkList = {
  params: Joi.object().keys({
    followerGroupId: Joi.string().required().custom(objectID).required(),
  }),
};

const updateBookmarkListOrder = {
  params: Joi.object().keys({
    followerGroupId: Joi.string().required().custom(objectID).required(),
  }),
  body: Joi.object().keys({
    newIndex: Joi.number().required(),
  }),
};

const renameBookmarkList = {
  params: Joi.object().keys({
    followerGroupId: Joi.string().required().custom(objectID).required(),
  }),
  body: Joi.object().keys({
    newGroupName: Joi.string().required(),
  }),
};

const getBookmarks = {
  query: Joi.object().keys({
    page: Joi.number().default(1),
    limit: Joi.number(),
    desc: Joi.string(),
  }),
  params: Joi.object().keys({
    followerGroupId: Joi.string().required().custom(objectID).required(),
  }),
};

module.exports = {
  checkCardId,
  editBookmarkNote,
  createBookmarkList,
  deleteBookmarkList,
  updateBookmarkListOrder,
  renameBookmarkList,
  getBookmarks,
};
