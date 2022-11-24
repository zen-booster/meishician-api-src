const httpStatus = require('http-status');
const bcrypt = require('bcrypt');
const _ = require('lodash');

const mongoose = require('mongoose');
const { User, Bookmark, BookmarkList, Card } = require('../models');
const { generateJWT } = require('../services/auth');
const AppError = require('../utils/AppError');
const handleErrorAsync = require('../utils/handleErrorAsync');

const ObjectId = mongoose.Types.ObjectId;

const homepageController = handleErrorAsync(async (req, res, next) => {
  const userId = req.user._id;
  const { followerGroupId } = req.params;
  const { newGroupName } = req.body;
});

module.exports = { homepageController };
