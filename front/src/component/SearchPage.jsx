import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Pagination from "react-js-pagination";
import styled from "styled-components";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import ErrorPage from "./ErrorPage";
import ImageIcon from '@mui/icons-material/Image';
import Best from "./Button/Best";
import "../css/Board.css";
export const SearchPage = (props) => {
    const columns = [
        { id: "number", label: "번호", minWidth: 100 },
        { id: "title", label: "제목", minWidth: 350 },
        {
            id: "name",
            label: "이름",
            minWidth: 10,
            align: "center",
            format: (value) => value.toLocaleString("en-US"),
        },
        {
            id: "time",
            label: "갤러리",
            minWidth: 50,
            align: "center",
            format: (value) => value.toLocaleString("en-US"),
        },
        {
            id: "clicked",
            label: "조회수",
            minWidth: 5,
            align: "center",
            format: (value) => value.toFixed(2),
        },
        {
            id: "like",
            label: "추천",
            minWidth: 5,
            align: "center",
            format: (value) => value.toFixed(2),
        },
    ];
    const { content } = useParams();
    const [list, setList] = useState([]);

    useEffect(() => {
        axios({
            url: "http://localhost:8050/search/board",
            method: "get",
            params:{name:encodeURI(content)},
            withCredentials: true,
          }).then((data) => {
            setList(data.data.list);
            console.log(data.data);
          });

    }, []);
    return (
        <>  
        <h2>
            검색결과
        </h2>
            <TableContainer sx={{ maxHeight: 800 }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {list.length !== 0 &&
                  list.map((v, key) => {
                    
                    return (
                      <TableRow
                        align="center"
                        hover
                        role="checkbox"
                        tabIndex={-1}
                        key={v.id}
                      >
                        <TableCell >{v.id}</TableCell>
                        <TableCell>
                          <div
                            style={{
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                              width: "300px",
                              overflow: "hidden",
                              display: "flex",
                              alignItems: "center"
                            }}
                          >
                            {v.img && <ImageIcon />}
                            <Link
                              style={{ textDecoration: "none" }}
                              to={"/post/" + v.name + "/" + v.id}
                            >
                              {v.title}{" "}
                              <span style={{ color: "purple" }}>
                                [{v.commentCount}]
                              </span>
                            </Link>
                          </div>
                        </TableCell>

                        <TableCell align="center">{v.nickName}</TableCell>
                        <TableCell align="center">{v.name}</TableCell>
                        <TableCell align="center">{v.clicked}</TableCell>
                        <TableCell align="center">{v.like}</TableCell>
                      </TableRow>
                    );
                  })}
              </TableBody>
            </Table>
          </TableContainer>
        </>
    );
};
