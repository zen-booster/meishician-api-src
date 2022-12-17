const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');

const { Card } = require('../models');

const _ = require('lodash');

const handleErrorAsync = require('../utils/handleErrorAsync');

const router = express.Router();

router.get(
  '/',
  handleErrorAsync(async (req, res) => {
    let { limit, page } = req.query;
    let { city, domain, name } = req.query;

    limit = limit ?? 12;
    page = page ? parseInt(page, 10) : 1;

    console.log(limit, page);
    let query = {
      'jobInfo.city.content': city ?? null,
      'jobInfo.domain.content': domain ?? null,
      'jobInfo.name.content': name ? { $regex: name, $options: 'i' } : null,
    };

    query = _.omitBy(query, _.isNil);

    const cards = await Card.find({
      isPublished: true,
      ...query,
    })
      .populate('userId')
      .limit(limit)
      .skip(limit * (page - 1))
      .sort({ createdAt: -1 });

    const totalCount = await Card.find({
      isPublished: true,
      ...query,
    }).count();
    const totalPage = Math.ceil(totalCount / limit);

    const response = cards.map((ele) => {
      return {
        name: ele.jobInfo.name.content,
        companyName: ele.jobInfo.companyName.content,
        jobTitle: ele.jobInfo.jobTitle.content,
        city: ele.jobInfo.city.content,
        domain: ele.jobInfo.domain.content,
        cardImageData: { front: ele.cardImageData.front },
        cardId: ele._id,
        layoutDirection: ele.layoutDirection,
        avatar: ele.userId?.avatar,
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        currentPage: page,
        totalPage,
        limit: limit,
        recordCount: response.length,
        records: response,
      },
    });
  })
);

module.exports = router;
