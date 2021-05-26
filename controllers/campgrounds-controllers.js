const Campground = require("../models/campground");
const ExpressError = require("../utils/ExpressError");

const getAllCampgrounds = async (req, res, next) => {
  let campgrounds;

  try {
    campgrounds = await Campground.find();
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
  const { title, description, location, image } = req.body;

  const campground = new Campground({
    title,
    description,
    location,
    image,
  });

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
    campground = await Campground.findById(req.params.id);
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

  try {
    await campground.save();
  } catch (error) {
    const err = new ExpressError(
      "Updating campground failed, please try again.",
      500
    );
    return next(err);
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
