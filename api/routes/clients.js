// Import express
const { json } = require("body-parser");
const express = require("express");
// Setup express router
const router = express.Router();
const mongoose = require("mongoose");

const Client = require("../models/clients");

// Handle incoming GET requests to /clients
router.get("/", (req, res, next) => {
  Client.find()
    .select("name idNum cellphoneNum _id")
    .exec()
    .then((docs) => {
      const response = {
        clients: docs,
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Handle incoming POST requests to /clients
router.post("/add", (req, res, next) => {
  // Creates client
  const clients = new Client({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    idNum: req.body.idNum,
    cellphoneNum: req.body.cellphoneNum,
  });
  clients
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Added client successfully!",
        createdClient: {
          _id: result._id,
          name: result.name,
          idNum: result.idNum,
          cellphoneNum: result.cellphoneNum,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Get client information
router.get("/:clientID", (req, res, next) => {
  const id = req.params.clientID;
  Client.findById(id)
    .select("name idNum cellphoneNum _id")
    .exec()
    .then((doc) => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({
          message: "No valid entry for found for provided ID!",
        });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Update client information
router.patch("/:clientID", (req, res, next) => {
  const id = req.params.clientID;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }

  Client.update(
    { _id: id },
    {
      $set: updateOps,
    }
  )
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

// Delete client information
router.delete("/:clientID", (req, res, next) => {
  const id = req.params.clientID;
  Client.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
});

// Exports routes to be used in other files
module.exports = router;
