import User from "../models/users.js";
import bcrypt from "bcrypt";
import passport from "passport";
import {Router} from 'express';
import { isLoggedIn, isNotLoggedIn } from "../middlewares.js";
export default class AuthController{
  path="/auth";
  router = Router();
  constructor(){
    this.initializeRoutes();
  }
  initializeRoutes(){
    const router = Router();
    router
    .post("/signup",isNotLoggedIn,this.signup)
    .post("/login",isNotLoggedIn,this.login)
    .post("/emailCheck",isNotLoggedIn,this.emailCheck)
    .post("/nickNameCheck",this.nickNameCheck)
    .post("/logout",isLoggedIn,this.logout)
    .get("/isLoggedIn",this.checkLogin);
    this.router.use(this.path, router);

  }
  signup = async(req,res,next)=>{
    const { email, nickName, password } = req.body;
    try {
      const exUser = await User.findOne({ raw:true, where: { email } });
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
  }
  login = async (req, res, next) => {
    passport.authenticate("local", (authError, user, info) => {
      
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
  }
  emailCheck=async (req, res, next) => {
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
  }
  nickNameCheck = async (req, res, next) => {
    try {
      //비동기 처리 및 변수 바꿈
      const Userdata = await User.findOne({
        where: { nickName: req.body.nickName },
      });

      if (Userdata) {
        res.send({ code: 400 });
      } else {
        res.send({ code: 200 });
      }
    } catch (err) {
      next(err);
    }
  }
  logout = (req, res, next) => {
    req.logout();
    req.session.destroy();
    res.send({ code: 200 });
  };
  checkLogin = (req, res, next) => {
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
  };

  
}





