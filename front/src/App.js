import logo from "./logo.svg";
import "./App.css";
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import axios from "axios";
import Main from "./component/Main";
import Sticky from "./component/Sticky";
import Search from "./component/Search";
import ScrollToTop from "./component/ScrollToTop";
import io from "socket.io-client";
import Footer from "./component/Footer";

import Gaesi from "./component/gaesi";
import Allgall from "./component/Allgall";
import { display } from "@mui/system";
const socket = io.connect('http://localhost:8050/count',{path: "/socket.io", cors: { origin: '*' }});
const App = (props) => {
  const [userId, setUserId] = useState("");
  const [nickName, setNickName] = useState("");
  const [value, setValue] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [count,setCount] = useState(0);
  const [recent,setRecent] = useState([]);
  const recentStyle = {
    color: "white",
    textDecoration: "none",
  }


  useEffect(()=>{
    if (!localStorage.getItem("list")){
      localStorage.setItem("list",JSON.stringify([]));
    }
    else{
      setRecent(JSON.parse(localStorage.getItem("list")));
    }
  }, []);
  useEffect(() => {
    axios
      .get("http://localhost:8050/auth/isLoggedIn", { withCredentials: true })
      .then((data) => {
        console.log(data.data);
        if (data.data.code === 200) {
          console.log("success");
          setIsLogin(data.data.userId);
          setNickName(data.data.nickName);
          setUserId(data.data.email);
        }
      });
  });
  useEffect(() => {
    axios.get("http://localhost:8050/search/count").then((data) => {
      setCount(data.data.count);
    });
  });
  // useEffect(async()=>{
  //     const data = await axios("http://localhost:8050");
  //     setValue(data.data.code);
  //     return ()=>{
  //       return ;
  //     }
  // },[]);
  return (
    <>
      <BrowserRouter>
        <div className="body">
          <div className="searchandLogo">
            <Search />
          </div>
          <div className="dividebar">
            <div
              style={{
                marginTop: "15px",
                marginLeft: "15px",
                display: "inline-block",
                fontWeight: "500",
              }}
            >
              동시접속자
              <span style={{ fontWeight: "600", color: "rgb(154,222,237)" }}>
                
                {count}명
              </span>
            </div>
            <div className="recentGall">최근방문갤러리</div>
            {recent.map((v) => {
              return (
                <span key={v.id} className="theRecentGallSpan">
                  <Link
                  
                    style={recentStyle}
                    to={"/gallery/" + v}
                  >
                    {v}
                  </Link>
                </span>
              );
            })}
          </div>
          <div className="container">
            <div className="main">
              <Main
                isLogin={isLogin}
                setRecent={setRecent}
                setIsLogin={setIsLogin}
                userId={userId}
              />
            </div>
            <div className="sticky">
              <Sticky
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                nickname={nickName}
                setNickname={setNickName}
                userId={userId}
                setUserId={setUserId}
              />
            </div>
          </div>
          <div>
            <ScrollToTop></ScrollToTop>
            <Allgall></Allgall>
          </div>
          <div className="Footer">
            <hr />
            <Footer></Footer>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
};

export default App;
