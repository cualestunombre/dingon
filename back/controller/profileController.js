import {Router} from 'express';
import { isLoggedIn, isNotLoggedIn } from "../middlewares.js";
import Sequelize from "../models/index.js";
import bcrypt from "bcrypt";
export default class profileController{
    path="/profile";
    router=Router();
    constructor(){
        this.initializeRoutes();
    }
    initializeRoutes(){
        const router = Router();
        router
        .patch("/",isLoggedIn,this.changeProfile);
        this.router.use(this.path, router);
    }
    changeProfile=async(req,res,next)=>{
        try{
            const hash = await bcrypt.hash(req.body.password, 12);
            await Sequelize.User.update({nickName:req.body.nickName,password:hash},{where:{id:req.user.id}});
            res.send({code:200});
        }
        catch(err){
            next(err);
        }
    }
}


