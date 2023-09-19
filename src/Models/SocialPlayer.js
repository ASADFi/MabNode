const sql = require("../Config/MYSQL_Configuration");

const SocialPlayer = function (SocialPlayer) {
  this.id = SocialPlayer.id;
  this.player_id = SocialPlayer.player_id;
  this.social_platform = SocialPlayer.social_platform;
  this.social_id = SocialPlayer.social_id;
  this.social_name = SocialPlayer.social_name;
};

console.log("Social Player Model");

SocialPlayer.AddNewSocialPlayer = (newSocialInfo, result) => {
  console.log("Social Info Register");
  sql.query(`INSERT INTO social_info SET ?`, newSocialInfo, (err, res) => {
    if (res) {
      result(null, res);
    } else {
      result(err, null);
    }
  });
};

module.exports = SocialPlayer;
