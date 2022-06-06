import ThemeReducer from './ThemeReducer';
import FormReducer from './FormReducer';
import equipmentReducer from './equipmentReducer';
import { combineReducers } from 'redux';
import LoadReducer from './LoadReducer';
import NoteReducer from './NoteReducer';
import FileReducer from './FileReducer';
import DispatchReducer from './DispatchReducer';
import DispatchFileReducer from './DispatchFileReducer';
import DispatchNoteReducer from './DispatchNoteReducer';
import DashboardReducer from './DashboardReducer';
import WebSocketReducer from './WebSocketReducer';
const rootReducer = combineReducers({
  ThemeReducer,
  FormReducer,
  equipmentReducer,
  LoadReducer,
  NoteReducer,
  FileReducer,
  DispatchReducer,
  DispatchFileReducer,
  DispatchNoteReducer,
  DashboardReducer,
  WebSocketReducer,
});

export default rootReducer;
