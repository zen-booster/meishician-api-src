const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const {
  frontDefaultCanvasJSON,
  backDefaultCanvasJSON,
} = require('../data/default-canvas');

const canvasSchema = new mongoose.Schema(
  {
    _id: { type: ObjectId, ref: 'Card' },
    cardId: { type: ObjectId, ref: 'Card' },
    canvasData: {
      front: {
        type: String,
        default: frontDefaultCanvasJSON,
      },
      back: {
        type: String,
        default: backDefaultCanvasJSON,
      },
    }, // ["horizon", "frontData...", "backData..."]
  },
  { strictQuery: false, timestamps: true }
);

const Canvas = mongoose.model('Canvas', canvasSchema);

module.exports = Canvas;
