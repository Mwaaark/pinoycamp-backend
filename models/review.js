const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  body: { type: String, required: true },
  rating: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, required: true },
});

module.exports = mongoose.model("Review", ReviewSchema);
