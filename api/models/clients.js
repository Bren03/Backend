const mongoose = require("mongoose");

// Structure of data
const clientSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  idNum: { type: String, required: true },
  cellphoneNum: { type: String, required: true },
  dateCreated: { type: Date, required: true },
});

module.exports = mongoose.model("Client", clientSchema);
