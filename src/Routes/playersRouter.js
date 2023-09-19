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

const player_controller = require("../Controller/player_controller");
const check_auth = require("../Middleware/check_auth");

router.get("/all_players", player_controller.Get_All_Players);
router.post(
  "/update_profile",
  upload.single("image"),
  check_auth,
  player_controller.Update_Profile
);
router.post("/login", player_controller.Login_Player);
router.post("/social_login", player_controller.social_login);
router.post("/signup", player_controller.Signup_Player);
router.post("/add_player", check_auth, player_controller.Add_New_Player);
router.get("/toss", player_controller.Toss_AllPlayers);
router.get("/tossForspecific", player_controller.Toss_For_specific);
router.get("/all_groups", player_controller.Get_All_Groups);
router.post("/logout", check_auth, player_controller.Logout);
router.get(
  "/players_by_group_id",
  check_auth,
  player_controller.Players_By_Group_id
);
router.get(
  "/all_groups_by_player",
  check_auth,
  player_controller.All_Groups_By_Player
);
router.get("/get_news", player_controller.Get_news);
router.post("/create_group", check_auth, player_controller.Create_Group);

module.exports = router;
