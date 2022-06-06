import React, {
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Button } from "@mui/material";
import styles from "./table.module.css";
import { DeleteOutline, ModeEdit } from "@mui/icons-material";
import OutsideClickHandler from "react-outside-click-handler";
import ConfirmModal from "../../components/modals/ConfirmModal";
import AlertModal from "../../components/modals/AlertModel";

const Modals = forwardRef(
  (
    {
      id,
      role,
      editHandler,
      deleteHandler,
      approveHandler,
      invite,
      editButtonStyle,
      ...rest
    },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => {
      setOpen(true);
    };
    const handleClose = () => setOpen(false);
    const closeModelRef = useRef();
    useImperativeHandle(ref, () => ({
      closeModelHandler() {
        handleClose();
        closeModelRef.current.closeModel();
      },
    }));

    return (
      <OutsideClickHandler onOutsideClick={() => setOpen(false)}>
        <>
          <Button id="pop" onClick={handleOpen}>
            <i
              className="bx bx-dots-horizontal-rounded"
              id="pop"
              style={{ fontSize: "1.5rem" }}
            ></i>
          </Button>
          <div
            className={styles.editModel}
            style={{
              display: open === true ? "" : "none",
              zIndex: "100",
            }}
          >
            <div style={editButtonStyle}>
              <Button
                sx={{ color: "black" }}
                id="pop"
                onMouseDown={() => editHandler(id, role)}
              >
                <ModeEdit
                  fontSize="small"
                  sx={{ marginRight: ".4rem" }}
                  id="pop"
                />{" "}
                Edit
              </Button>
            </div>

            {/* <Button sx={{ color: "black" }} id={props.id}>
            <ContentCopy fontSize="small" sx={{ marginRight: "4px" }} />{" "}
            Duplicate Load
          </Button> */}
            <div sx={{ color: "black", display: "flex" }} id={rest.id}>
              {invite ? (
                <div style={{ display: "flex" }}>
                  <button
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      marginLeft: ".3rem",
                      marginRight: ".3rem",
                      paddingTop: ".2rem",
                    }}
                    id="pop"
                  >
                    <i className="bx bxs-check-circle bx-sm" id="pop"></i>
                  </button>
                  <AlertModal
                    type="Approve"
                    title="Approved!!"
                    button1="Close"
                    button2="Okay!"
                    navigateTo="#"
                    handleClick={() => approveHandler(id, role)}
                    style={{
                      fontWeight: "500",
                      fontSize: "1rem",
                      color: "black",
                      backgroundColor: "white",
                    }}
                    id="pop"
                  />
                </div>
              ) : (
                <div style={{ display: "flex" }}>
                  <button
                    style={{
                      color: "black",
                      backgroundColor: "white",
                      marginLeft: ".3rem",
                    }}
                    id="pop"
                  >
                    <DeleteOutline fontSize="medium" id="pop" />{" "}
                  </button>
                  <ConfirmModal
                    type="Delete"
                    title="Are you sure you want to delete this Info."
                    subtitle="You cannot undo this action "
                    button1="Yes"
                    button2="No"
                    handleYes={() => deleteHandler(id, role)}
                    style={{
                      fontWeight: "500",
                      fontSize: "1rem",
                      color: "black",
                      backgroundColor: "white",
                    }}
                    ref={closeModelRef}
                    id="pop"
                  />
                </div>
              )}
            </div>
          </div>
        </>
      </OutsideClickHandler>
    );
  }
);

export default Modals;
