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
    let { city, domain } = req.query;

    limit = limit ?? 10;
    page = page ?? 1;

    console.log(limit, page);
    let query = {
      'jobInfo.city.content': city ?? null,
      'jobInfo.domain.content': domain ?? null,
    };

    query = _.omitBy(query, _.isNil);

    console.log({
      isPublished: true,
      ...query,
    });

    const cards = await Card.find({
      isPublished: true,
      ...query,
    })
      .limit(limit)
      .skip(limit * (page - 1));

    const response = cards.map((ele) => {
      console.log(ele);
      return {
        name: ele.jobInfo.name.content,
        companyName: ele.jobInfo.companyName.content,
        jobTitle: ele.jobInfo.jobTitle.content,
        city: ele.jobInfo.city.content,
        domain: ele.jobInfo.domain.content,
        cardImageData: ele.cardImageData,
        cardId: ele._id,
      };
    });
    res.status(200).json({
      status: 'success',
      data: {
        records: response,
      },
    });
  })
);

module.exports = router;
