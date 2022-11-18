const {isLoggedIn,isNotLoggedIn} = require("./middlewares");
describe('isLoggedIn', () => {
    const res={
        status:jest.fn(()=>res),
        send:jest.fn(),
    };
    const next = jest.fn();
    test("로그인이 되어있으면 isLoggedIn이 next를 호출해야함",()=>{
        const req={
            isAuthenticated:jest.fn(()=>true)
        };
        isLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    });
    test("로그인이 되어있지 않으면 isLoggedIn이 에러를 응답해야함",()=>{
        const req={
            isAuthenticated:jest.fn(()=>false)
        };
        isLoggedIn(req,res,next);
        expect(res.send).toBeCalledWith({code:400});
    });
});
describe('isNotLoggedIn', () => {
    const res={
        status:jest.fn(()=>res),
        send:jest.fn()
    };
    const next = jest.fn();
    test("로그인이 되어있지 않으면 isNotLoggedIn이 next를 호출해야함",()=>{
        const req={
            isAuthenticated:jest.fn(()=>false)
        }
        isNotLoggedIn(req,res,next);
        expect(next).toBeCalledTimes(1);
    });
    test("로그인이 되어있으면 isNotLoggedIn이 에러를 응답해야 함",()=>{
        const req={
            isAuthenticated:jest.fn(()=>true)
        };
        isNotLoggedIn(req,res,next);
        expect(res.send).toBeCalledWith({code:400});
    });
});
