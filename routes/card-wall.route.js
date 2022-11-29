const express = require('express');
const httpStatus = require('http-status');
const validate = require('../middlewares/validate');

const { isAuth } = require('../services/auth');

const { Card } = require('../models');

const _ = require('lodash');

const handleErrorAsync = require('../utils/handleErrorAsync');

const router = express.Router();

/**
 * @openapi
 * tags:
 *  - name: 名片牆
 *    description: 名片牆功能
 */

/**
 * @openapi
 * /api/card-wall:
 *   get:
 *     description: 取得名片牆卡片
 *     summary: 取得名片牆卡片
 *     tags:
 *      - 名片牆
 *     parameters:
 *        - in: query
 *          name: page
 *          schema:
 *            type: integer
 *          description: 第幾頁
 *        - in: query
 *          name: limit
 *          schema:
 *            type: integer
 *          description: 一頁幾筆
 *        - in: query
 *          name: name
 *          description: 姓名搜尋
 *          schema:
 *            type: string
 *     responses:
 *       200:
 *         description: 取得成功
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  status:
 *                    type: string
 *                    default: "success"
 *                  data:
 *                    type: object
 *                    properties:
 *                      totalPage:
 *                        type: integer
 *                      currentPage:
 *                        type: integer
 *                      records:
 *                        type: array
 *                        items:
 *                          types: object
 *                          properties:
 *                            cardId:
 *                              type: string
 *                            name:
 *                              type: string
 *                            companyName:
 *                              type: string
 *                            jobTitle:
 *                              type: string
 *                            city:
 *                              type: string
 *                            domain:
 *                              type: string
 *                            avatar:
 *                              type: string
 *                            cardImageData:
 *                              type: string
 */

router.get(
  '/',
  handleErrorAsync(async (req, res) => {
    let { limit, page } = req.query;
    let { city, domain, name } = req.query;

    limit = limit ?? 10;
    page = page ?? 1;

    console.log(limit, page);
    let query = {
      'jobInfo.city.content': city ?? null,
      'jobInfo.domain.content': domain ?? null,
      'jobInfo.name.content': name ? { $regex: name, $options: 'i' } : null,
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
      .populate('userId')
      .limit(limit)
      .skip(limit * (page - 1))
      .sort('-createdAt');

    console.log(cards);

    const totalCount = await Card.find({
      isPublished: true,
    }).count();
    const totalPage = Math.ceil(totalCount / limit);

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
        avatar: ele.userId?.avatar,
      };
    });

    res.status(200).json({
      status: 'success',
      data: {
        currentPage: page,
        totalPage,
        records: response,
      },
    });
  })
);

module.exports = router;
