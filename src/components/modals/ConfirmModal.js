import React, { useState, forwardRef, useImperativeHandle } from "react";
import { Button, Box, Modal } from "@mui/material";

import styles from "./model.module.css";

const ConfirmModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  function handleOpen() {
    setOpen(true);
  }
  function handleClose() {
    console.log("called");
    setOpen(false);
  }
  const handleYes = props.handleYes;

  useImperativeHandle(ref, () => ({
    closeModel() {
      handleClose();
    },
  }));

  return (
    <>
      <button
        onClick={handleOpen}
        className={props.className}
        style={props.style}
        id={props.id}
        disabled={props.disabled}
      >
        {props.type}
      </button>
      <Modal open={open} onClose={handleClose} id={props.id}>
        <Box className={styles.box} id={props.id}>
          <h4>{props.title}</h4>
          <p>{props.subtitle}</p>
          <Box className={styles.buttonWrap}>
            <Button
              variant="contained"
              className={styles.button}
              onClick={handleYes}
              id={props.id}
            >
              {props.button1}
            </Button>
            <Button
              variant="contained"
              className={styles.button}
              onClick={handleClose}
              id={props.id}
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
