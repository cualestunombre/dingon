import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export default function IsLogined({ setIsLogin, nickname, userId }) {
  const logout = () => {
    axios({
      url: "http://localhost:8050/auth/logout",
      method: "post",
      withCredentials: true,
    }).then((response) => {
      console.log(response.data);
      if (response.data) {
        Swal.fire({
          title : "Logout",
          icon : "success"
        })
        setIsLogin(false);
      } else {
        Swal.fire({
          title : "Logout falied",
          icon : "error"
        })
      }
    });
  };

  return (
    <>
      <div className="loginedbox">
        <div className="user-info">
          <span>
            <strong>{nickname}</strong>님 안녕하세요..
          </span>
          <button onClick={logout} className="logoutBtn">
            로그아웃
          </button>
        </div>
        <Link className="create" to={"/mypage"}>
          마이 페이지
        </Link>
        <Link className="create" to={"/create"}>
          갤러리 생성
        </Link>
      </div>
    </>
  );
}
