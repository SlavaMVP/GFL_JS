const db = require("../config/DB");

module.exports = class UserModel {
  constructor(username, email, password) {
    this.name = username;
    this.email = email;
    this.password = password;
  }

  registerUser() {
    return db.execute("INSERT INTO users VALUES ( NULL,?, ?, SHA1(?),'')", [
      this.name,
      this.email,
      this.password,
    ]);
  }

  static loginUser(email, password) {
    return db.execute(
      "SELECT * FROM users WHERE users.email = ? and users.password = SHA1(?) LIMIT 1",
      [email, password]
    );
  }

  static logoutUser(id) {
    console.log("user logged out");
  }

  static createUsersFolder(id) {
    console.log("Folder created");
  }

  static async isUserExists(email) {
    const result = await db.execute(
      "SELECT * FROM users WHERE users.email = ? LIMIT 1",
      [email]
    );
    return result;
  }

  static async setUserToken(userId) {
    const result = await db.query(
      "UPDATE users SET token=SHA1(?) WHERE id=? LIMIT 1",
      [`${new Date().getTime()}`, userId]
    );

    return result;
  }

  static async getUserToken(userId) {
    const result = await db.execute(
      "SELECT token FROM users  WHERE id=? LIMIT 1",
      [userId]
    );
    return [...result[0]][0].token;
  }

  static async isTokenValid(token) {
    try {
      if (token) {
        const userToken = await db
          .execute("SELECT email, token FROM users WHERE token=? LIMIT 1", [
            token,
          ])
          .then((t) => {
            //console.log("t", [...t[0]]);
            return t[0];
          });
        return userToken;
      } else {
        return false;
      }
    } catch (err) {
      console.log("token check err");
      return false;
    }
  }
};
