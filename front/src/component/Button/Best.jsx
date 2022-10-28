import React from "react";
import Switch from '@mui/material/Switch'

const Best = ({setChecked}) => {

    return (
    <>
    <div>
     <label style={{fontWeight:"900"}}>일반</label>
     <Switch onChange={(e)=>{
        console.log(e.target.checked);
        setChecked(e.target.checked);
     }}></Switch>
     <label style={{fontWeight:"900"}}>개념글</label>
    </div>
    </>
    )
}
export default Best;