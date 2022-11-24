const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

// 收藏名片的群組
// 每個人一定都有一個（且唯一）的預設群組
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  isDefaultGroup: { type: Boolean, default: false },
});

const bookmarkListSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: 'User',
      required: [true, 'userId required'],
      index: true,
      unique: true,
      dropDups: true,
    },

    // 群組排序由order順序決定
    group: {
      type: [groupSchema],
      default: [{ name: '預設', isDefaultGroup: true }],
    },
  },
  { strictQuery: false, timestamps: true }
);

bookmarkListSchema.pre('save', function (next) {
  this.group = this.group.filter((group) => group);
  next();
});

const BookmarkList = mongoose.model('BookmarkList', bookmarkListSchema);

module.exports = BookmarkList;
