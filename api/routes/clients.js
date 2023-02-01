// Import express
const express = require("express");

// Setup express router
const router = express.Router();
// const { db } = require("../models/clients");
const ClientController = require("../coltroller/clients");

// Handle incoming GET requests to /clients
router.get("/", ClientController.getClients);

// function getLast() {
//   const result = db.Clients.find({}).sort({ _id: -1 }).limit(1);

//   console.log(result);
// }

// Handle incoming POST requests to /clients
router.post("/add", ClientController.postClient);

// Get client information
router.get("/:clientID", ClientController.getClient_ID);

// Update client information
router.patch("/:clientID", ClientController.updateClient);

// Delete client information
router.delete("/:clientID", ClientController.deleteClient);

// Exports routes to be used in other files
module.exports = router;
