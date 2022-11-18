import {Router} from 'express';
import { isLoggedIn,isNotLoggedIn } from '../middlewares.js';
import Sequelize from "../models/index.js";
import { QueryTypes } from 'sequelize';

export default class searchController{
    path="/search";
    router=Router();
    constructor(){
        this.initializeRoutes();
    }
    initializeRoutes(){
        const router = Router();
        router
        .get("/board",this.searchBoard)
        .get("/hit",this.searchHit)
        .get("/top4",this.searchTop4)
        .get("/count",this.count);
        this.router.use(this.path,router);
    }
    searchBoard=async(req,res,next)=>{
        try{
            const query = `select posts.id, posts.content,posts.title, boards.name, users.nickName, posts.clicked from posts inner join users on users.id = posts.userId inner join boards on boards.id = posts.boardId where posts.title LIKE "%${decodeURI(req.query.name)}%"`;
            const data = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
            for (let i = 0; i<data.length; i++){
                const query = `select * from likes where likes.PostId = "${data[i].id}"`;
                const data2 = await Sequelize.sequelize.query (query,{type:QueryTypes.SELECT});
                let newQuery = `select * from comments where postId="${data[i].id}"`;
                let newData = await Sequelize.sequelize.query(newQuery,{type:QueryTypes.SELECT});
                data[i].commentCount=newData.length;
                newQuery = `select * from subcomments where postId="${data[i].id}"`;
                newData = await Sequelize.sequelize.query(newQuery,{type:QueryTypes.SELECT});
                data[i].commentCount+=newData.length;
                data[i].like = data2.length;
                let flag;
                flag = data[i].content.search(/.*?<img.*?/g);
            
                if (flag==-1){
                    data[i].img=false;
                }
                else{
                    data[i].img=true;
                }
    
            }
            res.send({code:200,list:data});
        }
        catch(err){
            next(err);
        }
    
    }
    searchHit=async(req,res,next)=>{
        try{
            console.log("sdsd");
            const query = `select boards.name, COUNT(posts.id) as COUNT from boards inner join posts on posts.boardId=boards.id group by boards.name ORDER BY COUNT DESC LIMIT 10`;
            const data = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
            res.send({code:200,list:data});
        }
        catch(err){
            next(err);
        }
    
    }
    searchTop4=async(req,res,next)=>{
        try{
            const query = `select boards.name,boards.id, COUNT(posts.id) as COUNT from boards inner join posts on posts.boardId=boards.id group by boards.name ORDER BY COUNT DESC LIMIT 4`;
            const data = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
            // console.log("실행")
            for (let i=0; i< data.length; i++){
                const query2 = `select posts.createdAt, posts.userId, posts.clicked, posts.title, posts.id from posts where boardId ="${data[i].id} LIMIT 10"`;
                const data2 = await Sequelize.sequelize.query(query2,{type:QueryTypes.SELECT});
                data2.sort((a,b)=>{
                    return b.createdAt-a.createdAt;
                });
              
                for (let j=0 ;j <data2.length; j++){
                    const temp = await Sequelize.User.findOne({where:{id:data2[j].userId}});
                    data2[j].nickName = temp.nickName;
                    const query = `select count(*) as count from comments where postId="${data2[j].id}"`;
                    const response = await Sequelize.sequelize.query(query,{type:QueryTypes.SELECT});
                    const query2 = `select count(*) as count from subcomments where postId="${data2[j].id}"`;
                    const response2 = await Sequelize.sequelize.query(query2,{type:QueryTypes.SELECT});
                    data2[j].commentCount = response[0].count + response2[0].count;
                }
                data[i].posts=[];
                for (let j=0 ; j<data2.length;j++){
                    data[i].posts.push(data2[j]);
                }
            }
          
            res.send({list:data,code:200});
    
        }
        catch(err){
            next(err);
        }
    }
    count=async(req,res,next)=>{
        try{
            const data = await Sequelize.UserCount.findAll({where:{}});
            res.send({code:200,count:data.length});
        }
        catch(err){
            next(err);
        }
    }
}




