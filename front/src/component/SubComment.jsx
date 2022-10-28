import { useRef, useState } from "react"
import "../css/subComment.css"
import { TextField ,Button } from "@mui/material";
import axios from "axios";
import Swal from "sweetalert2";

const SubComment = ({postId, commentId ,isLogin}) => {

    const [subComment,setSubComment]=useState("");
    const btn=useRef(null);
    const submit=()=>{
        if(isLogin){
            axios({
                url: "http://localhost:8050/comment/sub",
                method: "post",
                data: { commentId: commentId, postId: postId,comment:subComment},
                withCredentials: true,
              }).then((response) => {
                console.log("대댓글정보", response.data);
                window.location.reload();
              });
        }else{
            Swal.fire({
                title : "로그인 `해줘`",
                icon : "question"
              })
        }
    }

    return (
        <>
            <div className="subCommentFrame">
                <div>
                    <TextField
                        onChange={(e)=>{
                            setSubComment(e.target.value);
                        }}
                        fullWidth
                        multiline
                        rows={4}
                        placeholder="댓글을 입력하세요"
                        onKeyUp={(e)=>{
                            if (e.key === "Enter") {
                              btn.current.click()
                            }
                          }}
                    />
                </div>
                <div className="buttonFrame">
                    <Button ref={btn} onClick={submit}>댓글 쓰기</Button>
                </div>
            </div>

        </>
    );


}

export default SubComment;