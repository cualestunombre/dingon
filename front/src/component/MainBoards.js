import React from "react";
import { useState } from "react";
import "./MainBoards.css";
import axios from "axios";

const MainBoards = (props) => {
  // const [nick, setNick] = useState("");
  // const [name, setName] = useState(""); //board name
  // const [createdat, setCreatedat] = useState("");
  // const [clicked, setClicked] = useState("");
  return (
    <>
      <div className="mainBoardsBox box1">
        <div className="boardTitle">{props.title}</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
        <div className="boxPost">게시글</div>
      </div>
    </>
  );
};
export default MainBoards;
