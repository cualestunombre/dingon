import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../css/Show.css";
import styled from "styled-components";
import Pagination from "react-js-pagination";
import axios from "axios";
import Button from "@mui/material/Button";
import InsertCommentIcon from "@mui/icons-material/InsertComment";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from '@mui/icons-material/Delete';
import Good from "./Button/Good"
import SubComment from "./SubComment";
import { TextField } from "@mui/material";
import Swal from "sweetalert2";

const Show = ({ isLogin }) => {
  const PaginationBox = styled.div`
    a:link {
      color: black;
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    ul.pagination li {
      display: inline-block;
      width: 30px;
      height: 30px;
      border: 1px solid #e2e2e2;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
    }
    ul.pagination li:first-child {
      border-radius: 5px 0 0 5px;
    }
    ul.pagination li:last-child {
      border-radius: 0 5px 5px 0;
    }
    ul.pagination li a {
      text-decoration: none;
      color: #4545ac;
      font-size: 1rem;
    }
    ul.pagination li.active a {
      color: white;
    }
    ul.pagination li.active {
      background-color: #4545ac;
    }
    ul.pagination li a:hover,
    ul.pagination li a.active {
      color: white;
    }
  `;
  const { name, id } = useParams();
  const [cont, setCont] = useState("");
  const content = useRef(null);
  const submitBtn = useRef(null);

  const [userId, setUserId] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState([]);
  const [subComment, setSubComment] = useState(-1);
  const [err, setErr] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [sublist, setSubList] = useState([]);
  const [writeC, setWriteC] = useState("")
  const [like ,setLike]=useState(0);
  const [dislike,setDisLike]=useState(0)
  const handlePageChange = (page) => {
    setPage(page);
  };
  useEffect(() => {
    axios({
      url: "http://localhost:8050/post/content",
      method: "get",
      params: { postId: id },
      withCredentials: true,
    }).then((response) => {
      if(!response.data.nickName){
        return window.location="/404";
      }
      setTotal(response.data.total)
      // //console.log(response.data.postId);
      setUserId(response.data.userId);
      let date = new Date(response.data.createdAt);
      let sendDate =
        date.getFullYear() +
        "." +
        (parseInt(date.getMonth()) + 1) +
        "." +
        date.getDate() +
        " ";
      
        sendDate += date.getHours() + ":";
      
      sendDate += +date.getMinutes();
      setTime(sendDate);
      setCont(response.data);
      setLike(response.data.like)
      setDisLike(response.data.dislike);
      let new_div = document.createElement("div");
      new_div.innerHTML = response.data.content;
      //console.log(content);
      content.current.innerHTML = response.data.content;
      let userNickname = response.data.userId;
      content.current.innerHTML += `<input
              value=${userNickname}
            ></input>`;
    });
  }, []);
  useEffect(() => {
    console.log("page", page)
    axios({
      url: "http://localhost:8050/comment/list",
      method: "get",
      params: { page: page, postId: id },
      withCredentials: true,
    }).then((response) => {
      console.log("댓글정보", response.data);
      setComment(response.data.list);

    });
  }, [page]);
  const submit = () => {
    if (isLogin) {
      axios({
        url: "http://localhost:8050/comment",
        method: "post",
        data: { postId: id, comment: writeC },
        withCredentials: true,
      }).then((response) => {
        window.location.reload()
        console.log(response.data.code);
      })
    } else {
      Swal.fire({
        title : "로그인 `해줘` ",
        icon : "question"
      })
    }

  }
  const deletecomment = (e) => {
    console.log(e);
    axios({
      url: "http://localhost:8050/comment",
      method: "delete",
      params: { commentId: e },
      withCredentials: true,
    }).then((response) => {
      console.log("삭제완료", response.data.code);
      window.location.reload()
    })
  }
  const deletesubcomment = (e) => {
    console.log(e)
    axios({
      url: "http://localhost:8050/comment/sub",
      method: "delete",
      params: { commentId: e },
      withCredentials: true,
    }).then((response) => {
      console.log("대댓삭제완료", response.data.code);
      window.location.reload()
    })
  }
  return (
    <>
      <div className="wrap">
        <div className="content">
          <div className="headBar">
            <h1 className="t">
              <Link style={{ textDecoration: "none" }} to={"/gallery/" + name}>
                {name} 갤러리
              </Link>
            </h1>
            <div className="fixButton">
              {isLogin === userId ? (
                <Link
                  style={{ textDecoration: "none" }}
                  to={"/gallery/made/" + name + "/" + id}
                >
                  <Button style={{ background: "#4545AC" }} variant="contained">
                    수정
                  </Button>
                </Link>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="headInfo">
            <div className="contentTitle">
              <div>
                <h4 style={{ marginTop: 0, marginBottom: "10px" }}>
                  {cont.title}
                </h4>
                <div>
                  닉네임: {cont.nickName + " | " + time}
                </div>
              </div>
              <div className="info">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <VisibilityIcon />
                  <div>{cont.clicked}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <SentimentVerySatisfiedIcon />
                  <div>{like}</div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: "20px",
                  }}
                >
                  <InsertCommentIcon />
                  <div>{cont.commentCount}</div>
                </div>
              </div>
            </div>
          </div>
          <div ref={content} className="get_content"></div>
          
          <div className="LikeViewFrame">
            <div className="LikeView">
              <Good isLogin={isLogin} postId={id} setDisLike={setDisLike} dislike={dislike} like={like} setLike={setLike}/>
            </div>
          </div>
          <div>전체 댓글 {cont.commentCount}개</div>
          <div className="comment">
            {comment.map((value, key) => {
              //console.log("key", key);
              let date = new Date(value.createdAt);
              let sendDate =
                date.getFullYear() +
                "." +
                (parseInt(date.getMonth()) + 1) +
                "." +
                date.getDate() +
                " ";
              if (date.getHours() < 12) {
                sendDate += date.getHours() + ":";
              } else {
                sendDate += parseInt(date.getHours()) - 12 + ":";
              }
              sendDate += +date.getMinutes();
              return (
                <>
                  <div style={{ fontSize: "small", paddingRight: 0, paddingLeft: 0, display: "flex", alignItems: "center" }}>
                    <div style={{ width: "25%" }}>
                      {value.nickName}
                    </div>
                    <div onClick={() => {
                      if (subComment === -1) {
                        setSubComment(value.id);
                      } else {
                        setSubComment(-1);
                      }
                    }} style={{ width: "80%", overflow: "hidden", wordBreak: "break-all" }}>
                      {value.content}
                    </div>
                    <div style={{ width: "15%", display: "flex", justifyContent: "flex-end" }}>
                      {isLogin === value.userId ? <Button onClick={() => { deletecomment(value.id) }} style={{ color: "black" }} variant="text"><DeleteIcon /></Button> : <></>}
                    </div>
                    <div style={{ width: "20%", display: "flex" }}>
                      {sendDate}
                    </div>
                  </div>
                  {value.id === subComment ? <SubComment commentId={value.id} postId={id} isLogin={isLogin} comment={value.id} /> : <></>}
                  {value.subcomment && value.subcomment.length > 0 && <div className="subcommentframe">
                    <div style={{ marginBottom: "5px", fontSize: "small", paddingRight: 0, paddingLeft: 0, display: "flex", justifyContent: "center", flexDirection: "column" }}>
                      {value.subcomment.map((v, key) => {
                        let date = new Date(v.createdAt);
                        let sendDate =
                          date.getFullYear() +
                          "." +
                          (parseInt(date.getMonth()) + 1) +
                          "." +
                          date.getDate() +
                          " ";
                        if (date.getHours() < 12) {
                          sendDate += date.getHours() + ":";
                        } else {
                          sendDate += parseInt(date.getHours()) - 12 + ":";
                        }
                        sendDate += +date.getMinutes();
                        return (
                          <>
                            <div style={{ display: "flex", marginBottom: "5px", marginTop: "5px", alignItems: "center" }}>
                              <div style={{ width: "25%" }}>
                                ㄴ{v.nickName}
                              </div>
                              <div style={{ width: "80%", overflow: "hidden", wordBreak: "break-all" }}>
                                {v.content}
                              </div>
                              <div style={{ width: "15%", display: "flex", justifyContent: "flex-end" }}>
                                {isLogin === v.userId ? <Button onClick={() => { deletesubcomment(v.ID) }} style={{ marginTop: 0, color: "black" }} variant="text"><DeleteIcon /></Button> : <></>}
                              </div>
                              <div style={{ width: "20%", display: "flex" }}>
                                {sendDate}
                              </div>
                            </div>
                            <hr style={{ marginBottom: 0, width: "100%", backgroundColor: "#ffffff" }} />
                          </>
                        )
                      })}
                    </div>
                  </div>}
                  <hr style={{ backgroundColor: "#e2e2e2" }} />
                </>
              );
            })}
          </div>
        </div>
        <PaginationBox>
          <Pagination
            activePage={page}
            itemsCountPerPage={10}
            totalItemsCount={total}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
          ></Pagination>
        </PaginationBox>
      </div>
      <div className="subCommentFrame" style={{ width: "100%" }}>
        <div>
          <TextField
            onChange={(e) => {
              setWriteC(e.target.value);
            }}
            fullWidth
            multiline
            rows={4}
            placeholder="댓글을 입력하세요"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitBtn.current.click();
              }
            }}
          />
        </div>
        <div className="buttonFrame">
          <Button ref={submitBtn} onClick={submit}>댓글 쓰기</Button>
        </div>
      </div>
    </>
  );
};

export default Show;