import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Button, Box, Modal } from '@mui/material';

import styles from './model.module.css';
import { useNavigate } from 'react-router-dom';

const ConfirmModal = forwardRef(({ style, ...props }, ref) => {
  let navigate = useNavigate();
  const handleClick = props.handleClick;
  const handleOkay = props.handleOkay;

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    navigate(props.navigateTo);
    handleOkay();
  };

  useImperativeHandle(ref, () => ({
    showModel() {
      handleOpen();
    },
  }));

  return (
    <>
      <button
        onClick={handleClick}
        className={styles.typeButton}
        type={props.typeoff}
        style={style}
        id="pop"
      >
        {props.type}
      </button>
      <Modal open={open} onClose={handleClose}>
        <Box className={styles.box}>
          <h4>{`${props.title}`}</h4>
          <p>{props.subtitle}</p>
          <Box className={styles.buttonWrap}>
            <Button
              variant="contained"
              className={styles.button}
              onClick={handleClose}
            >
              {props.button1}
            </Button>
            <Button
              variant="contained"
              className={styles.button}
              onClick={handleClose}
            >
              {props.button2}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
});

export default ConfirmModal;
