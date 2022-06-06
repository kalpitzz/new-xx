import React, { useState } from 'react';
import style from './Table.module.css';
const Navbar = ({ setresponse }) => {
  const [clicked, setClicked] = useState('Truck');

  const clickHandler = (item) => {
    setClicked(item);
    setresponse(item);
  };
  return (
    <div className={`${style.navheader} `}>
      <button
        className={`${style.navButton} ${
          clicked === 'Truck' ? style.active : ''
        }`}
        onClick={() => clickHandler('Truck')}
      >
        Truck
      </button>
      <button
        className={`${style.navButton} ${
          clicked === 'Trailer' ? style.active : ''
        }`}
        onClick={() => clickHandler('Trailer')}
      >
        Trailer
      </button>
    </div>
  );
};

export default Navbar;
