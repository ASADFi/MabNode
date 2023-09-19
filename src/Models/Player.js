const { verify } = require("jsonwebtoken");
const sql = require("../Config/MYSQL_Configuration");
const { Login_Player } = require("../Controller/player_controller");
// mysqlPool =require( mysql.createPool());

// constructor
// const group = function (Group) {
//   this.group_id = Group.group_id;
// };

const Player = function (Player) {
  this.id = Player.id;
  this.full_name = Player.full_name;
  this.user_name = Player.user_name;
  this.email = Player.email;
  this.dob = Player.dob;
  this.mobile = Player.mobile;
  this.password = Player.password;
  this.device_token = Player.device_token;
  this.platform = Player.platform;
  this.is_super_user = Player.is_super_user;
  this.image = Player.image;
};

console.log("Player Model");

Player.GetAllPlayers = (result) => {
  console.log("GetAllPlayers");

  var myQuery = `SELECT * FROM players`;

  sql.query(myQuery, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

Player.FindCurrentRegisteredUser = (UserName, Password, result) => {
  console.log("FindCurrentRegisteredUser");
  var myQuery = `SELECT * FROM players WHERE user_name = ? AND password = ? `;
  var myParam = [UserName, Password];
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

Player.FindUserByid = (user_id, result) => {
  console.log("FindUserByid");
  var myQuery = `SELECT * FROM players WHERE id = ?  `;
  var myParam = [user_id];
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

Player.UpdateTokenInfo = (device_token, platform, id, result) => {
  console.log("Update Tokens");

  var myQuery = `UPDATE players
  SET device_token = ?, platform= ?
  WHERE id = ? `;
  var myParam = [device_token, platform, id];
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      console.log("Result: ", res);
      result(null, res);
    } else {
      console.log("Error: ", err);
      result(err, null);
    }
  });
};

Player.FindCurrentRegisteredUserByUserName = (UserName, result) => {
  console.log("FindCurrentRegisteredUser");
  sql.query(
    `SELECT * FROM players WHERE user_name = ? `,
    [UserName],
    (err, res) => {
      if (res) {
        result(null, res);
      } else result(err, null);
    }
  );
};

Player.Register = (newPlayer, result) => {
  console.log("Register");
  sql.query(`INSERT INTO players SET ?`, newPlayer, (err, res) => {
    if (res) {
      result(null, res);
    } else {
      result(err, null);
    }
  });
};

Player.TossAllPlayers = (result) => {
  console.log("RamdomPlayer");

  var myQuery = ` SELECT * FROM players ORDER BY RAND() LIMIT 2`;
  sql.query(myQuery, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

Player.TossForSepcfic = (ids, result) => {
  console.log("RandomPlayerInSpic");

  var myQuery = `SELECT * FROM players WHERE id IN (?) ORDER BY RAND() LIMIT 2 `;
  var myParam = [ids];

  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

Player.GetAllGroups = (result) => {
  console.log("GetAllGroups");
  var myQuery = `SELECT * FROM groups`;
  sql.query(myQuery, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

Player.UpdatePlatformAndDeviceToken = (id, result) => {
  console.log("Logout Query Called!");
  var myQuery = `UPDATE players SET device_token = NULL, platform = NULL WHERE id = ?`;
  var myParam = id;
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};
Player.all_groups_by_player_id = (id, result) => {
  console.log(" Player Groups");
  var myQuery = `SELECT * FROM groups WHERE id IN (SELECT group_id from group_profile WHERE player_id = ?)`;
  var myParam = id;
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};
Player.player_by_group_id = (group_id, result) => {
  console.log("All Players");
  var myQuery = `SELECT * FROM players WHERE ID IN (SELECT player_id FROM group_profile WHERE group_id = ?)`;
  var myParam = group_id;
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};
Player.getAllNew = (result) => {
  console.log("Players News");
  var myQuery = `SELECT * FROM news WHERE is_active = 1`;

  sql.query(myQuery, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};
Player.create_group = (group_name, group_logo, description, result) => {
  console.log("group_added");
  var myQuery = `INSERT INTO groups SET group_name=? ,description=? , group_logo=?`;

  var myParam = [group_name, description, group_logo];
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};
Player.FindCurrentRegisteredUserBysocial_id = (
  social_id,
  social_platform,
  result
) => {
  console.log("login throught link");
  var myQuery = `SELECT * FROM social_info WHERE social_id =? AND social_platform=?`;
  var myParam = [social_id, social_platform];
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

Player.UpdateImage = (id, imageFile, result) => {
  console.log("update image");
  var myQuery = `update players set image=? where id=?`;
  var myParam = [imageFile.path, id];

  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};
module.exports = Player;
