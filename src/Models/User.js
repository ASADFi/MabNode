const { verify } = require("jsonwebtoken");
const sql = require("../Config/MYSQL_Configuration");

const User = function (User) {
  this.id = User.id;
  this.full_name = User.full_name;
  this.user_name = User.user_name;
  this.email = User.email;
  this.dob = User.dob;
  this.mobile = User.mobile;
  this.password = User.password;
  this.device_token = User.device_token;
  this.platform = User.platform;
  this.is_super_user = User.is_super_user;
  this.image = User.image;
};

console.log("User Model");

User.GetAllUsers = (result) => {
  console.log("GetAllUsers");

  var myQuery = `SELECT * FROM users`;

  sql.query(myQuery, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

User.FindCurrentRegisteredUser = (UserName, Password, result) => {
  console.log("FindCurrentRegisteredUser");
  var myQuery = `SELECT * FROM users WHERE user_name = ? AND password = ? `;
  var myParam = [UserName, Password];
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

User.FindUserByid = (user_id, result) => {
  console.log("FindUserByid");
  var myQuery = `SELECT * FROM users WHERE id = ?  `;
  var myParam = [user_id];
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

User.UpdateTokenInfo = (device_token, platform, id, result) => {
  console.log("Update Tokens");

  var myQuery = `UPDATE users
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

User.FindCurrentRegisteredUserByUserName = (UserName, result) => {
  console.log("FindCurrentRegisteredUser");
  sql.query(
    `SELECT * FROM users WHERE user_name = ? `,
    [UserName],
    (err, res) => {
      if (res) {
        result(null, res);
      } else result(err, null);
    }
  );
};

User.Register = (newUser, result) => {
  console.log("Register");
  sql.query(`INSERT INTO users SET ?`, newUser, (err, res) => {
    if (res) {
      result(null, res);
    } else {
      result(err, null);
    }
  });
};

User.UpdatePlatformAndDeviceToken = (id, result) => {
  console.log("Logout Query Called!");
  var myQuery = `UPDATE users SET device_token = NULL, platform = NULL WHERE id = ?`;
  var myParam = id;
  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};

User.FindCurrentRegisteredUserBysocial_id = (
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

User.UpdateImage = (id, imageFile, result) => {
  console.log("update image");
  var myQuery = `update users set image=? where id=?`;
  var myParam = [imageFile.path, id];

  sql.query(myQuery, myParam, (err, res) => {
    if (res) {
      result(null, res);
    } else result(err, null);
  });
};
module.exports = User;
