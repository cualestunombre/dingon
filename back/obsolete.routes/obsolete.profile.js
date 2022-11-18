const express = require("express");
const router = express.Router();
const {Board,User} = require("../models");
const {isLoggedIn,isNotLoggedIn} = require("./middlewares");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
const bcrypt = require("bcrypt");
router.patch("/",isLoggedIn,async(req,res,next)=>{
    try{
        const hash = await bcrypt.hash(req.body.password, 12);
        await User.update({nickName:req.body.nickName,password:hash},{where:{id:req.user.id}});
        res.send({code:200});
    }
    catch(err){
        next(err);
    }
});






module.exports = router; 