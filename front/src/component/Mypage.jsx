import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Pagination from "react-js-pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import "../css/Mypage.css";
import styled from "styled-components";

export default function Mypage(userId, setUserId, nickname) {
  useEffect(() => {
    axios({
      url: "http://localhost:8050/post/my",
      method: "get",
      withCredentials: true,
    }).then((data) => {
      setList(data.data.list);
      console.log(data.data.list);
    });
  }, []);
  const PaginationBox = styled.div`
    a:link {
      color: black;
    }
    .pagination {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    ul.pagination li {
      display: inline-block;
      width: 30px;
      height: 30px;
      border: 1px solid #e2e2e2;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
    }
    ul.pagination li:first-child {
      border-radius: 5px 0 0 5px;
    }
    ul.pagination li:last-child {
      border-radius: 0 5px 5px 0;
    }
    ul.pagination li a {
      text-decoration: none;
      color: #4545ac;
      font-size: 1rem;
    }
    ul.pagination li.active a {
      color: white;
    }
    ul.pagination li.active {
      background-color: #4545ac;
    }
    ul.pagination li a:hover,
    ul.pagination li a.active {
      color: white;
    }
  `;

  const columns = [
    { id: "number", label: "번호", minWidth: 40 },
    { id: "title", label: "제목", minWidth: 200 },
    {
      id: "time",
      label: "작성일",
      minWidth: 100,
      align: "center",
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "clicked",
      label: "조회수",
      minWidth: 50,
      align: "center",
      format: (value) => value.toFixed(2),
    },
    {
      id: "like",
      label: "추천",
      minWidth: 30,
      align: "center",
      format: (value) => value.toFixed(2),
    },
  ];
  const { name } = useParams();
  const [err, setErr] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [list, setList] = useState([]);
  const handlePageChange = (page) => {
    setPage(page);
  };
  useEffect(() => {
    setPage(1);
    axios
      .get(`http://localhost:8050/gallery?name=${encodeURIComponent(name)}`)
      .then((data) => {
        if (data.data.code == 400) {
          setErr(true);
        } else {
          setTotal(data.data.cnt);
        }
      });
  }, [name]);
  useEffect(() => {
    if (err == false && total != 0) {
      axios
        .get(
          `http://localhost:8050/gallery/list?page=${page}&name=${encodeURI(
            name
          )}`
        )
        .then((data) => {
          setList(data.data.list);
          console.log(data.data.list);
        });
    }
    if (total == 0) {
      setList([]);
    }
  }, [page, total]);
  return (
    <>
      <div className="mypage-wrapper">
        <div className="mypage-left">
          <div>
            <Link to={"/mypage"}>
              <button className="left-mypage">나의 게시글</button>
            </Link>
          </div>
          <div>
            <Link to={"/fix"}>
              <button className="left-fix">회원 정보 수정</button>
            </Link>
          </div>
        </div>
        <div className="mypage-right">
          <div className="right-title">
            <div className="my-title">나의 게시글</div>
            <hr />
          </div>
          <div className="right-list">
            <TableContainer sx={{ maxHeight: 800 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                        overflow={column.overflow}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {list.length !== 0 &&
                    list.map((v, key) => {
              
                      let date = new Date(v.createdAt);
      let sendDate =
        date.getFullYear() +
        "." +
        (parseInt(date.getMonth()) + 1) +
        "." +
        date.getDate() +
        " ";
      
        sendDate += date.getHours() + ":";
      
      sendDate += +date.getMinutes();
                      return (
                        <TableRow
                          align="center"
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={v.id}
                        >
                          <TableCell>{v.id}</TableCell>
                          <TableCell>
                            <div
                              style={{
                                whiteSpace: "nowrap",
                                textOverflow: "ellipsis",
                                width: "300px",
                                overflow: "hidden",
                              }}
                            >
                              <Link
                                style={{
                                  textDecoration: "none",
                                }}
                                to={"/post/" + v.gallery + "/" + v.id}
                              >
                                {v.title}
                              </Link>
                            </div>
                          </TableCell>

                          <TableCell>
                            {sendDate}
                          </TableCell>
                          <TableCell align="center">{v.clicked}</TableCell>
                          <TableCell align="center">{v.like}</TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>
           
          </div>
        </div>
      </div>
    </>
  );
}
