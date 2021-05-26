const Campground = require("../models/campground");
const Review = require("../models/review");
const ExpressError = require("../utils/ExpressError");

const getAllReviewById = async (req, res, next) => {
  let campground;

  try {
    campground = await Campground.findById(req.params.id).populate("reviews");
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, could not fetch data.",
      500
    );
    return next(err);
  }

  if (!campground) {
    const err = new ExpressError(
      "Could not find a campground for the provided id.",
      404
    );
    return next(err);
  }

  try {
    reviews = await Review.find();
  } catch (error) {}

  res.status(200).json({ reviews: campground.reviews });
};

const createReview = async (req, res, next) => {
  let campground;
  let review;

  try {
    campground = await Campground.findById(req.params.id);
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, campground not found.",
      500
    );
    return next(err);
  }

  if (!campground) {
    const err = new ExpressError(
      "Could not find a campground for the provided id.",
      404
    );
    return next(err);
  }

  review = new Review(req.body);
  campground.reviews.push(review);

  try {
    await review.save();
    await campground.save();
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, please try again.",
      500
    );
    return next(err);
  }

  res.status(201).json({ review });
};

const deleteReview = async (req, res, next) => {
  const { id, reviewId } = req.params;

  let review;

  try {
    await Campground.findByIdAndUpdate(id, {
      $pull: { reviews: reviewId },
    });
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, campground or review not found.",
      500
    );
    return next(err);
  }

  try {
    review = await Review.findByIdAndDelete(reviewId);
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, could not delete review.",
      500
    );
    return next(err);
  }

  if (!review) {
    const err = new ExpressError(
      "Could not find a review for the provided id.",
      404
    );
    return next(err);
  }

  res.status(200).json({ message: "Review successfully deleted." });
};

module.exports = {
  getAllReviewById,
  createReview,
  deleteReview,
};
