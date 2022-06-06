import React, { useState } from 'react';
import { Box } from '@mui/material';
import OutsideClickHandler from 'react-outside-click-handler';
import style from './navBarModel.module.css';
import { Add } from '@material-ui/icons';

const NavBarModel = ({ buttonTag, list = [], parentFunction, buttonStyle }) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen((prev) => !prev);
  };
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={handleClick} className={`${style.mainButton}`}>
        <Add style={{ marginRight: '.5rem' }} />
        {buttonTag}
      </button>
      <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
        <Box className={style.box} style={{ display: open ? '' : 'none' }}>
          {list.map((item, index) => (
            <div
              className={style.mapedDiv}
              onClick={() => parentFunction(item.text)}
              key={index}
            >
              <p
                className={style.badge}
                style={{ backgroundColor: item.color }}
              >
                {item.text.charAt(0)}
              </p>
              <p className={style.text}> {item.text}</p>
            </div>
          ))}
        </Box>
      </OutsideClickHandler>
    </div>
  );
};

export default NavBarModel;
