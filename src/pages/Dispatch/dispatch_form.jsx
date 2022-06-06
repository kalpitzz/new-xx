import React, { useState, useRef } from 'react';
import DynamicForm from '../../pages/DynamicForm/Form';
import TrailerForm from '../../pages/AddNewTruckForm/index';
import TruckForm from '../../pages/AddNewEquipment/addNewEquipment';
import { useDispatch } from 'react-redux';
import Dispatch_form from './dispatch';
// import EquipmentAction from '../../redux/actions/equipmentAction';
import Style from './dispatch.module.css';
const DispatchForm = ({ dispatchDetails }) => {
  const [showDriverForm, setShowDriverForm] = useState(0);
  const [showTruckForm, setShowTruckForm] = useState(0);
  const [showTrailerForm, setShowTrailerForm] = useState(0);
  //   const [formType,setFormType]=useState('')
  const callApi = useRef();
  // const dispatch = useDispatch();
  const driverformHandler = () => {
    setShowDriverForm((prev) => !prev);
  };
  const truckformHandler = () => {
    setShowTruckForm((prev) => !prev);
  };
  const trailerformHandler = () => {
    // dispatch(EquipmentAction.setType('Trailer'));
    setShowTrailerForm((prev) => !prev);
  };

  const callDriverApiParent = () => {
    callApi.current.callDriverHandler();
  };
  const callTruckApiParent = () => {
    callApi.current.callTruckHandler();
  };
  const callTrailerApiParent = () => {
    callApi.current.callTrailerHandler();
  };
  return (
    <main id={Style.base}>
      <Dispatch_form
        driverFormHandler={driverformHandler}
        truckFormHandler={truckformHandler}
        trailerFormHandler={trailerformHandler}
        ref={callApi}
        dispatchDetails={dispatchDetails ? dispatchDetails[0] : ''}
      />
      {showDriverForm ? (
        <div className={Style.popUp}>
          <DynamicForm
            typeProp={'Driver'}
            formHandler={driverformHandler}
            callApiParent={callDriverApiParent}
          />
        </div>
      ) : null}
      {showTrailerForm ? (
        <div className={Style.popUp}>
          <TrailerForm
            typeProp="Trailer"
            trailerFormHandler={trailerformHandler}
            callApiParent={callTrailerApiParent}
          />
        </div>
      ) : null}
      {showTruckForm ? (
        <div className={Style.popUp}>
          <TruckForm
            typeProp="Dispatch_Truck"
            truckFormHandler={truckformHandler}
            callApiParent={callTruckApiParent}
          />
        </div>
      ) : null}
    </main>
  );
};

export default DispatchForm;
