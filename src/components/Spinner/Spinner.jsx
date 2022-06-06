import { css } from "@emotion/react";
import HashLoader from "react-spinners/HashLoader";
import ReactDOM from 'react-dom';
import styles from "./spinner.module.css"


import React from 'react'
import { useSelector } from "react-redux";

function Spinner() {

  const override = css`
    display: block;
    position:absolute;
    margin: 20px 25px;
    
    
  `;

  const spinnerSlice = useSelector((state) => state.setSpinner)
  // 
  

  return ReactDOM.createPortal(spinnerSlice.spinner && <div className={styles.topmostDiv}> <div className={styles.parentDiv}>  <HashLoader color={"green"} loading={spinnerSlice.spinner} css={override} size={100} margin={2} /></div></div>
    , document.getElementById("spinner_view"))

}

export default Spinner