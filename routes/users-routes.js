const express = require("express");
const router = express.Router();

const { check } = require("express-validator");
const { register, login } = require("../controllers/users-controllers");

router.post(
  "/register",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
    check("confirmPassword").isLength({ min: 6 }),
  ],
  register
);

router.post(
  "/login",
  [
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  login
);

module.exports = router;
