import axios from "axios";
import "../css/Search.css";
import { useState } from "react";
const Search = () => {
  const [name, setText] = useState("");
  return (
    <>
      <div className="wrap">
        <div className="Search">
          <div className="logo">
            <div className="icon">여기는 로고</div>
          </div>
          <div className="Searchengine">
            <div className="Searchinput">
              <input
                type="text"
                placeholder="검색"
                onChange={(e) => {
                  setText(e.target.value);
                  console.log(name);
                }}
              ></input>
            </div>
            <div className="Searchbtn">
              <button
                type="button"
                onClick={() => {
                  axios({
                    url: "http://localhost:8050/search/board",
                    method: "GET",
                    data: name,
                  }).then((response) => {
                    console.log(response.data);
                  });
                }}
              >
                검색
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Search;
