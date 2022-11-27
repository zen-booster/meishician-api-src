const Joi = require('joi');
const { objectID } = require('./custom.validation');
const { Card } = require('../models');

const linkTypeEnum = Card.schema.path('homepageLink.type').enumValues;

/**
 * @openapi
 * components:
 *   schemas:
 *    renameHomepageTitle:
 *      type: object
 *      properties:
 *        homepageTitle:
 *          type: string
 *          required: true
 *      additionalProperties: false
 */
const renameHomepageTitle = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    homepageTitle: Joi.string().required(),
  }),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    addLink:
 *      type: object
 *      properties:
 *        type:
 *          type: string
 *          required: true
 *        title:
 *          type: string
 *          required: true
 *        subTitle:
 *          type: string
 *        icon:
 *          type: string
 *        link:
 *          type: string
 *          required: true
 *      additionalProperties: false
 */
const addLink = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    type: Joi.string()
      .required()
      .valid(...linkTypeEnum)
      .required(),
    title: Joi.string().required(),
    subTitle: Joi.string(),
    icon: Joi.string(),
    link: Joi.string().required(),
  }),
};

const deleteLink = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
    linkId: Joi.string().required().custom(objectID),
  }),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    editLink:
 *      type: object
 *      properties:
 *        type:
 *          type: string
 *        title:
 *          type: string
 *        subTitle:
 *        icon:
 *          type: string
 *        link:
 *          type: string
 *      additionalProperties: false
 */
const editLink = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
    linkId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object()
    .keys({
      type: Joi.string().valid(...linkTypeEnum),
      title: Joi.string(),
      subTitle: Joi.string(),
      icon: Joi.string(),
      link: Joi.string(),
    })
    .required()
    .min(1),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    updateLinkOrder:
 *      type: object
 *      properties:
 *         newIndex:
 *           type: integer
 *
 *      additionalProperties: false
 */
const updateLinkOrder = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
    linkId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    newIndex: Joi.number().required(),
  }),
};

module.exports = {
  renameHomepageTitle,
  addLink,
  deleteLink,
  editLink,
  updateLinkOrder,
};
