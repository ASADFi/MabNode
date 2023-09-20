const sql = require("../Config/MYSQL_Configuration");

const SocialUser = function (SocialUser) {
  this.id = SocialUser.id;
  this.user_id = SocialUser.user_id;
  this.social_platform = SocialUser.social_platform;
  this.social_id = SocialUser.social_id;
  this.social_name = SocialUser.social_name;
};

console.log("Social User Model");

SocialUser.AddNewSocialUser = (newSocialInfo, result) => {
  console.log("Social Info Register");
  sql.query(`INSERT INTO social_info SET ?`, newSocialInfo, (err, res) => {
    if (res) {
      result(null, res);
    } else {
      result(err, null);
    }
  });
};

module.exports = SocialUser;
