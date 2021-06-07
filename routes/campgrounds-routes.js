const express = require("express");
const router = express.Router();
var multer = require("multer");
const { storage } = require("../cloudinary/index");
var upload = multer({ storage });
const { isLoggedIn, isCampgroundAuthor } = require("../middleware");
const { check } = require("express-validator");
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
  .post(
    isLoggedIn,
    upload.array("images"),
    [
      check("title").not().isEmpty(),
      check("description").isLength({ min: 5 }),
      check("location").not().isEmpty(),
    ],
    createCampground
  );

router
  .route("/:id")
  .get(getCampgroundById)
  .put(
    isLoggedIn,
    isCampgroundAuthor,
    upload.array("images"),
    [
      check("title").not().isEmpty(),
      check("description").isLength({ min: 5 }),
      check("location").not().isEmpty(),
    ],
    updateCampground
  )
  .delete(isLoggedIn, isCampgroundAuthor, deleteCampground);

module.exports = router;
