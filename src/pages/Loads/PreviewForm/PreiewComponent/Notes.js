/* */

import React, {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
// import produce from "immer";
import { Add, CloseOutlined, ConstructionOutlined } from "@mui/icons-material";
import {
  Input,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Modal,
} from "@mui/material";
import style from "../PreviewForm.module.css";
import useAxios from "../../../../hooks/useAxios";
import { Formik, Form } from "formik";
import FormikTextFiled from "../../../../components/Formfield/formikControl";
import { useDispatch, useSelector } from "react-redux";
import NoteAction from "../../../../redux/actions/NoteAction";
import FileAction from "../../../../redux/actions/FileAction";
import DispatchFileAction from "../../../../redux/actions/DispatchFileAction";
import DispatchNoteAction from "../../../../redux/actions/DispatchNoteAction";
import Note from "./RenderNotes";

const Notes = forwardRef(({ name, from }, ref) => {
  console.log(from);
  const location = useLocation();
  const navigate = useNavigate();

  console.log(location);
  console.log(location.state === null);

  //model state
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    if (location.state.type === "edit" || location.state === null) navigate(-1);
  };
  const AxiosApi = useAxios();
  const dispatch = useDispatch();
  // const state = useSelector((state) => {
  //   return state.NoteReducer;
  // });
  const noteData = useSelector((state) =>
    from || location?.state?.from === "dispatch_note"
      ? state.DispatchNoteReducer.noteData
      : state.NoteReducer.noteData
  );
  const fileData = useSelector((state) =>
    from === "dispatch_document"
      ? state.DispatchFileReducer.fileData
      : state.FileReducer.fileData
  );

  console.log(fileData);
  console.log(noteData);
  useImperativeHandle(ref, () => ({
    isOpen() {
      setOpen(true);
    },
  }));

  //   notes states

  const [Data, setData] = useState([{}]);
  const [files, setfiles] = useState([{}]);

  const [EditData, setEditData] = useState([{}]);

  useEffect(() => {
    if (location?.state?.type === "edit") {
      setOpen(true);
      const editData = noteData.filter((res) => {
        console.log(res);
        return res.id === location?.state?.id;
      });
      console.log(editData);
      setEditData(editData);
    } else if (name === "document" && !fileData) {
      AxiosApi(
        `${
          from === "dispatch_document"
            ? `dispatch/documents/?dispatch_id=${location?.state}`
            : `load/load_document/?load_id=${location?.state}`
        }`
      ).then((res) => {
        console.log(" document api call ");
        from === "dispatch_document"
          ? dispatch(DispatchFileAction.setDispatchFileData(res))
          : dispatch(FileAction.setFileData(res));
        setfiles(res);
      });
    } else if (name === "document") {
      setfiles(fileData);
    } else if (!noteData) {
      AxiosApi(
        `${
          from || location?.state?.from === "dispatch_note"
            ? `dispatch/notes/?dispatch_id=${location?.state}`
            : `load/load_notes/?load_id=${location?.state}`
        }`
      ).then((res) => {
        console.log(" note api call");
        from === "dispatch_note"
          ? dispatch(DispatchNoteAction.setDispatchNoteData(res))
          : dispatch(NoteAction.setNoteData(res));
        setData(res);
      });
    } else {
      setData(noteData);
    }
  }, [noteData, fileData]);

  // useEffect =
  //   (() => {
  //     setData(noteData);
  //   },
  //   [state]);

  console.log(noteData);

  //---------------------------------------------------------------------------------intial value-----------------------------------------------
  const notesIntialData = {
    load: `${
      location?.state?.type === "edit"
        ? parseFloat(
            location?.state?.from === "dispatch_note"
              ? EditData[0].dispatch
              : EditData[0]?.load
          )
        : location?.state
    }`,
    title: `${location?.state?.type === "edit" ? EditData[0]?.title : ""}`,
    description: `${
      location?.state?.type === "edit" ? EditData[0]?.description : ""
    }`,
  };
  const fileIntialData = {
    load: location.state,
    name: "",
    document: "",
  };

  // const formDataGene = (data) => {
  //   let form = new FormData()
  //   if (from === 'dispatch_document') {
  //     form.append("load", data?.load);
  //     form.append("name", data?.name);
  //     form.append("document", data?.document);
  //   }
  //   else if (from === 'load_document') {
  //     form.append("dispatch", data?.load);
  //     form.append("name", data?.name);
  //     form.append("document", data?.document);
  //   }
  //   return form
  // }

  return (
    <>
      <Button
        variant="contained"
        onClick={handleOpen}
        style={{ margin: "2% 0% 2% 80%" }}
      >
        <Add />
        {`${name === "document" ? "Upload Document" : "Add Notes"}`}
      </Button>

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
            initialValues={
              name === "document" ? fileIntialData : notesIntialData
            }
            onSubmit={(data) => {
              console.log(data);

              // ---------------------------------------------------------post note edit data---------------------------------------------------------
              if (location.state.type === "edit") {
                console.log(location?.state?.load);
                let form = new FormData();
                form.append(
                  `${
                    from || location?.state?.from === "dispatch_note"
                      ? "dispatch"
                      : "load"
                  }`,
                  data?.load
                );
                form.append("title", data?.title);
                form.append("description", data?.description);
                AxiosApi.patch(
                  `${
                    from || location?.state?.from === "dispatch_note"
                      ? `dispatch/notes/${location?.state?.id}/?dispatch_id=${location?.state?.load}`
                      : `load/load_notes/${location?.state?.id}/?load_id=${location?.state?.load}`
                  }`,
                  form
                ).then((res) => {
                  console.log(res);
                  from || location?.state?.from === "dispatch_note"
                    ? dispatch(DispatchNoteAction.setDispatchNoteEdit(res))
                    : dispatch(NoteAction.setEditData(res));
                  navigate(-1);
                  // handleClose();
                });
              }

              // ----------------------------------------------document post ---------------------------------------------------------------
              else if (name === "document") {
                let form = new FormData();
                form.append(
                  `${from === "dispatch_document" ? "dispatch" : "load"}`,
                  data?.load
                );
                form.append("name", data?.name);
                form.append("document", data?.document);
                AxiosApi.post(
                  `${
                    from === "dispatch_document"
                      ? "dispatch/documents/"
                      : "load/load_document/"
                  }`,
                  form
                ).then((res) => {
                  console.log(res);
                  from === "dispatch_document"
                    ? dispatch(DispatchFileAction.setDispatchFilePost(res))
                    : dispatch(FileAction.setPostData(res));
                  handleClose();
                });
              }
              // ---------------------------------------------------------------------note post-----------------------------------------------
              else {
                let form = new FormData();
                form.append(
                  `${from === "dispatch_note" ? "dispatch" : "load"}`,
                  data?.load
                );
                form.append("title", data?.title);
                form.append("description", data?.description);

                AxiosApi.post(
                  `${
                    from === "dispatch_note"
                      ? "dispatch/notes/"
                      : "load/load_notes/"
                  }`,
                  form
                ).then((res) => {
                  console.log(res);
                  from === "dispatch_note"
                    ? dispatch(DispatchNoteAction.setDispatchNotePost(res))
                    : dispatch(NoteAction.setPostNoteData(res));
                  handleClose();
                  // setData(res);
                });
                handleClose();
              }
            }}
          >
            {({ setFieldValue }) => (
              <Form style={{ alignItems: "center", width: "100%" }}>
                <div
                  style={{
                    display: name === "document" ? "none" : "",
                  }}
                >
                  <FormikTextFiled
                    control="input"
                    placeholder="Enter Heading"
                    type="text"
                    name="title"
                  />

                  <br />

                  <FormikTextFiled
                    control="textarea"
                    className={style.notesInput}
                    // value={text}
                    placeholder="Enter Description"
                    type="text"
                    variant="filled"
                    name="description"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    style={{ marginTop: "1rem", width: "100%" }}
                  >
                    Add
                  </Button>
                </div>

                <div style={{ display: name === "document" ? "" : "none" }}>
                  <FormikTextFiled
                    control="file"
                    onChange={(event) => {
                      setFieldValue("document", event.currentTarget.files[0]);
                    }}
                    className={style.notesInput}
                    name="document"
                  />

                  <Button
                    type="submit"
                    variant="contained"
                    style={{ marginTop: "1rem", width: "100%" }}
                  >
                    Add
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Box>
      </Modal>

      {/* //-------------------------------------------------------render the notes and documents ------------------------------------------------------- */}

      <Grid className={style.renderMainDiv}>
        <Note
          data={name === "document" ? files : Data}
          type={name === "document" ? "file" : "note"}
          from={from}
        />
      </Grid>
    </>
  );
});

export default Notes;
