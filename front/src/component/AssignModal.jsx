import TextField from '@mui/material/TextField';
import axios from "axios"
import React, { useEffect, useRef } from 'react';
import "../css/AssignModal.css";
import Button from '@mui/material/Button';
import { useState } from 'react';
import Alert from '@mui/material/Alert';


function AssignModal({senddata}) {
    
    const [nickName, setName] = useState("");
    const [Pw, setPw] = useState("");
    const [Email, setEmail] = useState("");
    const [EwriteState, EsetwriteState] = useState(false);
    const [IwriteState, IsetwriteState] = useState(false);
    const [PriteState, PsetwriteState] = useState(false);
    const [emailOk,setEmailOk]=useState(false);
    const [isNameOk,setIsNameOk]=useState(false);
    const Emailvalidate = () => {
        let check = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]$/i;
        if (!EwriteState) {
            return false;
        } else {
            return !check.test(Email);
        }
    }
    const namevalidate = () => {
        let check = /^(?=.*[a-z0-9가-힣])[a-z0-9가-힣]{2,16}$/;
        if (!IwriteState) {
            return false;
        } else {
            return !check.test(nickName);
        }
    }
    
    
    const Pwvalidate = () => {
        let check = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;;
        if (!PriteState) {
            return false;
        } else {
            return false;
        }

    }
    const submit=()=>{
        let data={
            email:Email,
            password:Pw,
            nickName:nickName
        }

        axios({
            url: "http://localhost:8050/auth/signup",
            method: "post",
            data:data
        }).then((result) => {
            console.log(result.data);
            
            if(result.data.code===200){
                alert("가입이 완료되었습니다");
                window.location.replace("/")
            }else{
                alert("예기치 못한 오류 ㄷ ㄷ");
            }
        });
    }
    const checkIsAlready=()=>{
        axios({
            url: "http://localhost:8050/auth/emailCheck",
            method: "post",
            data:{email:Email}
        }).then((result) => {
            console.log(result.data);
            if(result.data.code===400){
                console.log("겹침")
                alert("이메일이 겹칩니다")
                setEmailOk(false);
            }else{
                alert("success")
                setEmailOk(true)
            }
        });
    }
    const checkIsAlreadyName=()=>{
        axios({
            url: "http://localhost:8050/auth/nickNameCheck",
            method: "post",
            data:{nickName:nickName}
        }).then((result) => {
            console.log(result.data);
            if(result.data.code===400){
                console.log("겹침")
                alert("닉네임이 겹칩니다")
                setIsNameOk(false);
            }else{
                alert("success")
                setIsNameOk(true)
            }
        });
    }
    return (
        <div onClick={(e)=>{if(e.target.getAttribute("class")=="ocapacity"){
            senddata(false)
        }}} className="ocapacity">
            <div className="Modal">
                <div className='title'>
                    회원가입
                </div>
                <div className='metirial'>
                    <TextField disabled={emailOk} onChange={(e) => { EsetwriteState(true); setEmail(e.target.value) }} className='inputTag'  label="Email" variant="outlined" error={Emailvalidate()} helperText={Emailvalidate() ? "형식에 맞게 입력하세요." : ""} />
                    <Button disabled={emailOk} onClick={()=>{
                        checkIsAlready()
                    }} style={{ marginLeft: "10px" }}>중복확인</Button>
                </div>
                <div className='metirial'>
                    <TextField disabled={isNameOk} className='inputTag' onChange={(e) => { setName(e.target.value); IsetwriteState(true) }} label="NickName" variant="outlined" error={namevalidate()} helperText={namevalidate() ? "형식에 맞게 입력하세요" : ""} />
                    <Button disabled={isNameOk} onClick={()=>{checkIsAlreadyName()}} style={{ marginLeft: "10px" }}>중복확인</Button>
                </div>
                <div className='metirial'>
                    <TextField type="password" style={{ width: "66%" }} className='inputTag' onChange={(e) => { setPw(e.target.value); PsetwriteState(true) }}  label="password" variant="outlined" error={Pwvalidate()} helperText={Pwvalidate() ? "형식에 맞게 입력하세요" : ""} />
                </div>

                <div className='captar'>
                    <div id="captcha" className="g-recaptcha" data-sitekey="6LcG3ZEiAAAAAN-O78MeoLy3N9lU9J7jGvmHYsiD"></div>
                </div>

                <Button onClick={submit} className='buton' variant="outlined">회원가입 하기</Button>
			
            </div>
        </div>
    );
}

export default AssignModal;