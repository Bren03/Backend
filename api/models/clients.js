const mongoose = require("mongoose");

// Structure of data
const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  idNum: { type: String, required: false },
  cellphoneNum: { type: String, required: false },
});

module.exports = mongoose.model("Client", clientSchema);
