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
    const agent =request.agent(app);
    await request(app).post("/auth/signup").send({email:"1dilumn0@gmail.com",password:"dntjrdn78",nickName:"정지웅"});
    await agent.post("/auth/signup").send({email:"dntjrdn78@naver.com",password:"dntjrdn78",nickName:"우석우"});
    await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    await agent.post("/gallery/add").send({name:"야구"});
    await agent.post("/post/uploads").send({board:"야구",title:"lg가 우승한다",content:"당연한사실"});
});

describe('POST /comment', () => {
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("성공적인 댓글 작성",async()=>{
        await agent.post("/comment").send({comment:"안녕",postId:1}).expect({code:200});
    });
    test("없는 글에 댓글 작성",async()=>{
        await agent.post("/comment").send({comment:"안녕",postId:2}).expect({code:400});
    });
});
describe('DELETE /comment',()=>{
    const agent = request.agent(app);
    const secondAgent = request.agent(app);
    beforeEach(async()=>{
        await secondAgent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("자기가 작성하지 않은 댓글 삭제 시도",async()=>{
        await agent.post("/auth/login").send({email:"1dilumn0@gmail.com",password:"dntjrdn78"});
        await agent.delete(`/comment?commentId=1`).expect({code:400});
    });
    test("없는 댓글 삭제 시도",async()=>{
        await secondAgent.delete(`/comment?commentId=2`).expect({code:400});
    });
    test("정상적인 댓글 삭제",async()=>{
        await secondAgent.delete("/comment?commentId=1").expect({code:200});
        //댓글 불러오기 - 삭제 된 지 확인
        await secondAgent.get(`/comment/list?page=1&postId=1`).expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200 || res.list.length!=0){
                throw new Error("테스트 실패");
            }
        });
        await secondAgent.post("/comment").send({comment:"안녕",postId:1});
    });
});
describe('POST /comment/sub',()=>{
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("대댓글 작성 성공",async()=>{
        await agent.post("/comment/sub").send({comment:"안녕",postId:1,commentId:2}).expect({code:200});
    });
    test("없는 댓글에 대한 대댓글 작성",async()=>{
        await agent.post("/comment/sub").send({comment:"안녕",postId:1,commentId:1}).expect({code:400});
    });
    test("없는 게시판에 대한 대댓글 작성",async()=>{
        await agent.post("/comment/sub").send({comment:"안녕",postId:2,commentId:2}).expect({code:400});
    });
});

describe('GET /comment/list',()=>{
    test("없는 글의 댓글 불러오기",async()=>{
        await request(app).get("/comment/list?page=1&postId=2").expect({code:400});
    });
    test("댓글과 대댓글 불러오기",async()=>{
        await request(app).get("/comment/list?page=1&postId=1").expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200 || res.list[0].subcomment.length!=1 || res.list.length!=1){
                throw new Error("테스트 실패");
            }
        });
    });
});
describe(`DELETE /comment/sub`,()=>{
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("자기가 작성하지 않은 대댓글 삭제 시도",async()=>{
        const secondAgent = request.agent(app);
        await secondAgent.post("/auth/login").send({email:"1dilumn0@gmail.com",password:"dntjrdn78"});
        await secondAgent.delete("/comment/sub?commentId=1").expect({code:400});
    });
    test("없는 대댓글 삭제 시도",async()=>{
        await agent.delete("/comment/sub?commentId=3").expect({code:400});
    });
    test("성공적인 대댓글 삭제",async()=>{
        await agent.delete("/comment/sub?commentId=1").expect({code:200});
        //삭제 됐는지 확인
        await agent.get("/comment/list?postId=1&page=1").expect((data)=>{
            const res = JSON.parse(data.text);
            if (res.code!=200 || res.list[0].subcomment.length!=0){
                throw new Error("테스트 실패");
            }
        });
    });
});


afterAll(async()=>{
    await Sequelize.sequelize.sync({force:true});
});