const express = require("express");
const router = express.Router();
const { validateCampground } = require("../middleware");
const {
  getAllCampgrounds,
  createCampground,
  getCampgroundById,
  updateCampground,
  deleteCampground,
} = require("../controllers/campgrounds-controllers");

router
  .route("/")
  .get(getAllCampgrounds)
  .post(validateCampground, createCampground);

router
  .route("/:id")
  .get(getCampgroundById)
  .patch(validateCampground, updateCampground)
  .delete(deleteCampground);

module.exports = router;
