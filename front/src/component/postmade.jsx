import axios from "axios";
import "../css/PostMade.css"
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Button from '@mui/material/Button';
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useState, useMemo,useRef } from "react"
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

function PostMade() {
    const [title,setTitle]=useState("");
    const [value, setValue] = useState(''); // 에디터 속 콘텐츠를 저장하는 state
    const quillRef = useRef(); 
    const {name}=useParams();
    const imageHandler = () => {
        console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');
      
        // 1. 이미지를 저장할 input type=file DOM을 만든다.
        const input = document.createElement('input');
        // 속성 써주기
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
        // input이 클릭되면 파일 선택창이 나타난다.
      
        // input에 변화가 생긴다면 = 이미지를 선택
        input.addEventListener('change', async () => {
          console.log('온체인지');
          const file = input.files[0];
          // multer에 맞는 형식으로 데이터 만들어준다.
          const formData = new FormData();
          formData.append('files', file); // formData는 키-밸류 구조
          // 백엔드 multer라우터에 이미지를 보낸다.
          console.log(input.files[0]);
          console.log(quillRef);
          axios({
            url: "http://localhost:8050/post/img",
            method: "post",
            data: formData,
            withCredentials:true
          }).then((result) => {
            console.log(result.data);
            console.log('성공 시, 백엔드가 보내주는 데이터', result.data.url);
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
            editor.insertEmbed(range.index, 'image', IMG_URL);
          });
          
        });
      };
    const modules = useMemo(() => {
        return {
          toolbar: {
            container: [
              ['image'],
              [{ header: [1, 2, 3, false] }],
              [{color:["orange","black"]}],
              ["size",'bold', 'italic', 'underline', 'strike', 'blockquote'],
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
        'header',
        'bold',
        'italic',
        'underline',
        'strike',
        'blockquote',
        'image',
      ];
      const sendData = async ()=>{
        let data={
          board:name,
          title:title,
          content:quillRef.current.value
        }
        if(title.length===0){
          Swal.fire({
            title : "제목을 입력해주세요",
            icon : "warning",
        })
          return;
        }
        const result = await axios({
          url: "http://localhost:8050/post/uploads",
          method: "post",
          data: data,
          withCredentials:true
        })
        if(result.data.code==200){
          window.location=`/gallery/${name}`;
        }
        else{
          Swal.fire({
            title : "서버상 문제가 발생했습니다",
            icon : "error"
          })
          window.location=`/gallery/${name}`;
        }
      }
    return (
        <div className="frame">
            <div className="Logo">
                <h2>글 작성</h2>
            </div>
            <hr />
            <div className="titlename">
                <TextField onChange={(e)=>{setTitle(e.target.value)
                if(e.target.value.length >= 15){
                  Swal.fire({
                    title : "제목 길게 쓰지마세요잉~!",
                    icon : "question"
                  })
                  e.target.value = ""
                }}} fullWidth type="text" placeholder="제목" maxLength={15}/>
            </div>
            <div className="alertstory">
                <ErrorOutlineIcon />{"절대절대 부적절한 이미지 혹은 내용을 담으면 안됩니다!"}
            </div>
            <div className="alertstory">
                <ErrorOutlineIcon />{"출처없이 사진을 쓴다면 정의의 철퇴를 쳐 맞으실겁니다!"}
            </div>
            <hr />
            <div className="mainPost">
                <div style={{ width: "80%" }}>
                    <ReactQuill
                        style={{height:"500px"}}
                        ref={quillRef}
                        theme="snow"
                        placeholder="플레이스 홀더"
                        value={value}
                        onChange={setValue}
                        modules={modules}
                        formats={formats}
                    />
                </div>
                <div style={{width:"100%",marginTop:"50px",display:"flex",justifyContent:"flex-end",marginRight:"170px"}}>
                  <Button style={{background:"#4545AC"}} onClick={sendData} variant="contained">글 작성 하기</Button>
                </div>
            </div>
        </div>
    );
}

export default PostMade;