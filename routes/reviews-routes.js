const express = require("express");
const router = express.Router({ mergeParams: true });
const { validateReview } = require("../middleware");
const {
  getAllReviewById,
  createReview,
  deleteReview,
} = require("../controllers/reviews-controllers");

router.route("/").get(getAllReviewById).post(validateReview, createReview);

router.delete("/:reviewId", deleteReview);

module.exports = router;
