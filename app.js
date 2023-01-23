// Get express files
const express = require("express");
// Execute express
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const mongoose = require("mongoose");

// Import client routes
const clientsRoutes = require("./api/routes/clients");

// Connect to mongoose
const LOCALHOST = "127.0.0.1";

mongoose.connect(`mongodb://${LOCALHOST}:27017/Clients`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
mongoose.Promise = global.Promise;

// console.log("mongoose", mongoose);

app.use(morgan("dev"));
// True lets you parse extended body with rich data false lets you parse simple body for url encoded data
app.use(bodyParser.urlencoded({ extended: false }));
// Extract json data and make easy readable
app.use(bodyParser.json());

// Cors
// const xhr = new XMLHttpRequest();
// xhr.withCredentials = false;

/*app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin, X-Requested_With, Content-Type, Accept, Authorization",
    "Access-Control-Allow-Methods",
    "PUT, POST, PATCH, DELETE, GET"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});*/
app.use(function (req, res, next) {
  //Enabling CORS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

// Middleware that forwareds requests to clients
app.use("/clients", clientsRoutes);

app.use((req, res, next) => {
  const error = new Error("Not found!");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

// Exports app to be used in other files
module.exports = app;
