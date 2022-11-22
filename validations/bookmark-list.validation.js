const Joi = require('joi');
const { objectID } = require('./custom.validation');

const checkCardId = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

module.exports = { checkCardId };
