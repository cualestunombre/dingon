import express, {Router} from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import passportConfig from "./passport/index.js";
import webSocket from "./socket.js";
import Sequelize from "./models/index.js";
export default class App{
    sever;
    constructor(controllers){
        this.app = express();
        dotenv.config();
        this.sessionMiddleware=session({
            resave: true,
            saveUninitialized: true,
            secret: process.env.COOKIE_SECRET,
            cookie: {
              httpOnly: true,
              secure: false,
              maxAge: 100000000000,
            },
        });
        passportConfig();
        this.initializeMiddlewares();
        this.connectDB();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }
    connectDB(){
        Sequelize.sequelize
        .sync({ alter:true })
        .then(() => {
            console.log("데이터베이스 연결 성공했습니다");
        })
        .catch((err) => {
            console.error(err);
        }); // DB연결
    }
    initializeMiddlewares(){
        this.app.use(morgan("dev"));
        this.app.use(this.sessionMiddleware);
        this.app.use("/uploads",express.static("uploads"));
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cookieParser(process.env.COOKIE_SECRET));
        this.app.use(cors({
            origin: ["http://localhost:3000"],
            credentials: true,
            optionsSuccessStatus: 200,
          }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
    }
    initializeErrorHandling(){
        this.app.use((req,res,next)=>{
            res.send({code:404});
        });
        this.app.use((err,req,res,next)=>{
            console.error(err);
            res.send({code:500});
        });
    }
    initializeControllers(controllers){
        const router = Router();
        controllers.forEach((ele)=>{
            console.log(ele);
            router.use(ele.router);
        });
        this.app.use(router);
    }
    listen(){
        const port = 8050;
        this.server=this.app.listen(port,async()=>{
            await Sequelize.UserCount.destroy({ where: {} });
        });
        webSocket(this.server,this.getServer(),this.sessionMiddleware);
    }
    getServer(){
        return this.app;
    }
    

}