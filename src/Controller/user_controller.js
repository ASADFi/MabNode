
const jwt = require("jsonwebtoken");
const multer = require("multer");

const User = require("../Models/User.js");

const { success, error } = require("../Response/API-Response.js");

console.log("Controller");



exports.Login_User = (req, res) => {
  console.log("Login");

  if (
    !!req.body.UserName == false ||
    !!req.body.Password == false ||
    !!req.body.DeviceToken == false ||
    !!req.body.Platform == false
  ) {
    return res
      .status(411)
      .json(error("UserName/Password/DeviceToken/Platform not provided", {}));
  } else {
    User.FindCurrentRegisteredUser(
      req.body.UserName,
      req.body.Password,

      (err, user) => {
        if (err || user.length < 1) {
          return res
            .status(404)
            .json(
              error("No Account Exists Against this UserName/Password", {})
            );
        } else if (user.length > 0) {
          const token = jwt.sign(
            {
              Email: user[0].email,
              UserName: user[0].user_name,
              idUser: user[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "30d",
            }
          );

          User.UpdateTokenInfo(
            req.body.DeviceToken,
            req.body.Platform,
            user[0].id,
            (err, _data) => {
              if (!err) {
                user[0].device_token = req.body.DeviceToken;
                user[0].platform = req.body.Platform;

                // if (user[0].is_super_user == 1){
                //   user[0].is_super_user=true;
                // }
                //   else {
                //     user[0].is_super_user=false;
                //   }
                user[0].is_super_user = !!user[0].is_super_user;

                return res.status(200).json(
                  success("Login Successfull", {
                    token: token,
                    User: user[0],
                  })
                );
              } else {
                return res.status(404).json(error("Login Unsuccessfull", err));
              }
            }
          );

          // return res.status(200).json(
          //   success( "Login Successfull", {
          //     token: token,
          //     User: user[0],
          //   })
          // );
        } else {
          return res.status(404).json(error("Login Unsuccessfull", {}));
        }
      }
    );
  }
};


