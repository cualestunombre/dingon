import React, { useState } from "react";
import axios from "axios";
import "../css/NewBoard.css";
import Button from "@mui/material/Button"
import CheckIcon from '@mui/icons-material/Check';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Swal from "sweetalert2";

function NewBoard(){
    const [Name, setName] = useState("");
    const [BtnAble, setBtnAble ] = useState(false);
    const [TxtLength, setTxtLength] = useState(0);
    const create = () => {
        axios({
            url: "http://localhost:8050/gallery/add",
            method: "post",
            withCredentials: true,
            data : {name : Name}
        }).then((result) => {
            if(result.data.code === 200){
                Swal.fire({
                    title : "갤러리 생성 suckcex",
                    icon : "success",
                    // timer : 3000 
                })
                window.location.replace(`/gallery/${Name}`)
            }
            else{
                Swal.fire({
                    title: "갤러리 생성하지마라",
                    icon : "error"
                })
            }
        }); 
    };
    const checkBoardName = () => {
        if(Name == ""){
            Swal.fire({
                title : "내용을 입력해주세요",
                icon : "warning",
            })
            return false;
        }
        axios({
            url: "http://localhost:8050/gallery/check",
            method: "get",
            withCredentials: true,
            params : {name : encodeURI(Name)}
        }).then((result) => {
            console.log("resultData : ", result.data);
            if (result.data.code === 400){
                Swal.fire({
                    title: "아따 이미 있당께요",
                    icon: "error"
                })
                setBtnAble(false);
            }
            else if (result.data.code === 500){
                Swal.fire({
                    title: "서버상 문제가 발생했습니다",
                    icon: "error"
                })
                setBtnAble(false);
            }
            else {
                Swal.fire({
                    title : "등록 가능한 갤러리 이름입니다",
                    icon : "info"
                })
                setBtnAble(true);
            }
        })
    }
    return (
        <>
            <div className="newBoardBox">
                <div className="theContent">
                    <div className="newBoardTitle">
                       갤러리 생성하기</div>
                        <div className="newBoardRule">
                            <h3>※갤러리 생성 규칙 </h3>
                            <div className="theRule">1. 음란물 배포 및 불순한 목적의 갤러리는 운영진에 의해 삭제될 수 있습니다.</div>
                            <div className="theRule">2. 반복적으로 동일한 목적의 갤러리를 만들 시 제재를 받을 수 있습니다.</div>
                            <div className="theRule">3. 음란물, 차별, 비하, 혐오 및 초상권, 저작권 침해 게시물은 민, 형사상의 책임을 질 수 있습니다.</div>
                            <hr></hr>
                        </div>
                    <span className="theTitle">갤러리 제목 : </span>
                    <input  
                        className="boardName" 
                        placeholder="만들고자 하는 갤러리 제목을 입력해주세요" 
                        onChange={(e)=>{
                            setName(e.target.value);
                            setBtnAble(false);
                            setTxtLength(e.target.value.length);
                            if(e.target.value.length > 6){
                                Swal.fire({
                                    title: "최대 6자까지 입력 가능합니다",
                                    icon : "question"
                                })
                            }
                        }}
                        maxLength={6}
                        >
                    </input>
                    <Button 
                        startIcon={<CheckIcon></CheckIcon>}
                        className="checkBtn" 
                        onClick={()=>{
                        checkBoardName();
                    }}>중복확인</Button>
                    {/* <br></br> */}
                    <div className="maxTxt">
                        <span>{TxtLength}</span>
                        /
                        <span>6</span>
                    </div>
                    <br></br>
                    <Button 
                        startIcon={<ExitToAppIcon></ExitToAppIcon>}
                        className="createBtn" 
                        onClick={()=>{
                        create();
                        }} 
                        disabled={!BtnAble}>
                    갤러리 생성
                    </Button>
                </div>
            </div>
        </>
    );
}

export default NewBoard;