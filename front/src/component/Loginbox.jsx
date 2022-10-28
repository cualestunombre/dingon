import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import Swal from "sweetalert2";

export default function Loginbox({
  setOnAssign,
  isLogin,
  setIsLogin,
  setNickname,
  userId,
  setUserId,
}) {
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  //const [onAssign, setOnAssign] = useState(false);

  function login() {
    var data = {
      email: id,
      password: pw,
    };

    axios({
      url: "http://localhost:8050/auth/login",
      method: "post",
      data: data,
      withCredentials: true,
    }).then((response) => {
      if (response.data.code === 200) {
        setUserId(response.data.user.email);
        setNickname(response.data.user.nickName);
        setIsLogin(response.data.user.userId);
      } else {
        Swal.fire({
          title : "로그인 실패",
          icon : "error"
        })
      }
    });
  }

  return (
    <>
      <div className="loginbox">
        <form
          className="formbox"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <div className="inputbox">
            <input
              type="text"
              value={id}
              onChange={(e) => {
                setId(e.target.value);
              }}
              name="id"
              id="id"
              className="idInput"
              placeholder="E-mail"
            ></input>
            <input
              type="password"
              value={pw}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  login();
                }
              }}
              onChange={(e) => {
                setPw(e.target.value);
              }}
              name="pw"
              id="pw"
              className="pwInput"
              placeholder="Password"
            ></input>
          </div>
          <button className="loginBtn" onClick={login}>
            로그인
          </button>
        </form>
        <div className="btnBox">
          <button
            className="signupBtn"
            onClick={() => {
              setOnAssign(true);
            }}
          >
            회원가입
          </button>
        </div>
      </div>
    </>
  );
}
