const User = require("../models/user");
const { validationResult } = require("express-validator");
const ExpressError = require("../utils/ExpressError");

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ExpressError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email });
  } catch (error) {
    const err = new ExpressError(
      "Signing up failed, please try again later.",
      500
    );
    return next(err);
  }

  if (existingUser) {
    const err = new ExpressError(
      "User already exists, please login instead.",
      422
    );
    return next(err);
  }

  const user = new User({
    name,
    email,
    password,
  });

  try {
    await user.save();
  } catch (error) {
    const err = new ExpressError(
      "Something went wrong, please try again.",
      500
    );
    return next(err);
  }

  // should not send USER
  res.status(201).json({ user });
};

const login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ExpressError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, password } = req.body;

  let user;

  try {
    user = await User.findOne({ email });
  } catch (error) {
    const err = new ExpressError(
      "Logging in failed, please try again later.",
      500
    );
    return next(err);
  }

  if (!user || user.password !== password) {
    const err = new ExpressError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(err);
  }

  // should not send USER with password
  res.status(200).json({ user });
};

module.exports = {
  register,
  login,
};
