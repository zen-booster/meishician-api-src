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
      note: Joi.string(),
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

module.exports = {
  checkCardId,
  editBookmarkNote,
  createBookmarkList,
  deleteBookmarkList,
};
