const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

// import { SHA256 } from "crypto-js";
// var SHA256 = require("crypto-js/sha256");
// const aes = require("CryptoJS");

var CryptoJS = require("crypto-js");

// Get users
exports.getUsers = (req, res, next) => {
  User.find()
    .select(`user password admin dateCreated _id`)
    .exec()
    .then((docs) => {
      console.log("here");
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Update user info
exports.updateUser = (req, res, next) => {
  const id = req.params.userID;

  User.update(
    { _id: id },
    {
      $set: req.body,
    }
  )
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

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

exports.validate = (req, res, next) => {
  console.log("pqueryParams", req.query);
  console.log("body", req.body);

  try {
    const decoded = jwt.decode(req.body?.token);
    console.log("body", decoded);

    console.log("exp", new Date(decoded.exp));
    console.log("iat", new Date(decoded.iat));

    User.findOne({ _id: decoded.userID })
      .exec()
      .then((result) => {
        console.log("Result", result);

        if (result.token == req.body?.token) {
          console.log("MATCH ON TOKEN ");

          const newToken = createToken(result);
          console.log("newToken ", newToken);
          console.log("req.body.token ", req.body.token);

          User.updateOne(
            { _id: result._id },
            {
              $set: { token: newToken },
            }
          )
            .exec()
            .then((result) => {
              return res.status(200).json({
                message: "Tokens match!",
                token: newToken,
              });
            })
            .catch((err) => {
              // res.status(500).json({
              //   error: err,
              // });
            });
        } else {
          return res.status(200).json({
            message: "Token Mismatch",
          });
        }
      });
  } catch (e) {
    return res.status(200).json({
      message: "Token Mismatch",
    });
  }
};

function createToken(result) {
  const token = jwt.sign(
    {
      user: result.user,
      userID: result._id,
      admin: result.admin,
    },
    process.env.JWT_KEY,
    {
      expiresIn: "1h",
    }
  );

  return token;
}

exports.loginUser = (req, res, next) => {
  console.log("pqueryParams", req.query);

  const queryParameters = req.query;

  const user = {
    user: req.body.user,
    password: req.body.password,
  };

  if (queryParameters.token) {
    // Fetch token and compare to user ID
    User.find({ user: user.user })
      .exec()
      .then((user) => {
        if (req.body.user === user[0].user) {
          const token = createToken(user[0]);

          User.updateOne(
            { _id: user[0]._id },
            {
              $set: { token: token },
            }
          )
            .exec()
            .then((result) => {
              console.log(result);
              // res.status(200).json(result);
            })
            .catch((err) => {
              // res.status(500).json({
              //   error: err,
              // });
            });

          return res.status(200).json({
            message: "Authorization successful!",
            token: token,
          });
        }
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  } else {
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

            // Clients.users.updateOne({token : token})
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
  }
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
