const express = require("express");
const router = express.Router();
const {Board} = require("../models");
const {isLoggedIn,isNotLoggedIn} = require("./middlewares");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");

router.get("/",async (req,res,next)=>{
    try{
        const data = await Board.findOne({raw:true,where:{name:decodeURI(req.query.name)}});
        if (!data){
            res.send({code:400})
        }
        else{
            const query = `select * from posts inner join boards on posts.boardId = boards.id where boards.name="${decodeURI(req.query.name)}" `;
            const data = await sequelize.query(query,{type:QueryTypes.SELECT});
            const query2 = `select * from concepts inner join boards on concepts.boardId = boards.id where boards.name="${decodeURI(req.query.name)}"`;
            const data2 = await sequelize.query(query2,{type:QueryTypes.SELECT});
            res.send({code:200,cnt:data.length,concept:data2.length});
        }
    }
    catch(err){
        next(err);
    }
    
});
router.get("/list",async(req,res,next)=>{
    try{
        const query = `select *,posts.id as postId, posts.createdAt as createdAt  from posts inner join boards on posts.boardId = boards.id inner join users on users.id = posts.userId where boards.name="${decodeURI(req.query.name)}" ORDER BY posts.createdAt DESC LIMIT 10 OFFSET ${(req.query.page-1)*10}`;
        const data = await sequelize.query(query,{type:QueryTypes.SELECT});
        data.forEach(ele=>{
            let flag;
            flag = ele.content.search(/.*?<img.*?/g);
        
            if (flag==-1){
                ele.img=false;
            }
            else{
                ele.img=true;
            }
        });
        for (let i=0; i<data.length; i++){
            const query = `select count(*) as count from comments where postId="${data[i].postId}"`;
            const response = await sequelize.query(query,{type:QueryTypes.SELECT});
            const query2 = `select count(*) as count from subcomments where postId="${data[i].postId}"`;
            const response2 = await sequelize.query(query2,{type:QueryTypes.SELECT});
            const query3 = `select count(*) as count from likes where PostId="${data[i].postId}"`;
            const response3 = await sequelize.query(query3,{type:QueryTypes.SELECT});
            data[i].like= response3[0].count;
            data[i].commentCount = response[0].count+response2[0].count;
        }
        res.send({code:200,list:data});
    }
    catch(err){
        next(err);
    }
});

router.get("/all",async(req,res)=>{
    try{
        const query = `select name from boards order by name`;
        const data = await sequelize.query(query,{type:QueryTypes.SELECT});
        res.send({code:200,list:data});
    }
    catch(err){
        next(err);
    }
});

router.get("/check", isLoggedIn, async(req,res)=>{
   
    try{
        const name = decodeURI(req.query.name);
        const data = await Board.findAll({where:{name:name}});
    
        if(data.length==0){
            res.send({code:200});
        }
        else{
            res.send({code:400});
        }
    }
    catch(err){
        next(err);
    }
});

router.post("/add",isLoggedIn,async(req,res,next)=>{
    try{
        const name = req.body.name;
        const data = await Board.create({name:name});
        res.send({code:200});
    }
    catch(err){
        next(err);
    }
});
module.exports=router;