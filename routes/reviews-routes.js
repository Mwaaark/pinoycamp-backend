const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const { check } = require("express-validator");
const {
  getAllReviewById,
  createReview,
  deleteReview,
} = require("../controllers/reviews-controllers");

router
  .route("/")
  .get(getAllReviewById)

  .post(
    isLoggedIn,
    [
      check("rating").isInt({ min: 1, max: 5 }),
      check("body").isLength({ min: 5 }),
    ],
    createReview
  );

router.delete("/:reviewId", isLoggedIn, isReviewAuthor, deleteReview);

module.exports = router;
