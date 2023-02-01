const mongoose = require("mongoose");

const Client = require("../models/clients");

// Get all clients
exports.getClients = (req, res, next) => {
  Client.find()
    .select(`name idNum cellphoneNum _id`)
    .exec()
    .then((docs) => {
      console.log("here");
      res.status(200).json(docs);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};

// Create new client
exports.postClient = (req, res, next) => {
  // Creates client
  const clients = new Client({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    idNum: req.body.idNum,
    cellphoneNum: req.body.cellphoneNum,
    dateCreated: new Date(),
  });
  // getLast();
  /*
    Get lastest document where date is latest
    If empty()
      no = 1
    else 
      use no retrieved from latest document

    add this number to create client  
  */

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
};

// Get client by id
exports.getClient_ID = (req, res, next) => {
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
};

// Update client info
exports.updateClient = (req, res, next) => {
  const id = req.params.clientID;
  // const updateOps = {};
  // for (const ops of req.body) {
  //   updateOps[ops.propName] = ops.value;
  // }

  Client.update(
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

// Delete client by ID
exports.deleteClient = (req, res, next) => {
  const id = req.params.clientID;
  Client.remove({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
};
