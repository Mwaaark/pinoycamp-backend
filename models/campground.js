const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals: true } };

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    filename: { type: String, required: true },
  },
  opts
);

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_100");
});

const CampgroundSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: String,
  images: [ImageSchema],
  // price: Number,
  // geometry: {}
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
      required: true,
    },
  ],
  createdAt: { type: Date, default: Date.now, required: true },
});

CampgroundSchema.post("findOneAndDelete", async (campground) => {
  if (campground.reviews) {
    await Review.deleteMany({
      _id: {
        $in: campground.reviews,
      },
    });
  }
  if (campground.images) {
    for (const img of campground.images) {
      await cloudinary.uploader.destroy(img.filename);
    }
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
