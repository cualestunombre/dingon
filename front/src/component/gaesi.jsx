import "../css/Gaesi.css";
import { useState, useRef, useMemo, useEffect } from "react";
import React from "react";
import { TextField, Button, Typography } from "@mui/material";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DeleteIcon from "@mui/icons-material/Delete";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
const Gaesi = () => {
  const [title, Settitle] = useState(""); // 콘텐츠 타이틀
  const [content, Setcontent] = useState(""); // 콘텐츠 저장하기
  const quillRef = useRef();
  const { postid, name } = useParams();
  console.log(title);
  console.log(content);
  const imageHandler = () => {
    console.log("에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!");

    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement("input");
    // 속성 써주기
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener("change", async () => {
      console.log("온체인지");
      const file = input.files[0];
      // multer에 맞는 형식으로 데이터 만들어준다.
      const formData = new FormData();
      formData.append("files", file); // formData는 키-밸류 구조
      // 백엔드 multer라우터에 이미지를 보낸다.
      console.log(input.files[0]);
      console.log(quillRef);
      axios({
        url: "http://localhost:8050/post/img",
        method: "post",
        data: formData,
        withCredentials: true,
      }).then((result) => {
        console.log(result.data);
        console.log("성공 시, 백엔드가 보내주는 데이터", result.data.url);
        const IMG_URL = result.data.url;
        // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
        // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
        // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.

        // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
        // 1. 에디터 root의 innerHTML을 수정해주기
        // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
        // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
        // editor.root.innerHTML =
        //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

        // 2. 현재 에디터 커서 위치값을 가져온다
        const range = editor.getSelection();
        // 가져온 위치에 이미지를 삽입한다
        editor.insertEmbed(range.index, "image", IMG_URL);
      });
    });
  };
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ["image"],
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
        ],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
        },
      },
    };
  }, []);
  // 위에서 설정한 모듈들 foramts을 설정한다
  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "image",
  ];
  useEffect(() => {
    console.log(postid);
    axios({
      url: "http://localhost:8050/post/content",
      method: "get",
      params: { postId: postid },
      withCredentials: true,
    }).then((result) => {
      console.log("데이터", result.data);
      Settitle(result.data.title);
      const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
      editor.clipboard.dangerouslyPasteHTML(0, result.data.content);
    });
  }, []);
  console.log(postid);
  return (
    <>
      <div className="wrap">
        <div className="content">
          <Link style={{textDecoration:"none"}} to={"/gallery/" + name}>
            <h2 variant="h2">
                {name}갤러리
            </h2>
          </Link>
          <hr></hr>
          <div className="title_head">
            <h2>작성글 수정</h2>
          </div>
          <div className="warning">
            <ErrorOutlineIcon
              fontSize="10px
            "
            ></ErrorOutlineIcon>
            &nbsp; 음란물 배포 및, 작성은 금지입니다.
          </div>
          <div className="warning">
            <ErrorOutlineIcon fontSize="10px"></ErrorOutlineIcon>
            &nbsp; 작성하면 나는 볼건데 나머지는 신고함
          </div>
          <hr></hr>
          <div className="title">
            <TextField
              id="filled-basic"
              value={title}
              fullWidth
              type="text"
              placeholder="제목 수정"
              onChange={(e) => {
                Settitle(e.target.value);
                console.log(title);
              }}
              variant="filled"
              label="제목"
              color="info"
            ></TextField>
          </div>
          <div className="main_content">
            <label>게시글</label>
            <ReactQuill
              ref={quillRef}
              placeholder="게시글 수정"
              theme="snow"
              style={{ height: "650px", overflow: "scroll" }}
              onChange={Setcontent}
              value={content}
              modules={modules}
              formats={formats}
              label="게시글"
            ></ReactQuill>
          </div>
        </div>
        <div className="modify_btn">
          <Button
            variant="contained"
            startIcon={<DeleteIcon></DeleteIcon>}
            color="error"
            id="delete"
            onClick={() => {
              console.log(postid);
              // console.log("해윙");
              
              axios({
                url: "http://localhost:8050/post/delete",
                method: "delete",
                params: { postId: postid },
                withCredentials: true,
              }).then((response) => {
                if (response.data.code == 200) {
                  Swal.fire({
                    title : "삭제되어버렸당께요",
                    icon : "success"
                  })
                  window.location = `/gallery/${name}`;
                }
              });
            }}
          >
            삭제
          </Button>
          <Button
            variant="contained"
            color="success"
            id="modify"
            onClick={() => {
              let data = {
                name: name,
                postId: postid,
                title: title,
                content: quillRef.current.value,
              };
              if (title.length === 0) {
                Swal.fire({
                  title : "제목을 입력해주세요",
                  icon : "warning",
              })
                return;
              } else if (content.length == "" || 0 ) {
                Swal.fire({
                  title : "내용을 입력해주세요",
                  icon : "warning",
              })
                return;
              }
              axios({
                url: "http://localhost:8050/post/update",
                method: "PATCH",
                data: data,
                withCredentials: true,
              }).then((response) => {
                if (response.data.code == 200) {
                  
                  Swal.fire({
                    title : "수정 seccess",
                    icon : "success"
                  })
                  window.location = `/post/${name}/${postid}`;
                } else {
                  Swal.fire({
                    title : "아따 수정 안되요잉",
                    icon: "error"
                  })
                }
              });
            }}
          >
            수정
          </Button>
        </div>
      </div>
    </>
  );
};
export default Gaesi;