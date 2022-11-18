import multer from "multer";
import path from "path";
import{isLoggedIn,isNotLoggedIn} from "../middlewares.js";
import {v4 as uuidv4} from "uuid";
import {Router} from 'express';
import Sequelize from "../models/index.js";
import { QueryTypes } from 'sequelize';

export default class postController{
    path="/post";
    router=Router();
    upolad;
    constructor(){
        
        this.upload=multer({
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
        this.initializeRoutes();
    }
    initializeRoutes(){
        
        const router = Router();
        router
        .post("/uploads",isLoggedIn,this.uploadPost)
        .post("/img",isLoggedIn,this.upload.single("files"),this.uploadImg)
        .get("/content",this.getContent)
        .patch("/update",isLoggedIn,this.updatePost)
        .delete("/delete",isLoggedIn,this.deletePost)
        .get("/my",isLoggedIn,this.myPost)
        .post("/like",isLoggedIn,this.like)
        .post("/dislike",isLoggedIn,this.dislike)
        .get("/list",this.postList);
        this.router.use(this.path, router);
    }
    uploadPost=async(req,res,next)=>{
        try{
            const num=await Sequelize.Board.findOne({raw:true,where:{name:req.body.board}});
            const data = await Sequelize.Post.create({userId:req.user.id,boardId:num.id,title:req.body.title,content:req.body.content});
            res.send({code:200});
        }
        catch(err){
            next(err);
        }
    }
    uploadImg=async(req,res,next)=>{
        try{
            res.send({code:200, url:"http://localhost:8050/"+req.file.path});
        }
        catch(err){
            next(err);
        }
    }
    getContent=async(req,res,next)=>{
        try{
            //post:{content, clicked, createdAt,nickName, title,userId}}
            const num = await Sequelize.Post.findOne({where:{id:req.query.postId}});
            await Sequelize.Post.update({clicked:num.clicked+1},{where:{id:req.query.postId}});
            const query = `select posts.title, posts.content, posts.clicked, posts.createdAt, users.nickName, users.id as userId from posts inner join users on posts.userId=users.id where posts.id="${req.query.postId}"`;
            const data = await Sequelize.sequelize.query(query,QueryTypes.SELECT);
            const query2 = `select count(*) as count from comments where postId="${req.query.postId}}"`;
            const response = await Sequelize.sequelize.query(query2,{type:QueryTypes.SELECT});
            const query3 = `select count(*) as count from subcomments where postId="${req.query.postId}"`;
            const response2 = await Sequelize.sequelize.query(query3,{type:QueryTypes.SELECT});
            let newQuery = `select count(*) as count from likes where PostId="${req.query.postId}"`;
            let newResponse = await Sequelize.sequelize.query(newQuery,{type:QueryTypes.SELECT});
            data[0][0].like = newResponse[0].count;
            newQuery = `select count(*) as count from dislikes where PostId="${req.query.postId}"`;
            newResponse = await Sequelize.sequelize.query(newQuery,{type:QueryTypes.SELECT});
            data[0][0].dislike = newResponse[0].count;
            data[0][0].commentCount = response[0].count + response2[0].count;
            data[0][0].total = response[0].count;
            console.log(data[0][0]);
            res.send(data[0][0]);
        }
        catch(err){
            next(err);
        }
    }
    updatePost =async(req,res,next)=>{
        try{
            const post = await Sequelize.Post.findOne({raw:true,where:{id:req.body.postId}});
            if(req.user&&post.userId!=req.user.id){
                return res.send({code:400});
            }
            const data = await Sequelize.Post.update({title:req.body.title,content:req.body.content},{where:{id:req.body.postId}});
            res.send({code:200});
        }
        catch(err){
            next(err);
        }
    }
    deletePost = async(req,res,next)=>{
        try{
            const post = await Sequelize.Post.findOne({raw:true,where:{id:req.query.postId}});
            if(req.user&&post.userId!=req.user.id){
                return res.send({code:400});
            }
            await Sequelize.Post.destroy({where:{id:req.query.postId}});
            res.send({code:200});
        }
        catch(err){
            next(err);
        }
    }
    myPost = async(req,res,next)=>{
        try{
            //list:{title, clicked, createdAt, gallery(게시판 이름)
            const query = `select posts.id, posts.title, posts.clicked, posts.createdAt, boards.name as gallery from posts inner join boards on posts.boardId=boards.id where posts.userId="${req.user.id}"`;
            const data =await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
            for (let i = 0 ; i<data.length;i++){
                const query = `select * from likes where PostId="${data[i].id}"`;
                const data2 = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
                data[i].like = data2.length;
            }
            res.send({code:200,list:data});
        }
        catch(err){
            next(err);
        }
    }
    like=async(req,res,next)=>{
        try{
            const data = await Sequelize.Like.findAll({where:{UserId:req.user.id,PostId:req.body.postId}});
            if (data.length!=0){
                return res.send({code:400});
            }
            await Sequelize.Like.create({UserId:req.user.id,PostId:req.body.postId});
            
            const response = await Sequelize.Like.findAll({raw:true,where:{PostId:req.body.postId}});
            if(response.length>=5){
                const flag = await  Sequelize.Concept.findAll({raw:true,where:{PostId:req.body.postId}});
                if (flag.length==0){
                    const info = await Sequelize.Post.findOne({raw:true,where:{id:req.body.postId}});
                    await Sequelize.Concept.create({BoardId:info.boardId,PostId:req.body.postId});
                }
            }
            res. send({code:200});
        }
        catch(err){
            next(err);
        }
    }
    dislike=async(req,res,next)=>{
        try{
            const data = await Sequelize.Dislike.findAll({where:{UserId:req.user.id,PostId:req.body.postId}});
            if (data.length!=0){
                return res.send({code:400});
            }
            await Sequelize.Dislike.create({UserId:req.user.id,PostId:req.body.postId});
            res. send({code:200});
        }
        catch(err){
            next(err);
        }
    }
    postList=async(req,res,next)=>{
        try{
            const query = `select *,posts.id as postId from posts inner join boards on posts.boardId = boards.id inner join users on users.id = posts.userId inner join concepts on concepts.PostId = posts.id where boards.name="${decodeURI(req.query.name)}" ORDER BY posts.createdAt DESC LIMIT 10 OFFSET ${(req.query.page-1)*10}`;
            const data = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
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
                const response = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
                const query2 = `select count(*) as count from subcomments where postId="${data[i].postId}"`;
                const response2 = await Sequelize.sequelize.query(query2,{type:QueryTypes.SELECT});
                const query3 = `select count(*) as count from likes where PostId="${data[i].postId}"`;
                const response3 = await Sequelize.sequelize.query(query3,{type:QueryTypes.SELECT});
                data[i].like= response3[0].count;
                data[i].commentCount = response[0].count+response2[0].count;
                
            }
            res.send({code:200,list:data});
        }
        catch(err){
            next(err);
        }
    }

}









