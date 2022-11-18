const express = require("express");
const router = express.Router();
const { isLoggedIn, isNotLoggedIn } = require("../middlewares");
const {signup,login,emailCheck,logout,nickNameCheck,checkLogin} = require("../controller/authController");
router.post("/signup", isNotLoggedIn, signup);
// passport.authenticate의 구조
// passport.authenticate = (a,callback)=>{
//  return (req,res,next) =>{ 특정 동작 수행}
//} a(c,d)(req,res,next) -> 커링 함수
router.post("/login", isNotLoggedIn,login);
router.post("/logout", isLoggedIn, logout);
router.post("/emailCheck", isNotLoggedIn, emailCheck);
router.post("/nickNameCheck", nickNameCheck);
router.get("/isLoggedIn", checkLogin);
module.exports = router;
