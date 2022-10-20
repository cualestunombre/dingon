import React, { useState } from "react";
import { useEffect } from "react";
import MainBoard from "./MainBoard";
import "../css/MainBoards.css";
import axios from "axios";

const MainBoards = () => {
  // const [nick, setNick] = useState("");
  // const [name, setName] = useState(""); //board name
  // const [createdat, setCreatedat] = useState("");
  // const [clicked, setClicked] = useState("");

  let [hot, setHot] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8050/search/top4").then((response) => {
      console.log("responseData : ", response.data.list);
      setHot(response.data.list);
    });
  });

  return (
    <>
      <MainBoard
        className="box1"
        title="핫게시판"
        data={hot.length !== 0 && hot[0]}
      ></MainBoard>
      <MainBoard
        className="box2"
        title="핫게시판"
        data={hot.length !== 0 && hot[1]}
      ></MainBoard>
      <MainBoard
        className="box3"
        title="핫게시판"
        data={hot.length !== 0 && hot[2]}
      ></MainBoard>
      <MainBoard
        className="box4"
        title="핫게시판"
        data={hot.length !== 0 && hot[3]}
      ></MainBoard>
    </>
  );
};
export default MainBoards;
