const jwt = require("jsonwebtoken");
const ExpressError = require("./utils/ExpressError");
const Campground = require("./models/campground");
const Review = require("./models/review");

const isLoggedIn = (req, res, next) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new ExpressError("You must be signed in first.");
    }
    const decodedToken = jwt.verify(token, process.env.JWT_KEY);
    req.userData = {
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    const err = new ExpressError("You must be signed in first.", 403);
    return next(err);
  }
};

const isCampgroundAuthor = async (req, res, next) => {
  let campground;

  try {
    campground = await Campground.findById(req.params.id);
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, please try again.",
      500
    );
    return next(err);
  }

  if (!campground) {
    const error = new ExpressError(
      "Could not find a campground for the provided id.",
      404
    );
    return next(error);
  }

  if (!campground.author.equals(req.userData.userId)) {
    const err = new ExpressError(
      "You do not have the permission to do that.",
      401
    );
    return next(err);
  }

  next();
};

const isReviewAuthor = async (req, res, next) => {
  let review;

  try {
    review = await Review.findById(req.params.reviewId);
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, please try again.",
      500
    );
    return next(err);
  }

  if (!review) {
    const error = new ExpressError(
      "Could not find a review for the provided id.",
      404
    );
    return next(error);
  }

  if (!review.author.equals(req.userData.userId)) {
    const err = new ExpressError(
      "You do not have the permission to do that.",
      401
    );
    return next(err);
  }

  next();
};

module.exports = {
  isLoggedIn,
  isCampgroundAuthor,
  isReviewAuthor,
};
