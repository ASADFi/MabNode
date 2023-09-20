const express = require("express");
const router = express.Router();
var multer = require("multer");
var path = require("path");

var storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, "file_" + Date.now() + "_" + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const user_controller = require("../Controller/user_controller");
const check_auth = require("../Middleware/check_auth");


router.post("/login", user_controller.Login_User);

module.exports = router;
