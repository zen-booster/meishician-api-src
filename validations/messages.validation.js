const Joi = require('joi');
const { objectID } = require('./custom.validation');
//Joi.object().keys({})

/**
 * @openapi
 * components:
 *   schemas:
 *    sendMessages:
 *      type: object
 *      properties:
 *        messageBody:
 *          type: string
 *          required: true
 *      additionalProperties: false
 */
const sendMessages = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    messageBody: Joi.string().required(),
    category: Joi.string().required(),
  }),
};

module.exports = {
  sendMessages,
};
