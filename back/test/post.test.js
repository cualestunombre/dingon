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
    const agent=request.agent(app);
    await request(app).post("/auth/signup").send({email:"dntjrdn78@naver.com",nickName:"우석우",password:"dntjrdn78"});
    await request(app).post("/auth/signup").send({email:"1dilumn0@gmail.com",nickName:"김민석",password:"dntjrdn78"}); 
    await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    await agent.post("/gallery/add").send({name:"야구"});

});

describe('POST /post/uploads', () => {
    const agent = request.agent(app);
    test("정상적인 게시글 업로드",async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
        await agent.post("/post/uploads").send({board:"야구",title:"lg가 우승한다",content:"당연한사실"}).expect({code:200});
        //업로드한 글을 갤러리 정보로 불러오기
        await agent.get(`/gallery/list?name=${encodeURI("야구")}&page=1`).expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200 || res.list.length!=1){
                throw new Error("테스트 실패");
            }
        });
    });
});
describe('GET /post/content',()=>{
    const agent = request.agent(app);
    test("게시글 내용 불러오기",async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
        await agent.get(`/post/content?postId=1`).expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200){
                throw new Error("테스트 실패");
            }
        });
    });
    test("없는 게시글 불러오기",async()=>{
        await agent.get("/post/content?postId=100").expect({code:400});
    });
});
describe('PATCH /post/update',()=>{
    const agent = request.agent(app);
    const secondAgent = request.agent(app);
    test("자기가 쓰지 않은 글을 수정",async()=>{
        await secondAgent.post("/auth/login").send({email:"1dilumn0@gmail.com",password:"dntjrdn78"});
        await secondAgent.patch("/post/update").send({postId:1,title:"뭐하니",content:"수정된 내용"}).expect({code:400});
    });
    test("자기가 쓴 글을 수정",async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
        await agent.patch("/post/update").send({postId:1,title:"뭐하니",content:"수정된 내용"}).expect({code:200});
        //쓴 글 불러오기
        await agent.get("/post/content?postId=1").expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200){
                throw new Error("테스트 실패");
            }
        });
    });
});
describe("DELETE /post/delete",()=>{
    const agent = request.agent(app);
    const secondAgent = request.agent(app);
    test("자기가 쓰지 않은 글을 삭제",async()=>{
        await secondAgent.post("/auth/login").send({email:"1dilumn0@gmail.com",password:"dntjrdn78"});
        await secondAgent.delete(`/post/delete?postId=${1}`).expect({code:400});
    });
    test("자기가 쓴 글을 삭제",async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
        await agent.delete("/post/delete?postId=1").expect({code:200});
        // 다시 글을 불러 오면 없어야 함
        await agent.get("/post/content?postId=1").expect({code:400});
        //다시 생성
        await agent.post("/post/uploads").send({board:"야구",title:"lg가 우승한다",content:"당연한사실"});
    });
});

describe("GET /post/my",()=>{
    const agent = request.agent(app);
    test("내가 쓴글을 불러오기",async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
        await agent.get("/post/my").expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200||res.list.length!=1){
                throw new Error("테스트 실패");
            }
        })
    });
});
describe("POST /post/like",()=>{
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("없는 게시물에 좋아요를 누른 경우",async()=>{
        await agent.post("/post/like").send({postId:5}).expect({code:400});
    });
    test("좋아요를 한번 눌러서 성공한 경우",async()=>{
        await agent.post("/post/like").send({postId:2}).expect({code:200});
    });
    test("좋아요를 두번 눌러서 실패한 경우",async()=>{
        await agent.post("/post/like").send({postId:2}).expect({code:400});
    });
});

describe("POST /post/dislike",()=>{
    const agent = request.agent(app);
    beforeEach(async()=>{
        await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
    });
    test("없는 게시물에 싫어요를 누른 경우",async()=>{
        await agent.post("/post/dislike").send({postId:5}).expect({code:400});
    });
    test("싫어요를 한번 눌러서 성공한 경우",async()=>{
        await agent.post("/post/dislike").send({postId:2}).expect({code:200});
    });
    test("싫어요를 두번 눌러서 실패한 경우",async()=>{
        await agent.post("/post/dislike").send({postId:2}).expect({code:400});
    });
});
// describe('POST /post/img',()=>{
//     const agent = request.agent(app);
//     test("이미지 업로드",async()=>{
//         await agent.post("/auth/login").send({email:"dntjrdn78@naver.com",password:"dntjrdn78"});
//         await agent.post("/post/img").s
//     });
// });
describe("GET /post/list",()=>{
    test("없는 게시판의 개념글 목록을 불러오는 경우",async()=>{
        await request(app).get(`/post/list?name=${encodeURI("농구")}&page=1`).expect({code:400});
    });
    test("게시판의 개념글 목록을 불러오는 경우",async()=>{
        await request(app).get(`/post/list?page=1&name=${encodeURI("야구")}`).expect((data)=>{
            const res = JSON.parse(data.text);
            if(res.code!=200){
                throw new Error("테스트 실패");
            }
        });
    });

});
afterAll(async()=>{
    await Sequelize.sequelize.sync({force:true});
});