const userRouter = require("express").Router();
const UserController = require("../controllers/userController");

userRouter.use("/register", UserController.createUser);
userRouter.use("/login", UserController.loginUser);
userRouter.use("/logout", UserController.logout);

module.exports = userRouter;
