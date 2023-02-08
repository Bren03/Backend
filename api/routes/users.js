// Import express
const express = require("express");
// Setup express router
const router = express.Router();

const UsersController = require("../coltroller/users");

// Get users
router.get("/", UsersController.getUsers);

// Update user
// router.patch("/:userID", UsersController.updateUser);

// Add user
router.post("/signup", UsersController.createUser);

// Login user
router.post("/login", UsersController.loginUser);
router.post("/validate", UsersController.validate);

// Delete user
router.delete("/:userID", UsersController.deleteUser);

// Exports routes to be used in other files
module.exports = router;
