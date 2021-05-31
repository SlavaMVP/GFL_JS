const path = require("path");

const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const UserController = require("./controllers/userController");

const express = require("express");
const hbs = require("hbs");

const fsRoutes = require("./routes/fsRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

const PORT = process.env.PORT || 3000;

const PUB_DIR = path.join(__dirname, "public");
const USER_DIR = path.join(__dirname, "data"); //! хотел розшаить чтобы доставать ссылки на картинки

//const VIEWS_DIR = path.join(PUB_DIR, "views");
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
app.use(cookieParser());

//set user folder name for each query
app.use((req, res, next) => {
  const { userEmail } = req.cookies;
  res.userFolder = `data/user_${userEmail}`;
  next();
});

app.use(express.static(PUB_DIR));
app.use(express.static(USER_DIR)); //"/userfiles",

app.use(UserController.isValidUser);

/*
app.use((req, res, next) => {
  console.log(req.headers.cookie);
  console.log(req.cookies);
  next();
});
*/
app.use(fileUpload({ createParentPath: true }));

app.set("view engine", "hbs");
hbs.registerPartials(__dirname + "/views/partials");

app.use(urlEncodedParser);

app.use("/fs-manager", fsRoutes);
app.use("/user", userRoutes);
app.use((req, res) => {
  res.render("404");
});

//console.log(db);

app.listen(PORT);
