const UserModel = require("../models/userModel");
const fsModule = require("../models/fsModel");

exports.createUser = (req, res, next) => {
  const {
    method,
    body: { username, email, password },
  } = req;

  if (method === "GET") return res.render("register");
  if (username.trim() && email.trim() && password.trim()) {
    const newUser = new UserModel(username, email, password);

    UserModel.isUserExists(email)
      .then((user) => {
        return user[0];
      })
      .then((exists) => {
        if (!exists.length) {
          try {
            return newUser.registerUser();
          } catch (e) {
            console.log("save erro : ", e);
          }
        } else {
          console.log("not registered");
        }
      })
      .then(() => {
        fsModule.createUserFolder(email);
        res.cookie("userEmail", email, {
          httpOnly: true,
        });
        res.redirect("/fs-manager");
      })
      .catch((err) => {
        console.log("isExisitError: ", err);
      });
  } else {
    console.log(username, email, password);
  }
};

exports.loginUser = (req, res, next) => {
  const {
    method,
    body: { email, password },
  } = req;

  if (method === "GET") return res.render("login");

  if (email.trim() && password.trim()) {
    UserModel.loginUser(email, password)
      .then((user) => {
        return user[0];
      })
      .then((userData) => {
        if (userData) {
          UserModel.setUserToken({ ...userData[0] }.id);
          return userData;
        } else {
          res.render("login");
        }
      })
      .then(async (userData) => {
        userToken = "";
        if (userData.length !== 0) {
          userToken = await UserModel.getUserToken({ ...userData[0] }.id);
        }

        if (userToken) {
          res.cookie("token", userToken, {
            httpOnly: true,
          });
          res.cookie("userEmail", email, {
            httpOnly: true,
          });
          res.redirect("/fs-manager/");
        } else {
          res.render("login");
        }
      });
  } else {
    console.log("inputs must not be empty");
  }
};

exports.logout = (req, res, next) => {
  res.clearCookie("token");
  res.render("login");
};

exports.isValidUser = async (req, res, next) => {
  const url = req.url;
  const isValid = await UserModel.isTokenValid(req.cookies.token || "");
  if (isValid) {
    next();
  } else if (url !== "/user/login" && url !== "/user/register") {
    res.redirect("/user/login");
  } else {
    next();
  }
};
