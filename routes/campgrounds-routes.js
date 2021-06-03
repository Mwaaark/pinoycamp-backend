const express = require("express");
const router = express.Router();
var multer = require("multer");
const { storage } = require("../cloudinary/index");
var upload = multer({ storage });

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
    upload.array("images"),
    [
      check("title").not().isEmpty(),
      check("description").isLength({ min: 5 }),
      check("location").not().isEmpty(),
    ],
    updateCampground
  )
  .delete(deleteCampground);

module.exports = router;
