const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  createdAt: { type: Date, default: Date.now, required: true },
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
