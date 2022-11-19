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




describe("POST /auth/signup",()=>{
    test("로그인 안했을 때 회원가입",async()=>{
        await request(app)
        .post("/auth/signup")
        .send({
            email:"dntjrdn78@naver.com",
            password:"dntjrdn78",
            nickName:"우석우"
        })
        .expect(200,{code:200})
    });
});

describe("POST /auth/signup",()=>{
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent
            .post("/auth/login")
            .send({
                email:"dntjrdn78@naver.com",
                password:"dntjrdn78"
            })
    });
    test("이미 로그인 했을 때 회원가입",async()=>{
        await agent
        .post("/auth/signup")
        .send({
            email:"dbaltkd@naver.com",
            nickName:"yoohoo",
            password:"dntjrdn78"
        }).expect(200,{code:400})
    });
});

describe("POST /auth/login",()=>{
    const agent = request.agent(app);
    test("로그인 성공",async()=>{
        await agent
            .post("/auth/login")
            .send({
                email:"dntjrdn78@naver.com",
                password:"dntjrdn78"
            }).expect({code:200,user:{email:"dntjrdn78@naver.com",nickName:"우석우",userId:1}})
    }); 
    test("로그인된 상태에서 로그인 시도",async()=>{
        await agent
            .post("/auth/login").expect({code:400})
    });
    test("로그인 실패",async()=>{
        await request(app)
            .post("/auth/login").send({email:"dntjdn@naver.com",password:"dntjrdn"}).expect({code:400})
    })
});

describe("POST /auth/emailCheck",()=>{
    test("이미있는 이메일",async()=>{
        await request(app).post("/auth/emailCheck").send({email:"dntjrdn78@naver.com"}).expect({code:400});
    });
    test("존재하지 않는 이메일",async()=>{
        await request(app).post("/auth/emailCheck").send({email:"wjdwldnd@naver.com"}).expect({code:200});
    });
});

describe("POST /auth/logout",()=>{
    test("로그인 되어 있지 않은 상태에서 로그아웃",async()=>{
        await request(app).post("/auth/logout").expect({code:400});
    });
    test("로그아웃",async()=>{
        const agent = request.agent(app);
        await agent 
            .post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"})
        await agent.post("/auth/logout").expect({code:200});
    });
});
describe("GET /auth/isLoggedIn",()=>{
    test("로그인이 되어 있음",async()=>{
        const agent = request.agent(app);
        await agent
            .post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"})
        await agent.get("/auth/isLoggedIn").expect({code:200,nickName:"우석우",userId:1,email:"dntjrdn78@naver.com"});
    });
});
afterAll(async()=>{
    await Sequelize.sequelize.sync({force:true});
});