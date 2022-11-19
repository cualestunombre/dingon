
import Sequelize from "../models/index.js";
import {isLoggedIn,isNotLoggedIn} from '../middlewares.js';
import { QueryTypes } from 'sequelize';
import {Router} from 'express';
export default class CommentController{
    path="/comment";
    router = Router();
    constructor(){
        this.initializeRoutes();
    }
    initializeRoutes(){
        const router = Router();
        router
        .get("/list",this.getList)
        .post("/",isLoggedIn,this.createComment)
        .post("/sub",isLoggedIn,this.createSubComment)
        .delete("/",isLoggedIn,this.deleteComment)
        .delete("/sub",isLoggedIn,this.deleteSubComment);
        this.router.use(this.path, router);
        
    }
    getList=async(req,res,next)=>{
        try{
            const flag = await Sequelize.Post.findOne({where:{id:req.query.postId}});
            if (!flag) return res.send({code:400});
            const query = `select  comments.id ,users.id as userId, comments.content, comments.createdAt, users.nickName from comments inner join posts on posts.id = comments.postId inner join users on users.id = comments.userId where posts.id="${req.query.postId}" ORDER BY posts.createdAt DESC LIMIT 10 OFFSET ${(req.query.page-1)*10}`;
            const data = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
            for (let i=0;i<data.length;i++){
                const query2 = `select *, subcomments.id as ID , subcomments.createdAt as createdAt  from subcomments inner join users on users.id=subcomments.userId where subcomments.commentId="${data[i].id}" order by subcomments.createdAt DESC`;
                const data2 = await Sequelize.sequelize.query(query2,{type:QueryTypes.SELECT}); 
                data[i].subcomment= data2;
            }
            res.send({code:200,list:data});
        }
        catch(err){
            next(err);
        }
    }
    createComment=async(req,res,next)=>{
        try{
            const flag =await  Sequelize.Post.findOne({where:{id:req.body.postId}});
            if(!flag) return res.send({code:400});
            await Sequelize.Comment.create({content:req.body.comment,userId:req.user.id,postId:req.body.postId});
            res.send({code:200});
        }
        catch(err){
            next(err);
        }
    }
    createSubComment=async(req,res,next)=>{
        try{
            const flag = await Sequelize.Comment.findOne({where:{postId:req.body.postId, id:req.body.commentId}});
            if(!flag) return res.send({code:400});
            await Sequelize.SubComment.create({content:req.body.comment, userId:req.user.id, postId:req.body.postId,commentId:req.body.commentId});
            res.send({code:200});
        }
        catch(err){
            next(err);
        }
    }
    deleteComment=async(req,res,next)=>{
        try{
            const data = await Sequelize.Comment.findAll({where:{userId:req.user.id, id:req.query.commentId }});
            if (data.length==0){
                res.send({code:400});
            }
            else{
                await Sequelize.Comment.destroy({where:{id:req.query.commentId}});
                res.send({code:200});
            }
        }
        catch(err){
            next(err);
        }
    }
    deleteSubComment=async(req,res,next)=>{
        try{
            const data = await Sequelize.SubComment.findAll({where:{userId:req.user.id, id:req.query.commentId}});
            if(data.length==0){
                res.send({code:400 });
            }
            else{
                await Sequelize.SubComment.destroy({where:{id:req.query.commentId}});
                res.send({code:200});
            }
        }
        catch(err){
            next(err);
        }
    }

}






