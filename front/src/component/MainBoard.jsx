import React from "react";
import "../css/MainBoard.css";
import { Link } from "react-router-dom"
const MainBoard = ({ title, className, data }) => {
  if (data) {
    var list = data.posts.map((value,i) => {
      let back;
      if(i%2==0){
        back="white";
      }
      else{
        back="white";
      }
      return (

        <Link key={value.id} to={"/post/"+title+"/"+value.id} style={{ textDecoration: 'none'}}>
          <div style={{backgroundColor:back,display:"flex", justifyContent:"space-between",paddingRight:"20px",marginBottom:"0px",paddingLeft:"20px",textAlign:"left",height:"22px",marginLeft:"0px"}} key={value.id} className="boxPost">
             <div style={{fontSize:"13px",color:"black"}}><span style={{fontWeight:"700"}}>{value.nickName}</span></div> <div style={{fontSize:"13px",color:"black"}}>제목:<span  style={{fontWeight:"700"}}>   {value.title} <span style={{fontSize:"9px"}}>[{value.commentCount}]</span></span></div><div style={{fontSize:"13px",color:"black"}}>조회수: <span style={{fontWeight:"700"}}>{value.clicked}</span></div> 
          </div>
        </Link>

      );
    });
  }
  return (
    <>
      <div className={`mainBoardsBox ${className} `}>
        <Link to={"/gallery/" + title} style={{ textDecoration: 'none'}}>
          <div className="boardTitle"> {title} 갤러리</div>
        </Link>
        {list}
      </div>
    </>
  );
};

export default MainBoard;