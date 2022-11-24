const Joi = require('joi');
const { objectID } = require('./custom.validation');

const renameHomepageTitle = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    homepageTitle: Joi.string().required(),
  }),
};

module.exports = {
  renameHomepageTitle,
};
