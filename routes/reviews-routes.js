const express = require("express");
const router = express.Router({ mergeParams: true });

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
    [check("rating").isInt({ min: 1, max: 5 }), check("body").not().isEmpty()],
    createReview
  );

router.delete("/:reviewId", deleteReview);

module.exports = router;
