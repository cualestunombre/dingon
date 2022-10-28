const express = require("express");
const router = express.Router();
const { User } = require("../models");
const passport = require("passport");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const bcrypt = require("bcrypt");
router.post("/signup", isNotLoggedIn, async (req, res, next) => {
  const { email, nickName, password } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.send({ code: 400 }); // 실패
    }
    const hash = await bcrypt.hash(password, 12);
    await User.create({
      email,
      nickName,
      password: hash,
    });
    return res.send({ code: 200 }); //성공
  } catch (error) {
  
    return next(error);
  }
});
// passport.authenticate의 구조
// passport.authenticate = (a,callback)=>{
//  return (req,res,next) =>{ 특정 동작 수행}
//} a(c,d)(req,res,next) -> 커링 함수
router.post("/login", isNotLoggedIn, async (req, res, next) => {
  passport.authenticate("local", (authError, user, info) => {
    if (info) {
      console.log(info);
    }
    if (authError) {
      console.error(authError);
      return res.send({ code: 400 });
    }
    if (!user) {
      return res.send({ code: 400 });
    }
    return req.login(user, (loginError) => {
      if (loginError) {
        console.error(loginError);
        return res.send({ code: 400 });
      }
      return res.send({
        code: 200,
        user: {
          nickName: req.user.nickName,
          email: req.user.email,
          userId: req.user.id,
        },
      });
    });
  })(req, res, next);
});
router.post("/logout", isLoggedIn, (req, res, next) => {
  req.logout();
  req.session.destroy();
  res.send({ code: 200 });
});
router.post("/emailCheck", isNotLoggedIn, async (req, res, next) => {
  try {
    //비동기 처리 및 변수 바꿈
    const Userdata = await User.findOne({ where: { email: req.body.email } });

    if (Userdata) {
      res.send({ code: 400 });
    } else {
      res.send({ code: 200 });
    }
  } catch (err) {
    next(err);
  }
});
router.post("/nickNameCheck", async (req, res, next) => {
  try {
    //비동기 처리 및 변수 바꿈
    const Userdata = await User.findOne({
      where: { nickName: req.body.nickName },
    });
    console.log( req.body.nickName, Userdata )
    if (Userdata) {
      res.send({ code: 400 });
    } else {
      res.send({ code: 200 });
    }
  } catch (err) {
    next(err);
  }
});
router.get("/isLoggedIn", (req, res, next) => {
  if (req.user) {
    res.send({
      code: 200,
      nickName: req.user.nickName,
      userId: req.user.id,
      email: req.user.email,
    });
  } else {
    res.send({ code: 400 });
  }
});
module.exports = router;
