const { json } = require("body-parser");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { state } = require("../Config/MYSQL_Configuration.js");
const Player = require("../Models/Player.js");
const SocialPlayer = require("../Models/SocialPlayer.js");
const { success, error } = require("../Response/API-Response.js");
const { route } = require("../Routes/playersRouter.js");
const upload = multer({ dest: "upload/" });

console.log("Controller");

exports.Get_All_Players = (_req, res) => {
  Player.GetAllPlayers((err, data) => {
    if (!err) {
      if (data.length > 0) {
        res.status(200).json(success("Players Retrieved", { Players: data }));
      } else if (data.length <= 0) {
        res.status(200).json(success("No Players Found", { Players: data }));
      }
    } else res.status(500).json(error("Error Handling Information", err));
  });
};

exports.Login_Player = (req, res) => {
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
    Player.FindCurrentRegisteredUser(
      req.body.UserName,
      req.body.Password,

      (err, player) => {
        if (err || player.length < 1) {
          return res
            .status(404)
            .json(
              error("No Account Exists Against this UserName/Password", {})
            );
        } else if (player.length > 0) {
          const token = jwt.sign(
            {
              Email: player[0].email,
              UserName: player[0].user_name,
              idUser: player[0].id,
            },
            process.env.JWT_KEY,
            {
              expiresIn: "30d",
            }
          );

          Player.UpdateTokenInfo(
            req.body.DeviceToken,
            req.body.Platform,
            player[0].id,
            (err, _data) => {
              if (!err) {
                player[0].device_token = req.body.DeviceToken;
                player[0].platform = req.body.Platform;

                // if (player[0].is_super_user == 1){
                //   player[0].is_super_user=true;
                // }
                //   else {
                //     player[0].is_super_user=false;
                //   }
                player[0].is_super_user = !!player[0].is_super_user;

                return res.status(200).json(
                  success("Login Successfull", {
                    token: token,
                    Player: player[0],
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
          //     Player: player[0],
          //   })
          // );
        } else {
          return res.status(404).json(error("Login Unsuccessfull", {}));
        }
      }
    );
  }
};

exports.Signup_Player = (req, res) => {
  console.log("SignUp");

  if (
    !!req.body.UserName == false ||
    !!req.body.Password == false ||
    !!req.body.FullName == false
  ) {
    return res
      .status(411)
      .json(error("UserName/Password/FullName not provided", {}));
  } else {
    Player.FindCurrentRegisteredUserByUserName(
      req.body.UserName,
      (err, player) => {
        if (err) {
          return res.status(500).json(error("Error Handling Information", err));
        } else if (player.length > 0) {
          return res
            .status(404)
            .json(
              error(
                "This UserName was Previously Used, Try an Alternating UserName or Contact Support",
                {}
              )
            );
        } else if (player.length < 1) {
          const newPlayer = new Player({
            email: !!req.body.Email ? req.body.Email : "",
            password: req.body.Password,
            user_name: req.body.UserName,
            full_name: req.body.FullName,
            mobile: !!req.body.Mobile ? req.body.Mobile : "",
            device_token: !!req.body.DeviceToken ? req.body.DeviceToken : "",
            platform: !!req.body.Platform ? req.body.Platform : "",
            is_super_user: !!req.body.is_super_user
              ? req.body.is_super_user
              : 0,
          });

          Player.Register(newPlayer, (err, data) => {
            console.log(data);
            console.log("insertedID: ", data.insertId);
            if (data != null) {
              const token = jwt.sign(
                {
                  Email: newPlayer.email,
                  UserName: newPlayer.user_name,

                  idUser: data.insertId,
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "30d",
                }
              );

              return res.status(200).json(
                success("Signup Successfull", {
                  token: token,
                  Player: newPlayer,
                })
              );
            } else {
              return res
                .status(500)
                .json(error("Some Error Occurred while Creating Player", err));
            }
          });
        } else {
          return res.status(404).json(error("Signup Unsuccessfull", {}));
        }
      }
    );
  }
};

exports.Toss_AllPlayers = (_req, res) => {
  Player.TossAllPlayers((err, data) => {
    if (!err) {
      if (data.length > 0) {
        res.status(200).json(success(" TwoRamdomPlayer", { Players: data }));
      } else if (data.length <= 0) {
        res.status(200).json(success("No Players Found", { Players: data }));
      }
    } else res.status(500).json(error("Error Handling Information", err));
  });
};

exports.Toss_For_specific = (req, res) => {
  console.log("TossForSepcfic", req);
  if (!!req.query.ids == false) {
    return res.status(411).json(error("ids not provided", {}));
  } else {
    var idsArray = JSON.parse(req.query.ids);

    Player.TossForSepcfic(idsArray, (err, data) => {
      if (!err) {
        if (data.length > 0) {
          res.status(200).json(success(" TwoRamdomPlayer", { Players: data }));
        } else if (data.length <= 0) {
          res.status(200).json(success("No Players Found", { Players: data }));
        }
      } else res.status(500).json(error("Error Handling Information", err));
    });
  }
};

exports.Get_All_Groups = (_req, res) => {
  Player.GetAllGroups((err, data) => {
    if (!err) {
      if (data.length > 0) {
        res.status(200).json(success("Allgroups", { Players: data }));
      } else if (data.length <= 0) {
        res.status(200).json(success("NogroupsFound", { Players: data }));
      }
    } else res.status(500).json(error("Error Handling Information", err));
  });
};

exports.Logout = (req, res) => {
  Player.UpdatePlatformAndDeviceToken(req.userData.idUser, (err, _data) => {
    if (!err) {
      res
        .status(202)
        .clearCookie("auth-token")
        .json(success("Logout Successfully!", {}));
    } else res.status(500).json(error("Error Handling Information", err));
  });
};
exports.All_Groups_By_Player = (req, res) => {
  Player.all_groups_by_player_id(req.userData.idUser, (err, data) => {
    if (!err) {
      //  console.log(req.userData.idUser);
      res

        .status(202)

        .json(success("All Players ", { groups: data }));
    } else
      res.status(500).json(error("Player don't have any group assigned!", err));
  });
};
exports.Players_By_Group_id = (req, res) => {
  console.log("group id: ", req.query.group_id);

  if (!!req.query.group_id == false) {
    res.status(404).json(error("err", "Group_id not provided"));
  } else {
    Player.player_by_group_id(req.query.group_id, (err, data) => {
      if (!err) {
        res.status(202).json(success("All Players", { players: data }));
      } else res.status(500).json(error("fail", "players not find !", err));
    });
  }
};
exports.Get_news = (_req, res) => {
  console.log("getnews");
  Player.getAllNew((err, data) => {
    if (!err) {
      if (data.length > 0) {
        // const fillteredData = data.fillter((obj)=>{
        //   if(obj.is_active==1){
        //     return true;
        //   }
        //   else{
        //     return   false;
        //   }
        // })
        //  if (fillteredData.length>0){

        //   res
        //   .status(200)
        //   .json(success( "Players News", { playerNews: fillteredData }));
        //  } else{
        //   res
        //   .status(200)
        //   .json(success( "NO Players News", { playerNews: fillteredData }));
        //  }

        res.status(200).json(success("Players News", { playerNews: data }));
      } else if (data.length <= 0) {
        res.status(200).json(success("No Players News", { playerNews: data }));
      }
    } else res.status(500).json(error("Error Handling Information", err));
  });
};
exports.Create_Group = (req, res) => {
  console.log("New group added");
  // console.log("group_added:") ;

  if (!!req.body.group_name == false) {
    res.status(404).json(error("group name must be provided", {}));
  }
  Player.create_group(
    req.body.group_name,
    req.body.group_logo,
    req.body.description,
    (err, _data) => {
      if (!err) {
        res.status(202).json(success("Group added", { group: {} }));
      } else res.status(500).json(error("fail", "group not created !", err));
    }
  );
};

exports.Add_New_Player = (req, res) => {
  console.log("New player Added");

  if (
    !!req.body.UserName == false ||
    !!req.body.Password == false ||
    !!req.body.FullName == false
  ) {
    return res
      .status(411)
      .json(error("UserName/Password/FullName not provided", {}));
  } else {
    Player.FindCurrentRegisteredUserByUserName(
      req.body.UserName,
      (err, player) => {
        if (err) {
          return res.status(500).json(error("Error Handling Information", err));
        } else if (player.length > 0) {
          return res
            .status(404)
            .json(
              error(
                "This UserName was Previously Used, Try an Alternating UserName or Contact Support",
                {}
              )
            );
        } else if (player.length < 1) {
          const newPlayer = new Player({
            email: !!req.body.Email ? req.body.Email : "",
            password: req.body.Password,
            user_name: req.body.UserName,
            full_name: req.body.FullName,
            mobile: !!req.body.Mobile ? req.body.Mobile : "",
            device_token: !!req.body.DeviceToken ? req.body.DeviceToken : "",
            platform: !!req.body.Platform ? req.body.Platform : "",
            is_super_user: !!req.body.is_super_user
              ? req.body.is_super_user
              : 0,
          });

          Player.Register(newPlayer, (err, data) => {
            if (data != null) {
              const token = jwt.sign(
                {
                  Email: newPlayer.email,
                  UserName: newPlayer.user_name,

                  idUser: data.insertId, /// this id is use to new query
                },
                process.env.JWT_KEY,
                {
                  expiresIn: "30d",
                }
              );

              return res.status(200).json(
                success("New Player Added Successfull", {
                  token: token,
                  Player: newPlayer,
                })
              );
            } else {
              return res
                .status(500)
                .json(error("Some Error Occurred while Creating Player", err));
            }
          });
        } else {
          return res
            .status(404)
            .json(error("New Palyer Added Unsuccessfull", {}));
        }
      }
    );
  }
};

exports.social_login = (req, res) => {
  console.log("API CALL (social_login): ", new Date());
  console.log("API CALL (social_login) Body: ", req.body);

  if (
    !!req.body.social_platform == false ||
    !!req.body.full_name == false ||
    !!req.body.user_name == false ||
    !!req.body.social_id == false
  ) {
    return res
      .status(411)
      .json(
        error("user_name/full_name/social_platform/social_is not provided", {})
      );
  } else {
    Player.FindCurrentRegisteredUserBysocial_id(
      req.body.social_id,
      req.body.social_platform,

      (err, social_player) => {
        if (err) {
          return res.status(500).json(error("Error Handling Information", err));
        } else if (social_player.length > 0) {
          Player.FindUserByid(
            social_player[0].player_id,

            (err, player) => {
              if (err || player.length < 1) {
                return res.status(404).json(
                  error(
                    !!err ? err : "No Account Exists Against this Information",

                    {}
                  )
                );
              } else if (player.length > 0) {
                const token = jwt.sign(
                  {
                    Email: player[0].email,
                    UserName: player[0].user_name,
                    idUser: player[0].id,
                  },
                  process.env.JWT_KEY,
                  {
                    expiresIn: "30d",
                  }
                );
                if (
                  !!req.body.device_token == true &&
                  !!req.body.platform == true
                ) {
                  Player.UpdateTokenInfo(
                    req.body.device_token,
                    req.body.platform,
                    player[0].id,

                    (err, _data) => {
                      if (!err) {
                        player[0].device_token = req.body.device_token;
                        player[0].platform = req.body.platform;

                        console.log("Fahad");
                        player[0].is_super_user = !!player[0].is_super_user;

                        return res.status(200).json(
                          success("Social Login Successfull", {
                            token: token,
                            Player: player[0],
                          })
                        );
                      } else {
                        return res
                          .status(404)
                          .json(error("Social Login Unsuccessfull", err));
                      }
                    }
                  );
                } else {
                  player[0].is_super_user = !!player[0].is_super_user;

                  return res.status(200).json(
                    success("Social Login Successfull", {
                      token: token,
                      Player: player[0],
                    })
                  );
                }
              } else {
                return res
                  .status(404)
                  .json(error("Social Login Unsuccessfull", {}));
              }
            }
          );
        } else if (social_player.length < 1) {
          const newPlayer = new Player({
            email: !!req.body.email ? req.body.email : "",
            password: !!req.body.password ? req.body.password : "",
            user_name: req.body.user_name,
            full_name: req.body.full_name,
            mobile: !!req.body.mobile ? req.body.mobile : "",
            device_token: !!req.body.device_token ? req.body.device_token : "",
            platform: !!req.body.platform ? req.body.platform : "",
            is_super_user: !!req.body.is_super_user
              ? req.body.is_super_user
              : 0,
          });

          Player.Register(newPlayer, (err, data) => {
            if (!err) {
              const newid = data.insertId;
              const newsocialplayer = new SocialPlayer({
                player_id: newid,
                social_platform: req.body.social_platform,
                social_id: req.body.social_id,
                social_name: req.body.full_name,
              });
              SocialPlayer.AddNewSocialPlayer(
                newsocialplayer,
                (err, _registeredSocialPlayerData) => {
                  if (!err) {
                    const token = jwt.sign(
                      {
                        Email: newPlayer.email,
                        UserName: newPlayer.user_name,

                        idUser: newid, /// this id is use to new query
                      },
                      process.env.JWT_KEY,
                      {
                        expiresIn: "30d",
                      }
                    );

                    newPlayer.is_super_user = !!newPlayer.is_super_user;

                    return res.status(200).json(
                      success("Social Register Successfull", {
                        token: token,
                        Player: newPlayer,
                      })
                    );
                  } else {
                    return res
                      .status(500)
                      .json(
                        error(
                          "Some Error Occurred while Creating Social Player",
                          err
                        )
                      );
                  }
                }
              );
            } else {
              return res
                .status(500)
                .json(error("Some Error Occurred while Creating Player", err));
            }
          });
        }
      }
    );
  }
};
exports.Update_Profile = (req, res) => {
  console.log("API CALL  (Update_Profile)");
  if (!!req.body.id == false || !!req.file == false) {
    return res.status(411).json(error("image and id not provided", {}));
  } else {
    Player.UpdateImage(
      req.body.id,
      req.file,

      (err, _updateprofile) => {
        if (err) {
          return res.status(404).json(error("no updated image"));
        } else {
          return res.status(200).json(success("updated image"));
        }
      }
    );
  }
};
