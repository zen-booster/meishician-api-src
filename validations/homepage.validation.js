const Joi = require('joi');
const { objectID } = require('./custom.validation');
const { Card } = require('../models');

const linkTypeEnum = Card.schema.path('homepageLink.type').enumValues;

const getHomepageInfo = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

const renameHomepageTitle = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    homepageTitle: Joi.string().required(),
  }),
};

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

const updateLinkOrder = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
    linkId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    newIndex: Joi.number().required(),
  }),
};

const jobInfoToggle = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    jobInfo: Joi.string()
      .valid('name', 'companyName', 'jobTitle', 'phoneNumber', 'city', 'domain')
      .required(),
  }),
};

module.exports = {
  renameHomepageTitle,
  addLink,
  deleteLink,
  editLink,
  updateLinkOrder,
  jobInfoToggle,
  getHomepageInfo,
};
