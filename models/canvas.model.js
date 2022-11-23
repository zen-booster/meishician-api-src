const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const canvasSchema = new mongoose.Schema(
  {
    cardId: { type: ObjectId, ref: 'Card' },
    canvasData: {
      front: String,
      back: String,
      position: String,
    }, // ["horizon", "frontData...", "backData..."]
  },
  { strictQuery: false, timestamps: true }
);

const Canvas = mongoose.model('Canvas', canvasSchema);

module.exports = Canvas;
