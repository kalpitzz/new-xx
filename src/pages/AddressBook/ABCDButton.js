import React, { useState } from 'react';
import style from './AddressBook.module.css';

const ABCDButton = (props) => {
  let i = 65;
  let j = 91;
  let ABCDArray = [];
  const [activeButton, setActiveButton] = useState('All');
  for (let k = i; k < j; k++) {
    const element = String.fromCharCode(k);
    ABCDArray.push(element);
  }
  //   const handleChange = (e) => {
  //     console.log(e.target.value);
  //   };
  return (
    <>
      <button
        value=""
        onClick={props.fun}
        onMouseDown={(e) => setActiveButton(e.target.innerText)}
        className={`${style.abcdButtonStyle} ${
          activeButton === 'All' ? style.abcActive : ''
        }`}
      >
        All
      </button>
      {ABCDArray.map((val, index) => {
        return (
          <button
            value={val}
            onClick={props.fun}
            onMouseDown={(e) => setActiveButton(e.target.innerText)}
            className={`${style.abcdButtonStyle} ${
              activeButton === val ? style.abcActive : ''
            }`}
            key={index}
          >
            {val}
          </button>
        );
      })}
    </>
  );
};

// console.log(ABCDArray);
export default ABCDButton;
