import React from "react";
import style from "./Texterror.module.css";
const Texterror = (props) => {
  return <div className={`${style.errorDiv} "error"`}>{props.children}</div>;
};

export default Texterror;
