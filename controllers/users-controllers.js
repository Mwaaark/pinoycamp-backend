const User = require("../models/user");
const { validationResult } = require("express-validator");
const ExpressError = require("../utils/ExpressError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new ExpressError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    const err = new ExpressError("Passwords do not match.", 422);
    return next(err);
  }

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

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (error) {
    const err = new ExpressError(
      "Could not create user, please try again.",
      500
    );
    return next(err);
  }

  const user = new User({
    name,
    email,
    password: hashedPassword,
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

  let token;
  try {
    token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new ExpressError("Signing up failed, please try again.", 500);
    return next(err);
  }

  res.status(201).json({ userId: user._id, email: user.email, token });
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

  if (!user) {
    const err = new ExpressError(
      "Invalid credentials, could not log you in.",
      403
    );
    return next(err);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, user.password);
  } catch (error) {
    const err = new ExpressError(
      "Could not log you in, please check your credentials and try again.",
      500
    );
    return next(err);
  }

  if (!isValidPassword) {
    const err = new ExpressError(
      "Invalid credentials, could not log you in",
      403
    );
    return next(err);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    const err = new ExpressError("Logging in failed, please try again.", 500);
    return next(err);
  }

  res.status(200).json({ userId: user._id, email: user.email, token });
};

module.exports = {
  register,
  login,
};
