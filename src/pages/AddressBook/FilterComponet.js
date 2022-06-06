import React, { useState } from "react";
import style from "./AddressBook.module.css";
import BookData from "../../assets/JsonData/AdressBook-data.json";
const FilterComponet = (props) => {
  // console.log(props);
  const { data, ForFilter } = props;
  const [order, setorder] = useState("All Loads");
  const handleChange = () => {
    console.log("hi from filterCompont");
  };
  //   const forfil = props.For;
  // const data = props.Data;
  //   console.log(For);
  console.log(data);
  return (
    <select value={order} onChange={handleChange} className={style.select}>
      {data.map((da) => {
        // console.log(Object.values(da).join(" "));
        // console.log(da.email);
        return <option value={da.email}>{da.email}</option>;
      })}
    </select>
  );
};

export default FilterComponet;
