const { string } = require('joi');
const Joi = require('joi');
const { objectID } = require('./custom.validation');
//Joi.object().keys({})

/* --------------------
---新增卡片
----------------------*/
/**
 * @openapi
 * components:
 *   schemas:
 *    createNewCard:
 *      type: object
 *      properties:
 *        jobInfo:
 *          type: object
 *          required: true
 *          properties:
 *            name:
 *             type: object
 *             properties:
 *                content:
 *                  type: string
 *                  example: "王小明"
 *                  required: true
 *                isPublic:
 *                  type: boolean
 *                  default: true
 *            companyName:
 *             type: object
 *             properties:
 *                content:
 *                  type: string
 *                  example: "六角滷味餐飲集團"
 *                  required: true
 *                isPublic:
 *                  type: boolean
 *                  default: true
 *            jobTitle:
 *             type: object
 *             properties:
 *                content:
 *                  type: string
 *                  example: "前端大師"
 *                  required: true
 *                isPublic:
 *                  type: boolean
 *                  default: true
 *            phoneNumber:
 *             type: object
 *             properties:
 *                content:
 *                  type: string
 *                  example: "0988666666"
 *                isPublic:
 *                  type: boolean
 *                  default: false
 *            city:
 *             type: object
 *             properties:
 *                content:
 *                  type: string
 *                  example: "TW-KHH"
 *                  required: true
 *                isPublic:
 *                  type: boolean
 *                  default: true
 *            domain:
 *             type: object
 *             properties:
 *                content:
 *                  type: string
 *                  example: "科技"
 *                  required: true
 *                isPublic:
 *                  type: boolean
 *                  default: true
 *        layoutDirection:
 *          type: string
 *          enum:
 *            - vertical
 *            - horizontal
 *      additionalProperties: false
 */
const createNewCard = {
  body: Joi.object().keys({
    jobInfo: Joi.object().keys({
      name: Joi.object()
        .keys({
          content: Joi.string().required(),
          isPublic: Joi.boolean().default(true),
        })
        .required(),

      companyName: Joi.object()
        .keys({
          content: Joi.string().required(),
          isPublic: Joi.boolean().default(true),
        })
        .required(),
      jobTitle: Joi.object()
        .keys({
          content: Joi.string().required(),
          isPublic: Joi.boolean().default(true),
        })
        .required(),
      phoneNumber: Joi.object().keys({
        content: Joi.string().required(),
        isPublic: Joi.boolean().default(false),
      }),
      city: Joi.object()
        .keys({
          content: Joi.string().required(),
          isPublic: Joi.boolean().default(true),
        })
        .required(),
      domain: Joi.object()
        .keys({
          content: Joi.string().required(),
          isPublic: Joi.boolean().default(true),
        })
        .required(),
    }),
    layoutDirection: Joi.string()
      .required()
      .valid(...['horizontal', 'vertical']),
  }),
};

/* --------------------
---卡片存檔
----------------------*/
/**
 * @openapi
 * components:
 *   schemas:
 *    saveCardCanvas:
 *      type: object
 *      properties:
 *        canvasData:
 *          required: true
 *          type: object
 *          properties:
 *            front:
 *              type: string
 *            back:
 *              type: string
 *            position:
 *              type: string
 *        cardImageData:
 *          required: true
 *          type: object
 *          properties:
 *            front:
 *              type: string
 *            back:
 *              type: string
 *      additionalProperties: false
 */
const saveCardCanvas = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    canvasData: Joi.object()
      .keys({
        front: Joi.string().required(),
        back: Joi.string().required(),
        position: Joi.string().required(),
      })
      .required()
      .min(1),
    cardImageData: Joi.object()
      .keys({
        front: Joi.string().required(),
        back: Joi.string().required(),
      })
      .required()
      .min(1),
  }),
};

const getCardCanvas = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

const deleteCard = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

const publishCard = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

const getPortfolio = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  query: Joi.object().keys({
    isPublished: Joi.boolean(),
  }),
};

const getCard = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
};

const editCardJobInfo = {
  body: Joi.object().keys({
    jobInfo: Joi.object()
      .keys({
        name: Joi.object()
          .keys({
            content: Joi.string().required(),
            isPublic: Joi.boolean().default(true),
          })
          .required(),

        companyName: Joi.object()
          .keys({
            content: Joi.string().required(),
            isPublic: Joi.boolean().default(true),
          })
          .required(),
        jobTitle: Joi.object()
          .keys({
            content: Joi.string().required(),
            isPublic: Joi.boolean().default(true),
          })
          .required(),
        phoneNumber: Joi.object().keys({
          content: Joi.string().required(),
          isPublic: Joi.boolean().default(false),
        }),
        city: Joi.object()
          .keys({
            content: Joi.string().required(),
            isPublic: Joi.boolean().default(true),
          })
          .required(),
        domain: Joi.object()
          .keys({
            content: Joi.string().required(),
            isPublic: Joi.boolean().default(true),
          })
          .required(),
      })
      .required(),
  }),
};

module.exports = {
  createNewCard,
  saveCardCanvas,
  getCardCanvas,
  deleteCard,
  publishCard,
  getCard,
  editCardJobInfo,
};
