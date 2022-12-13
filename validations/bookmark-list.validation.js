const Joi = require('joi');
const { objectID } = require('./custom.validation');

const checkCardId = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    editBookmarkNote:
 *      type: object
 *      properties:
 *        note:
 *          type: string
 *        tags:
 *          type: array
 *          items:
 *            type: string
 *        followerGroupId:
 *          type: string
 *      additionalProperties: false
 */

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

/**
 * @openapi
 * components:
 *   schemas:
 *    createBookmarkList:
 *      type: object
 *      properties:
 *        groupName:
 *          type: string
 *      additionalProperties: false
 */

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

/**
 * @openapi
 * components:
 *   schemas:
 *    updateBookmarkListOrder:
 *      type: object
 *      properties:
 *        followerGroupId:
 *          type: string
 *        newIndex:
 *          type: integer
 *      additionalProperties: false
 */
const updateBookmarkListOrder = {
  params: Joi.object().keys({
    followerGroupId: Joi.string().required().custom(objectID).required(),
  }),
  body: Joi.object().keys({
    newIndex: Joi.number().required(),
  }),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    renameBookmarkList:
 *      type: object
 *      properties:
 *        newGroupName:
 *          type: string
 *      additionalProperties: false
 */
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
    limit: Joi.number().default(10),
    asc: Joi.string().default('-createdAt'),
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
