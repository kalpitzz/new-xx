import * as ActionType from '../actionType';
const setPreview = (data) => {
  return {
    type: 'SET_PREVIEW',
    payload: data,
  };
};
const setFormType = (data) => {
  return {
    type: 'SET_FORM_TYPE',
    payload: data,
  };
};
const setPreviewId = (setId) => {
  return {
    type: 'SET_PREVIEW_ID',
    payload: setId,
  };
};

const setAddressBook = (data) => {
  return {
    type: 'SET_ADDRESSBOOK',
    payload: data,
  };
};

const addAction = ({ res, role }) => {
  return {
    type: 'ADD_DATA',
    payload: {
      ...res,
      role: role,
      company_name:
        role === 'Dispatcher' ? 'MetroMax' : res.company_name || res.name,
    },
  };
};

const deleteAction = (data) => {
  return {
    type: 'DELETE',
    payload: data,
  };
};

const editAction = ({ res, role }) => {
  return {
    type: 'EDIT_DATA',
    payload: {
      ...res,
      role: role,
      company_name: role === 'Dispatcher' ? 'MetroMax' : res.company_name,
    },
  };
};

const addRole = (role) => {
  return {
    type: 'ADD_ROLE',
    payload: role,
  };
};

const setInviteDetails = (data) => {
  return {
    type: ActionType.SET_INVITATION,
    payload: data,
  };
};

const addInvite = (data) => {
  console.log(data);
  return {
    type: ActionType.ADD_INVITE,
    payload: { ...data, role: 'Invitation' },
  };
};
const exportDefault = {
  setPreview,
  setFormType,
  setPreviewId,
  setAddressBook,
  addAction,
  deleteAction,
  editAction,
  addRole,
  setInviteDetails,
  addInvite,
};

export default exportDefault;
