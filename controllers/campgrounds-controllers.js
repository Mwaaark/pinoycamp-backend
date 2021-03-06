const Campground = require("../models/campground");
const { validationResult } = require("express-validator");
const ExpressError = require("../utils/ExpressError");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

const getAllCampgrounds = async (req, res, next) => {
  let campgrounds;

  try {
    campgrounds = await Campground.find().sort({ createdAt: -1 });
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, could not fetch data.",
      500
    );
    return next(err);
  }

  if (!campgrounds || campgrounds.length === 0) {
    const err = new ExpressError("No available campgrounds.", 404);
    return next(err);
  }

  res.status(200).json({ campgrounds });
};

const createCampground = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ExpressError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { title, description, location } = req.body;

  let geoData;

  try {
    geoData = await geocoder
      .forwardGeocode({
        query: location,
        limit: 1,
      })
      .send();
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, location is not valid.",
      500
    );
    return next(err);
  }

  if (geoData.body.features.length < 1) {
    const err = new ExpressError(
      "Something went wrong, location not found.",
      404
    );
    return next(err);
  }

  const campground = new Campground({
    title,
    description,
    location,
    author: req.userData.userId,
  });

  campground.geometry = geoData.body.features[0].geometry;

  campground.images = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));

  try {
    await campground.save();
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, please try again.",
      500
    );
    return next(err);
  }

  res.status(201).json({ campground });
};

const getCampgroundById = async (req, res, next) => {
  let campground;

  try {
    campground = await Campground.findById(req.params.id).populate(
      "author",
      "-password"
    );
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

  res.status(200).json({ campground });
};

const updateCampground = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ExpressError("Invalid inputs passed, please check your data.", 422)
    );
  }

  let geoData;

  try {
    geoData = await geocoder
      .forwardGeocode({
        query: req.body.location,
        limit: 1,
      })
      .send();
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, location is not valid.",
      500
    );
    return next(err);
  }

  if (geoData.body.features.length < 1) {
    const err = new ExpressError(
      "Something went wrong, location not found.",
      404
    );
    return next(err);
  }

  let campground;

  try {
    campground = await Campground.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, could not update data.",
      500
    );
    return next(err);
  }

  campground.geometry = geoData.body.features[0].geometry;

  const imgs = req.files.map((img) => ({
    url: img.path,
    filename: img.filename,
  }));
  campground.images.push(...imgs);

  try {
    await campground.save();
  } catch (error) {
    const err = new ExpressError(
      "Updating campground failed, please try again.",
      500
    );
    return next(err);
  }

  const deleteImages = JSON.parse(req.body.deleteImages);

  if (deleteImages) {
    for (let filename of deleteImages) {
      if (filename) {
        await cloudinary.uploader.destroy(filename);
      }
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: deleteImages } } },
    });
  }

  res.status(200).json({ message: "Campground successfully updated." });
};

const deleteCampground = async (req, res, next) => {
  let campground;

  try {
    campground = await Campground.findByIdAndDelete(req.params.id);
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, could not delete data.",
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

  res.status(200).json({ message: "Campground successfully deleted." });
};

module.exports = {
  getAllCampgrounds,
  createCampground,
  getCampgroundById,
  updateCampground,
  deleteCampground,
};
