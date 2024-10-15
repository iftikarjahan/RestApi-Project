const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation Failted👻👻👻");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        name: name,
      });
      return user.save();
    })
    .then((result) => {
      res
        .status(201)
        .json({ message: "User Created😅😅🫡", userId: result._id });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("No user with this email is found🥶🥶");
        error.statusCode = 401;
        throw err;
      }
      loadedUser=user;
      return bcrypt.compare(password, user.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        const error = new Error("User enetered a wrong Password😶‍🌫️😶‍🌫️");
        error.statusCode = 401;
        throw err;
      }
      const jwtPayload={
        email:loadedUser.email,
        userId:loadedUser._id.toString()
      }
      const token=jwt.sign(jwtPayload,"secretKey",{expiresIn:"1hr"});
      res.status(200).json({token:token,userId:loadedUser._id.toString()});
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
