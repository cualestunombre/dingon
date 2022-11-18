jest.mock("../models/users.js");
const User = require("../models/users.js");
const {signup,emailCheck,nickNameCheck, checkLogin} = require("../controller/authController");
describe('signup', () => {
    const req ={body:{email:"1dilumn0@gmail.com",nickName:"해위",password:"opsueaxqx1578"}};
    const res ={
        send:jest.fn()
    };
    const next = jest.fn();
    test("이미 가입된 유저라면, code 400을 전송해야 함",async()=>{
        User.findOne.mockResolvedValue(["true"]);
        await signup(req,res,next);
        expect(res.send).toBeCalledWith({code:400});
    });
    test("회원가입이 성공하면, code 200을 전송해야 함",async()=>{
        User.findOne.mockResolvedValue(null);
        await signup(req,res,next);
        expect(res.send).toBeCalledWith({code:200});
    });
    test("DB접근 중 에러가 발생하면, next가 실행되어야 함",async()=>{
        User.findOne.mockRejectedValue("error");
        await signup(req,res,next);
        expect(next).toBeCalledTimes(1);
    });
});


// describe('login', () => {
//     const req = {body:{email:"dntjrdn78@naver.com",password:"dntjrdn78"}};
//     const res= {
//         send:jest.fn()
//     };
//     const next = jest.fn();
//     test("로그인에 성공하면 code 200전송",async()=>{
//         await login(req,res,next);
//         expect(res.send).toBeCalledWith({code:200});
//     });
// });
describe('emailCheck', () => {
    const req={body:{email:"dnthrdn78@naver.com"}};
    const res ={
        send:jest.fn()
    };
    const next = jest.fn();
    test("이미 존재하는 이메일이면, code 400을 반환함",async()=>{
        User.findOne.mockResolvedValue(["true"]);
        await emailCheck(req,res,next);
        expect(res.send).toBeCalledWith({code:400}); 
    });
    test("존재하지 않는 이메일이면, code 200을 반환함",async()=>{
        User.findOne.mockResolvedValue(null);
        await emailCheck(req,res,next);
        expect(res.send).toBeCalledWith({code:200});
    });
    test("DB접근 중 에러가 발생하면, next가 실행되어야 함",async()=>{
        User.findOne.mockRejectedValue("error");
        await emailCheck(req,res,next);
        expect(next).toBeCalledTimes(1);
    });
});

describe('nickNameCheck', () => {
    const req= {body:{nickName:"우석우"}};
    const res = {
        send:jest.fn()
    };
    const next = jest.fn();
    test("이미 존재하는 닉네임이면, code 400을 반환함",async()=>{
        User.findOne.mockResolvedValue(["true"]);
        await nickNameCheck(req,res,next);
        expect(res.send).toBeCalledWith({code:400});
    });
    test("존재하지 않는 닉네임이면, code 200을 반환함",async()=>{
        User.findOne.mockResolvedValue(null);
        await nickNameCheck(req,res,next); 
        expect(res.send).toBeCalledWith({code:200});
    });
    test("DB접근 중 에러가 발생하면, next가 실행되어야 함",async()=>{
        User.findOne.mockRejectedValue("error");
        await nickNameCheck(req,res,next);
        expect(next).toBeCalledTimes(1);
    }); 
});

describe('checkLogin', () => {
    const res={
        send:jest.fn()
    };
    const next = jest.fn();
    test("로그인이 된 유저는 code 200을 반환함",()=>{
        const req={user:{}};
        checkLogin(req,res,next);
        expect(res.send).toBeCalledWith({code:200});
    });
    test("로그인이 안 된 유저는 code 400을 반환함",()=>{
        const req={};
        checkLogin(req,res,next);
        expect(res.send).toBeCalledWith({code:400});
    });

});
