import request from "supertest";
import App from "../app.js";
import AuthController from "../controller/authController.js";
import CommentController from "../controller/commentController.js";
import GalleryController from "../controller/galleryController.js";
import PostController from "../controller/postController.js";
import ProfileController from "../controller/profileController.js";
import SearchController from "../controller/searchContoller.js";
import Sequelize from "../models/index.js"
const connectApp = new App([
    new AuthController(),
    new CommentController(),
    new GalleryController(),
    new PostController(),
    new ProfileController(),
    new SearchController()

]);
const app=connectApp.getServer();

describe('PATCH /profile', () => {
    const agent = request.agent(app);
    test("닉네임 및 프로필 변경",async()=>{
        await agent.post("/auth/signup").send({email:"dntjrdn78@naver.com",password:"dntjrdn78",nickName:"우석우"});
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
        await agent.patch("/profile").send({nickName:"tiger",password:"tjrdn7878"}).expect({code:200});
    });
});
afterAll(async()=>{
    await Sequelize.sequelize.sync({force:true});
});