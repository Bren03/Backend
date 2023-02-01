const mongoose = require("mongoose");

// Structure of data
const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  user: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: { type: Boolean, required: true },
  dateCreated: { type: Date, required: true },
});

module.exports = mongoose.model("User", userSchema);
