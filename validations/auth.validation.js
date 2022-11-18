const Joi = require('joi');
const { password } = require('./custom.validation');

const { User } = require('../models');

const safetyQuestionEnum = User.schema.path('safetyQuestion').enumValues;

const signUp = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': '{{#label}} does not match' }),
    safetyQuestion: Joi.string()
      .required()
      .valid(...safetyQuestionEnum),
    safetyAnswer: Joi.string().required(),
    avatar: Joi.string().uri(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
};

const updatePassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': '{{#label}} does not match' }),
  }),
};

const resetPassword = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))
      .required()
      .messages({ 'any.only': '{{#label}} does not match' }),
    safetyQuestion: Joi.string()
      .required()
      .valid(...safetyQuestionEnum),
    safetyAnswer: Joi.string().required(),
  }),
};

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
  resetPassword,
  updateProfile,
};
