const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const session = require("express-session");
const dotenv = require("dotenv");
const { sequelize } = require("./models");
const { User } = require("./models");
const bcrypt = require("bcrypt");
const app = express();
dotenv.config();
const cors = require("cors");
const sessionMiddleware = session({
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
    maxAge: 100000000000,
  },
});
const passport = require("passport");
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("데이터베이스 연결 성공했습니다");
  })
  .catch((err) => {
    console.error(err);
  }); // DB연결

const passportConfig = require("./passport");
const authRouter = require("./routes/auth");
const searchRouter = require("./routes/search");
const postRouter = require("./routes/post");
passportConfig();
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(sessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use((req, res, next) => {
  console.log(req.user);
  next();
});
app.get("/", (req, res) => {
  res.send({ code: "안녕하세요 저는 우석우 입니다" });
});
app.use("/auth",authRouter);
app.use("/search",searchRouter);
app.use("/post",postRouter);
app.use((req, res, next) => {
  res.send({ code: 404 });
});
app.use((err, req, res, next) => {
  console.error(err);
  res.send({ code: 500 });
});

app.listen(8050, async () => {
  console.log("실행");
});
