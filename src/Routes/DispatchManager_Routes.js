import {
  AllForm,
  CreateLoadForm,
  Dashboard,
  DispatchPreview,
  DispatchSummary,
  Dispatch_table,
  DriverStatus,
  EditNote,
  Loads,
  LoadTable,
  Notes,
  ShipperForm,
  StatusForm,
  ChecKCall,
  Live_location,
  NotificationTab,
  FetchLocation
} from '../pages';
import { DynamicForm } from '../pages';
import { OwnerForm } from '../pages';
import { DynamicFormPreview } from '../pages';
import { OwnerDetailsPreview } from '../pages';
import { AddressBook } from '../pages';
import { OwnerInvite } from '../pages';
import { EquipmentDetailsPreview } from '../pages';
import { EquipmentTable } from '../pages';
import { AddnewTruck } from '../pages';
import { AddNewEquipment } from '../pages';
import { Dispatch } from '../pages';

export const DispatchManager_Routes = [
  {
    path: '/',
    component: <Dashboard />,
  },

  {
    path: '/dynamicForm',
    component: <DynamicForm />,
  },
  {
    path: '/OwnerForm',
    component: <OwnerForm />,
  },
  {
    path: '/dynamicFormPreview',
    component: <DynamicFormPreview />,
  },
  {
    path: '/OwnerFormPreview',
    component: <OwnerDetailsPreview />,
  },
  {
    path: '/AddressBook',
    component: <AddressBook />,
  },
  {
    path: '/OwnerInvite',
    component: <OwnerInvite />,
  },

  {
    path: '/truck_details_preview',
    component: <EquipmentDetailsPreview />,
  },
  {
    path: '/trailer_details_preview',
    component: <EquipmentDetailsPreview />,
  },
  {
    path: '/equipment',
    component: <EquipmentTable />,
  },

  {
    path: '/equipment/trailerform',
    component: <AddnewTruck />,
  },
  {
    path: '/equipment/addNewEquipment',
    component: <AddNewEquipment />,
  },

  {
    path: '/live_location',
    component: <Live_location />,
  },
  {
    path: '/loadtable',
    component: <LoadTable />,
  },
  {
    path: 'loadtable/createload',
    component: <CreateLoadForm />,
  },
  {
    path: '/loadtable/loaddetails',
    component: <Loads />,
  },
  {
    path: 'loadtable/loaddetails/note',
    component: <Notes />,
  },

  {
    path: 'loadtable/status',
    component: <StatusForm />,
  },
  {
    path: '/dispatch',
    component: <Dispatch />,
  },
  {
    path: '/driverstatus',
    component: <DriverStatus />,
  },

  {
    path: '/dispatchtable',
    component: <Dispatch_table />,
  },
  {
    path: '/dispatchtable/dispatchsummary',
    component: <DispatchPreview />,
  },
  {
    path: '/dispatchtable/dispatchsummary/note',
    component: <Notes />,
    path: '/dispatchsummery',
    component: <DispatchSummary />,
  },
  {
    path: '/check_call',
    component: <ChecKCall />,
  },
  {
    path: '/notificationTab',
    component: <NotificationTab />,
  },
  {
    path: '/fetchLocation',
    component: <FetchLocation />,
  },
];
