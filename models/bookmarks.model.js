const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const bookmarkSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'userId required'],
    },

    groupId: {
      type: ObjectId,
      ref: 'BookmarkList.group',
      required: [true, 'userId required'],
    },
    cardId: {
      type: ObjectId,
      ref: 'Card',
      required: [true, 'cardId required'],
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
