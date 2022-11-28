const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const messageSchema = new mongoose.Schema(
  {
    senderUserId: { type: ObjectId, ref: 'User' },
    senderCardId: { type: ObjectId, ref: 'Card' },
    recipientUserId: { type: ObjectId, ref: 'User' },
    isRead: { type: Boolean, default: false },
    category: {
      type: String,
      enum: ['DELETE', 'CHANGE'],
    },
    messageBody: String,
  },
  { strictQuery: false, timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
