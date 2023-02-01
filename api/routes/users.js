// Import express
const express = require("express");
// Setup express router
const router = express.Router();

const UsersController = require("../coltroller/users");

// Add user
router.post("/signup", UsersController.createUser);

// Login user
router.post("/login", UsersController.loginUser);

// Delete user
router.delete("/:userID", UsersController.deleteUser);

// Exports routes to be used in other files
module.exports = router;
