const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookmarkSchema = new mongoose.Schema(
  {
    _id: {
      followerUserId: {
        type: ObjectId,
        ref: 'User',
        required: [true, 'userId required'],
      },
      followedCardId: {
        type: ObjectId,
        ref: 'Card',
        required: [true, 'cardId required'],
      },
    },
    followerGroupId: {
      type: ObjectId,
      ref: 'BookmarkList.group',
      required: [true, 'userId required'],
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: [String],
    note: String,
  },
  { strictQuery: false, timestamps: true }
);

const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;
