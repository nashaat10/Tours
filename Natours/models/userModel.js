const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "please write your name"],
  },
  email: {
    type: String,
    require: [true, "please write your email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please write a valid email"],
  },
  password: {
    type: String,
    require: [true, "please write your password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    require: [true, "please confirm your password"],
    // this only works on create and save
    validate: {
      validator: function (val) {
        return val === this.password;
      },
      message: "passwords are not the same",
    },
  },
  photo: String,
});

// Document Middleware: runs before .save() and .create()
userSchema.pre("save", async function (next) {
  // only run this function if password was actually modified
  if (!this.isModified("password")) return next();
  // hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // delete passwordConfirm field from the database
  this.passwordConfirm = undefined;
});

const User = mongoose.model("User", userSchema);

module.exports = User;
