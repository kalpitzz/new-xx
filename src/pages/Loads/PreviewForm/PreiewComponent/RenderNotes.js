import React, { useEffect, useState, useRef } from 'react';
import { Paper } from '@mui/material';
import Modals from '../../../../components/tableModal/Modals';
import { useLocation, useNavigate } from 'react-router-dom';
import useAxios from '../../../../hooks/useAxios';
import { saveAs } from 'file-saver';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FileAction from '../../../../redux/actions/FileAction';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import NoteAction from '../../../../redux/actions/NoteAction';
import DispatchFileAction from '../../../../redux/actions/DispatchFileAction';
import DispatchNoteAction from '../../../../redux/actions/DispatchNoteAction';
import style from '../PreviewForm.module.css';
const Note = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const AxiosApi = useAxios();
  const dispatch = useDispatch();
  const closetableModelRef = useRef();
  const isOpenModel = useRef();
  const noteDeleteHandler = (id) => {
    AxiosApi.delete(
      `${
        props.from === 'dispatch_note'
          ? `dispatch/notes/${id}/?dispatch_id=${location.state}`
          : `load/load_notes/${id}/?load_id=${location.state}`
      }`
    ).then((res) => {
      props.from === 'dispatch_note'
        ? dispatch(DispatchNoteAction.setDispatchNoteDelete(id))
        : dispatch(NoteAction.setDeleteData(id));
    });
    closetableModelRef.current.closeModelHandler();
  };

  const editNoteHandler = (id) => {
    navigate('note', {
      state: { type: 'edit', id: id, load: location.state, from: props.from },
    });
    // return (
    //   <>
    //     <p>open the notes</p>
    //     <Notes ref={isOpenModel} />
    //   </>
    // );
  };

  const documentDeleteHandler = (id) => {
    AxiosApi.delete(
      `${
        props.from === 'dispatch_document'
          ? `dispatch/documents/${id}/?dispatch_id=${location.state}`
          : `load/load_document/${id}/?load_id=${location.state}`
      }`
    ).then(() => {
      props.from === 'dispatch_document'
        ? dispatch(DispatchFileAction.setDispatchFileDelete(id))
        : dispatch(FileAction.setDeleteData(id));
    });
    closetableModelRef.current.closeModelHandler();
  };

  const handleDownload = (e) => {
    const document_id_postion = e.indexOf(',');

    const document_id = e.slice(0, document_id_postion);

    saveAs(
      `${
        props.from === 'dispatch_document'
          ? `http://metrotmsdev-env.eba-7x2223y6.us-east-1.elasticbeanstalk.com/dispatch/documents/document-download/?dispatch_id=${location.state}&document_id=${document_id}`
          : `http://metrotmsdev-env.eba-7x2223y6.us-east-1.elasticbeanstalk.com/load/load_document/${location.state}/document-download/?document_id=${document_id}`
      }`,
      `${e}`
    );
  };

  let array = props.data;

  if (props.type === 'file') {
    return array.length === 0
      ? 'No data available'
      : array.map((note, index) => (
          <Paper
            sx={{
              width: '200px',
              maxHeight: '200px',
            }}
            style={{
              backgroundColor: 'Lightgray',
              margin: '10px',
              padding: '10px',
              borderRadius: '20px',
              maxHeight: 'max-content',
            }}
            key={index}
          >
            <Modals
              deleteHandler={documentDeleteHandler}
              // editHandler={editHandler}
              id={note.id}
              ref={closetableModelRef}
              editButtonStyle={{ display: 'none' }}
            />

            <a href={`${note.document}`} target="_blank">
              <span class={`bx bxs-file-blank ${style.documentIcon}`}></span>
            </a>
            <div style={{ textAlign: 'center' }}>
              <h4>{note.document_filename}</h4>
              <Button
                value={[note.id, note.document_filename]}
                onClick={(e) => {
                  handleDownload(e.target.value);
                }}
              >
                <FileDownloadOutlinedIcon /> Download
              </Button>
            </div>
          </Paper>
        ));
  } else {
    return array === undefined
      ? ''
      : array.length === 0
      ? 'no data available'
      : array.map((note, index) => (
          <Paper className={style.notesRender} key={index}>
            <Modals
              deleteHandler={noteDeleteHandler}
              editHandler={editNoteHandler}
              id={note.id}
              ref={closetableModelRef}
            />
            <h4>{note.title}</h4>
            <p>{note.description}</p>
          </Paper>
        ));
  }
};

export default Note;
