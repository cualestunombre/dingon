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
beforeAll(async()=>{
    await request(app).post("/auth/signup").send({email:"dntjrdn78@naver.com",nickName:"우석우",password:"dntjrdn78"}).expect({code:200});
});

describe('POST /gallery/add', () => {
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("정상적인 갤러리 생성",async()=>{
        await agent.post("/gallery/add").send({name:"야구"}).expect({code:200});
    });
    test("이미 있는 갤러리 생성",async()=>{
        await agent.post("/gallery/add").send({name:"야구"}).expect({code:400});
    });
    test("로그인이 되지 않은 상태에서 갤러리 생성 시도",async()=>{
        await request(app).post("/gallery/add").send({name:"야구"}).expect({code:400});
    });
});
describe('GET /gallery/Info',()=>{
    test("갤러리 정보 가져오기",async()=>{
        await request(app).get(`/gallery?name=${encodeURI("야구")}`).expect({code:200,cnt:0,concept:0});
    });
    test("없는 갤러리의 정보 가져오기",async()=>{
        await request(app).get(`/gallery?name=${encodeURI("요리")}`).expect({code:400});
    });
});
describe("GET /gallery/check",()=>{
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("갤러리가 존재할 때",async()=>{
        await agent.get(`/gallery/check?name=${encodeURI("야구")}`).expect({code:400});
    });
    test("해당 갤러리가 존재하지 않을 때",async()=>{
        await agent.get(`/gallery/check?name=${encodeURI("농구")}`).expect({code:200});
    });
});
describe("GET /gallery/all",()=>{
    test("모든 갤러리의 리스트를 가져 옴",async()=>{
        await request(app).get("/gallery/all").expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200 || res.list.length!=1){
                throw new Error("테스트 실패");
            }
        });
    });
});
describe("GET /gallery/list",()=>{
    test("해당 갤러리의 게시글 리스트를 가져옴",async()=>{
        await request(app).get(`/gallery/list?name=${encodeURI("야구")}&page=1`).expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200 || res.list.length!=0){
                throw new Error("테스트 실패");
            }
        });
    });
});


afterAll(async()=>{
    await Sequelize.sequelize.sync({force:true});
});