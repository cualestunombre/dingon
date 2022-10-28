import React, { useState, useEffect } from "react";
import AssignModal from "./AssignModal";
import Hitgall from "./Hitgall";
import Loginbox from "./Loginbox";
import IsLogined from "./IsLogined";
import ScrollToTop from "./ScrollToTop";
import "../css/Sticky.css";
import "../css/IsLogined.css";

export default function Sticky({
  isLogin,
  setIsLogin,
  nickname,
  setNickname,
  userId,
  setUserId,
}) {
  const [onAssign, setOnAssign] = useState(false);

  return (
    <>
      {onAssign ? <AssignModal senddata={setOnAssign} /> : <></>}
      <div className="content-right">
        {isLogin != false ? (
          <IsLogined
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            nickname={nickname}
            userId={userId}
            setUserId={setUserId}
          />
        ) : (
          <Loginbox
            isLogin={isLogin}
            setIsLogin={setIsLogin}
            setNickname={setNickname}
            setOnAssign={setOnAssign}
            userId={userId}
            setUserId={setUserId}
          />
        )}
        <div className="hitgall">
          <ScrollToTop></ScrollToTop>
          <Hitgall />
        </div>
      </div>
    </>
  );
}
