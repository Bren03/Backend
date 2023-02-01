const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

// import { SHA256 } from "crypto-js";
// var SHA256 = require("crypto-js/sha256");
// const aes = require("CryptoJS");

var CryptoJS = require("crypto-js");

// Create user Singup
exports.createUser = (req, res, next) => {
  User.find({ user: req.body.user })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "User exists!",
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              user: req.body.user,
              password: hash,
              admin: req.body.admin,
              dateCreated: new Date(),
            });
            user
              .save()
              .then((result) => {
                console.log(result);
                res.status(201).json({
                  message: "User created!",
                });
              })
              .catch((err) => {
                res.status(500).json({ error: err });
              });
          }
        });
      }
    });
};

exports.loginUser = (req, res, next) => {
  console.log("password here ", req.body.password);

  // console.log(
  //   "password here ",
  //   CryptoJS.SHA256.encrypt(
  //     "testAdminPassword",
  //     process.env.CRYP_KEY
  //   ).toString()
  // );

  // decPassword = CryptoJS.SHA256.decrypt(
  //   req.body.password,
  //   process.env.CRYP_KEY
  // );
  // console.log("decPassword ", decPassword);
  // originPassword = decPassword.toString(CryptoJS.enc.Utf8);

  // console.log("originPassword ", originPassword, "123123");

  const user = {
    user: req.body.user,
    password: req.body.password,
  };
  // req.body.password = originPassword;

  User.find({ user: user.user })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authorization failed!",
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Authorization failed!",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              user: user[0].user,
              userID: user[0]._id,
              admin: user[0].admin,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h",
            }
          );

          return res.status(200).json({
            message: "Authorization successful!",
            token: token,
          });
        }
        return res.status(401).json({
          message: "Authorization failed!",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

exports.deleteUser = (req, res, next) => {
  User.remove({ _id: req.params.userID })
    .exec()
    .then((result) => {
      res.status(200).json({
        message: "User removed!",
      });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
