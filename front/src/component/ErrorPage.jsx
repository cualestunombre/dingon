import { height } from "@mui/system";
import React from "react";
import "../css/ErrorPage.css";

const ErrorPage = (()=>{
    const backHome = () => {
        window.location.replace("/")
    }

    return(
        <>
            <div className="theErr">
                <div className="err404">
                404 Not Found
                </div>
                <hr></hr>
                <img src="/img/pepe1.jpg" style={{width:"auto",height:"auto",float:"left"}}></img>
                <div className="errTitle">
                죄송합니다. 해당 페이지를 찾을 수 없습니다.
                </div>         
                <div className="errMsg">
                    <p>찾으려는 페이지의 주소가 잘못 입력되었거나,</p>
                    <p>주소의 변경 혹은 삭제로 인해 사용하실 수 없습니다.</p>
                    <p>입력하신 페이지의 주소가 정확한 지 다시 한번 확인해 주세요. </p>
                </div>       
                
                <button 
                    className="backHomeBtn"
                    onClick={backHome}
                >
                    Dingon 홈으로 가기
                </button>
            </div>
        </>
    )
});

export default ErrorPage;