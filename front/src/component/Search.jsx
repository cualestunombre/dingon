import "../css/Search.css";
import { useState, useEffect, useRef } from "react";
import Input from "@mui/material/Input";
import { LinearProgress } from "@mui/material";
import { Link } from "react-router-dom";

const Search = () => {
  const [name, setText] = useState("");

  let lefteye = useRef(null);
  let righteye = useRef(null);
  var sdown = 0;
  var sleft = 0;

  var swide = 800;
  var shigh = 600;

  var width = 20;

  useEffect(() => {
    document.addEventListener("mousemove", (e) => {

      mouse(e);
    });
  }, []);

  function mouse(e) {
    if (!lefteye) return;

    var x, y, xdiff, ydiff, distn;

    y = e.pageY;
    x = e.pageX;
    x -= sleft;
    y -= sdown;

    xdiff = x + 1.1 * width - swide * 0.5;
    ydiff = y - shigh / 2;
    distn = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
    if (distn > width / 2.5) {
      xdiff = (xdiff * width) / distn / 2.5;
      ydiff = (ydiff * width) / distn / 2.5;
    }
    lefteye.current.style.top = ydiff + width / 3 + "px";
    lefteye.current.style.left = xdiff + 30 - width + "px";

    xdiff = x - 1.1 * width - swide * 0.5;
    ydiff = y - shigh / 2;
    distn = Math.pow(xdiff * xdiff + ydiff * ydiff, 0.5);
    if (distn > width / 2.5) {
      xdiff = (xdiff * width) / distn / 2.5;
      ydiff = (ydiff * width) / distn / 2.5;
    }
    righteye.current.style.top = ydiff + width / 3 + "px";
    righteye.current.style.left = xdiff + 30 - width + "px";
  }

  return (
    <>
      <div className="wrap">
        <div className="Search">
          <Link style={{ cursor: "pointer" }} to="/">
            <div className="logo">
              <img src="/img/logo2.png" />
              <div className="glasses">
                <div className="lefteyeball">
                  <div className="lefteye" ref={lefteye}></div>
                </div>
                <div className="righteyeball">
                  <div className="righteye" ref={righteye}></div>
                </div>
              </div>
            </div>
          </Link>
          <div className="searchengine">
            
              <Input
                type="text"
                placeholder="검색"

                onKeyUp={(e)=>{
                  if(e.key === "Enter"){
                    window.location = `/search/${name}`;
                  }
                }}
                onChange={(e) => {
                  // console.log(e.target.value);
                  setText(e.target.value);
                }}
              ></Input>
              <button
                onClick={() => {}}
              >
                검색
              </button>
            
          </div>
          <div className="logo2">
                <img src="/img/owl2.gif"></img>

          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
