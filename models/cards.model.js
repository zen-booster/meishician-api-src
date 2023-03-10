const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const cardSchema = new mongoose.Schema(
  {
    userId: { type: ObjectId, ref: 'User' },
    jobInfo: {
      name: {
        content: { type: String, required: [true, 'name is required'] },
        isPublic: { type: Boolean, default: true },
      },
      companyName: {
        content: { type: String, required: [true, 'companyName is required'] },
        isPublic: { type: Boolean, default: true },
      },
      jobTitle: {
        content: { type: String, required: [true, 'jobTitle is required'] },
        isPublic: { type: Boolean, default: true },
      },
      phoneNumber: {
        content: { type: String },
        isPublic: { type: Boolean, default: false },
      },
      city: {
        content: { type: String, required: [true, 'city is required'] },
        isPublic: { type: Boolean, default: true },
      },
      domain: {
        content: { type: String, required: [true, 'domain is required'] },
        isPublic: { type: Boolean, default: true },
      },
    },
    homepageTitle: String,
    homepageLink: [
      {
        type: {
          type: String,
          enum: [
            'GITHUB',
            'LINE',
            'IG',
            'FACEBOOK',
            'LINKEDIN',
            'EMAIL',
            'LINK',
          ],
          required: true,
        },
        title: { type: String, required: true },
        subTitle: { type: String },
        link: { type: String, required: true },
        icon: { type: String },
      },
    ],

    isPublished: { type: Boolean, default: false },

    cardImageData: {
      front: String,
      back: String,
    },

    layoutDirection: {
      type: String,
      enum: ['horizontal', 'vertical'],
    },
  },
  { strictQuery: false, timestamps: true }
);

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
