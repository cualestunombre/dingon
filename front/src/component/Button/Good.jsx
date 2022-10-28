import React from "react"
import  Button  from "@mui/material/Button"
import StarIcon from "@mui/icons-material/Star";
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import axios from "axios"
import { useState } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export default function GoodBtn({isLogin,postId,setDisLike,dislike,like,setLike}){
  const {postid} = useParams();
    return (
      <>
        <Button
          style={{
            borderRadius: "200px",
            width: "100px",
            paddingLeft: "25px",
            backgroundColor: "#4545AC",
            padding:"5px",
            margin:"10px"
          }}
          id="GoodBtn"
          variant="contained"
          startIcon={
            <StarIcon
              style={{ fontSize: "25px" }}
              id="Icon"
              variant="contained"
            ></StarIcon>
          }
          onClick={() => {
            if(isLogin){
            document.getElementById("Icon").style.color = "yellow";
            axios({
              url: "http://localhost:8050/post/like",
              method: "post",
              data:{postId:postId},
              withCredentials: true,
            }).then((response)=>{
              console.log(response.data)
              if(response.data.code===400){
                Swal.fire({
                  title : "개추는 ID당 1번만 가능합니다",
                  icon : "error"
                })
              }else{
                setLike(like +1)
              }
            });
            }else{
              Swal.fire({
                title : "로그인 후 가능합니다",
                icon : "question"
              })
            }
          }}
        >개추 {like}</Button>
        <Button 
        variant="outlined"
        color="error"
        style={{margin:"10px"}}
        startIcon={<ThumbDownIcon></ThumbDownIcon>}
        onClick={()=>{
          if(isLogin){
            
          axios({
            url: "http://localhost:8050/post/dislike",
            method: "post",
            data:{postId:postId},
            withCredentials: true,
          }).then((response)=>{
            console.log(response.data)
            if(response.data.code===400){
              Swal.fire({
                title : "비추는 ID당 1번만 가능합니다",
                icon : "error"
              })
            }else{
              setDisLike(dislike +1)
            }
          });
          }else{
            Swal.fire({
              title : "로그인 후 가능합니다",
              icon : "question"
            })
          }
        }}
        >비추 {dislike}</Button>
      </>
    );
}