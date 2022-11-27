const Joi = require('joi');
const { password } = require('./custom.validation');

const { User } = require('../models');

// const safetyQuestionEnum = User.schema.path('safetyQuestion').enumValues;

/**
 * @openapi
 * components:
 *   schemas:
 *    signUp:
 *      type: object
 *      required:
 *        - name
 *        - email
 *        - password
 *        - confirmPassword
 *        - safetyQuestion
 *        - safetyAnswer
 *      properties:
 *        name:
 *          type: string
 *          default: Jane Doe
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *        confirmPassword:
 *          type: string
 *          default: stringPassword123
 *        safetyQuestion:
 *          type: string
 *          enum: ['Q1_FIRST_PET_NAME', 'Q2_PARENTS_CITY']
 *        safetyAnswer:
 *          type: string
 *        avatar:
 *          type: string
 *      additionalProperties: false
 */

const signUp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': '{{#label}} does not match' }),
    avatar: Joi.string().uri(),
  }),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    login:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        email:
 *          type: string
 *          default: jane.doe@example.com
 *        password:
 *          type: string
 *          default: stringPassword123
 *      additionalProperties: false
 */
const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    updatePassword:
 *      type: object
 *      required:
 *        - email
 *        - password
 *      properties:
 *        password:
 *          type: string
 *          default: stringPassword123
 *        confirmPassword:
 *          type: string
 *          default: stringPassword123
 *      additionalProperties: false
 */
const updatePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': '{{#label}} does not match' }),
  }),
};

/**
 * @openapi
 * components:
 *   schemas:
 *    updateProfile:
 *      type: object
 *      properties:
 *        name:
 *          type: string
 *          default: Jane Doe
 *        avatar:
 *          type: string
 *          example: 'https://i.imgur.com/fgOXKnw.jpg'
 *      additionalProperties: false
 *      minProperties: 1
 */
const updateProfile = {
  body: Joi.object()
    .keys({
      name: Joi.string().min(1).max(12),
      avatar: Joi.string().uri(),
    })
    .required()
    .min(1),
};

module.exports = {
  signUp,
  login,
  updatePassword,
  updateProfile,
};
