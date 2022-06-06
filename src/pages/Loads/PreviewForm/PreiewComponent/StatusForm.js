/* */

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import produce from "immer";
import { CloseOutlined } from "@mui/icons-material";
import { Button, Box, Modal } from "@mui/material";
import style from "../PreviewForm.module.css";
import useAxios from "../../../../hooks/useAxios";
import { Formik, Form } from "formik";
import { useDispatch } from "react-redux";
import LoadAction from "../../../../redux/actions/LoadAction";
import FormikTextFiled from "../../../../components/Formfield/formikControl";
import * as Yup from "yup";
const StatusForm = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  console.log(state);

  //model state
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    navigate(-1);
  };
  const AxiosApi = useAxios();
  const dispatch = useDispatch();

  const location = useLocation();
  console.log(location);
  //---------------------------------------------------------------------------------intial value-----------------------------------------------

  const validate = Yup.object({
    status_reason: Yup.string().required("Enter the reason"),
  });

  const intialValue = {
    id: parseFloat(state.id),
    status: state.status,
    status_reason: "",
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{ ...style, width: "80%", color: "black" }}
          className={style.notesBox}
        >
          <div style={{ textAlign: "right" }}>
            <Button onClick={handleClose}>
              <CloseOutlined />
            </Button>
          </div>

          <Formik
            initialValues={intialValue}
            validationSchema={validate}
            onSubmit={(data) => {
              console.log(data);
              AxiosApi.patch(
                `${
                  location.state.from === "dispatch"
                    ? `dispatch/${location.state.id}/cancel_dispatch/`
                    : "load/load/change_status/"
                }`,
                data
              ).then(() => {
                AxiosApi("load/load/").then((res) => {
                  dispatch(LoadAction.setTableData(res));
                  handleClose();
                });
              });
            }}
          >
            {() => (
              <Form style={{ alignItems: "center", width: "100%" }}>
                <div>
                  <FormikTextFiled
                    control="textarea"
                    // className={style.notesInput}
                    placeholder="Enter the reason"
                    type="text"
                    variant="filled"
                    name="status_reason"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    sx={{
                      width: "100%",
                    }}
                    style={{ marginTop: "1rem" }}
                  >
                    Done
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>
    </>
  );
};

export default StatusForm;
