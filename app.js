const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");

const playersRouter = require("./src/Routes/playersRouter");

app.use(morgan("dev"));

// for parsing application/json
app.use(
  bodyParser.json({
      limit: "50mb",
  })
);
// for parsing application/xwww-form-urlencoded
app.use(
  bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Header",
    "Origin,X-Request-With,context-Type,Accept,Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Allow-Control-Method", "PUT,GET,POST,PATCH,DELETE");
    return res.status(200).json({});
  }
  next();
});



app.use((req, res, next) => {
  const error = new Error("NOT found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      status: false,
      message: error.message,
    },
  });
});

module.exports = app;
