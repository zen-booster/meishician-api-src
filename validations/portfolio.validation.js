const { string } = require('joi');
const Joi = require('joi');
const { objectID } = require('./custom.validation');
//Joi.object().keys({})

/* --------------------
---新增卡片
----------------------*/
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
  }),
};

/* --------------------
---卡片存檔
----------------------*/
const saveCardCanvas = {
  params: Joi.object().keys({
    cardId: Joi.string().required().custom(objectID),
  }),
  body: Joi.object().keys({
    canvasData: Joi.object()
      .keys({
        front: Joi.string().required(),
        back: Joi.string().required(),
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
    layoutDirection: Joi.string()
      .required()
      .valid(...['horizontal', 'vertical']),
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
