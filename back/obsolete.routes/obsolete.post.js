const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {isLoggedIn,isNotLoggedIn} = require("./middlewares");
const {v4:uuidv4} = require("uuid");
const {Post,User,Postmedia,Board,Like, Dislike,Concept} = require("../models");
const { QueryTypes } = require('sequelize');
const { sequelize } = require("../models");
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, uuidv4() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024*1024*1024 },
});

router.post("/uploads",isLoggedIn,async(req,res,next)=>{
    try{
        const num=await Board.findOne({raw:true,where:{name:req.body.board}});
        const data = await Post.create({userId:req.user.id,boardId:num.id,title:req.body.title,content:req.body.content});
        res.send({code:200});
    }
    catch(err){
        next(err);
    }
});
router.post("/img",isLoggedIn,upload.single("files"),async(req,res,next)=>{
    try{
     
        res.send({code:200, url:"http://localhost:8050/"+req.file.path});
    }
    catch(err){
        next(err);
    }
});
router.get("/content",async(req,res,next)=>{
    try{
        //post:{content, clicked, createdAt,nickName, title,userId}}
        const num = await Post.findOne({where:{id:req.query.postId}});
        await Post.update({clicked:num.clicked+1},{where:{id:req.query.postId}});
        const query = `select posts.title, posts.content, posts.clicked, posts.createdAt, users.nickName, users.id as userId from posts inner join users on posts.userId=users.id where posts.id="${req.query.postId}"`;
        const data = await sequelize.query(query,QueryTypes.SELECT);
        const query2 = `select count(*) as count from comments where postId="${req.query.postId}}"`;
        const response = await sequelize.query(query2,{type:QueryTypes.SELECT});
        const query3 = `select count(*) as count from subcomments where postId="${req.query.postId}"`;
        const response2 = await sequelize.query(query3,{type:QueryTypes.SELECT});
        let newQuery = `select count(*) as count from likes where PostId="${req.query.postId}"`;
        let newResponse = await sequelize.query(newQuery,{type:QueryTypes.SELECT});
        data[0][0].like = newResponse[0].count;
        newQuery = `select count(*) as count from dislikes where PostId="${req.query.postId}"`;
        newResponse = await sequelize.query(newQuery,{type:QueryTypes.SELECT});
        data[0][0].dislike = newResponse[0].count;
        data[0][0].commentCount = response[0].count + response2[0].count;
        data[0][0].total = response[0].count;
        res.send(data[0][0]);
    }
    catch(err){
        next(err);
    }
});
router.patch("/update",isLoggedIn,async(req,res,next)=>{
    try{
        const post = await Post.findOne({raw:true,where:{id:req.body.postId}});
        if(req.user&&post.userId!=req.user.id){
            return res.send({code:400});
        }
        const data = await Post.update({title:req.body.title,content:req.body.content},{where:{id:req.body.postId}});
        res.send({code:200});
    }
    catch(err){
        next(err);
    }
});
router.delete("/delete",isLoggedIn,async(req,res,next)=>{
    try{
        const post = await Post.findOne({raw:true,where:{id:req.query.postId}});
        if(req.user&&post.userId!=req.user.id){
            return res.send({code:400});
        }
        await Post.destroy({where:{id:req.query.postId}});
        res.send({code:200});
    }
    catch(err){
        next(err);
    }
});
router.get("/my",isLoggedIn,async(req,res,next)=>{
    try{
        //list:{title, clicked, createdAt, gallery(게시판 이름)
        const query = `select posts.id, posts.title, posts.clicked, posts.createdAt, boards.name as gallery from posts inner join boards on posts.boardId=boards.id where posts.userId="${req.user.id}"`;
        const data =await sequelize.query(query,{type:QueryTypes.SELECT});
        for (let i = 0 ; i<data.length;i++){
            const query = `select * from likes where PostId="${data[i].id}"`;
            const data2 = await sequelize.query(query,{type:QueryTypes.SELECT});
            data[i].like = data2.length;
        }
        res.send({code:200,list:data});
    }
    catch(err){
        next(err);
    }
});
router.post("/like",isLoggedIn,async(req,res,next)=>{
    try{
        const data = await Like.findAll({where:{UserId:req.user.id,PostId:req.body.postId}});
        if (data.length!=0){
            return res.send({code:400});
        }
        await Like.create({UserId:req.user.id,PostId:req.body.postId});
        
        const response = await Like.findAll({raw:true,where:{PostId:req.body.postId}});
        if(response.length>=5){
            const flag = await  Concept.findAll({raw:true,where:{PostId:req.body.postId}});
            if (flag.length==0){
                const info = await Post.findOne({raw:true,where:{id:req.body.postId}});
                await Concept.create({BoardId:info.boardId,PostId:req.body.postId});
            }
        }
        res. send({code:200});
    }
    catch(err){
        next(err);
    }
});
router.post("/dislike",isLoggedIn,async(req,res,next)=>{
    try{
        const data = await Dislike.findAll({where:{UserId:req.user.id,PostId:req.body.postId}});
        if (data.length!=0){
            return res.send({code:400});
        }
        await Dislike.create({UserId:req.user.id,PostId:req.body.postId});
        res. send({code:200});
    }
    catch(err){
        next(err);
    }
});
router.get("/list",async(req,res,next)=>{
    try{
        const query = `select *,posts.id as postId from posts inner join boards on posts.boardId = boards.id inner join users on users.id = posts.userId inner join concepts on concepts.PostId = posts.id where boards.name="${decodeURI(req.query.name)}" ORDER BY posts.createdAt DESC LIMIT 10 OFFSET ${(req.query.page-1)*10}`;
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

module.exports = router;