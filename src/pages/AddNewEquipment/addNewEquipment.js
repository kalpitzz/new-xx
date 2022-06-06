import React, { useState, useRef } from 'react';
import AddNewTruck from '../AddNewTruckForm';
import DynamicForm from '../DynamicForm/Form';
import style from './addNewEquipment.module.css';
import EquipmentAction from '../../redux/actions/equipmentAction';
import { useDispatch, useSelector } from 'react-redux';

const AddNewEquipment = ({
  truckFormHandler,
  typeProp = false,
  callApiParent,
}) => {
  const [showTrailer, setShowTrailer] = useState(0);
  const [showDriver, setShowDriver] = useState(0);
  const callApi = useRef();
  const dispatch = useDispatch();

  const trailerFormHandler = () => {
    // dispatch(EquipmentAction.isPopUp(true));
    dispatch(EquipmentAction.isPopUp(true));
    setShowTrailer((prev) => !prev);
  };

  const driverFormHandler = () => {
    setShowDriver((prev) => !prev);
  };

  const callTrailerApiParent = () => {
    callApi.current.callTrailerHandler();
  };

  const callDriverApiParent = () => {
    callApi.current.callDriverHandler();
  };
  return (
    <main id={style.base}>
      <AddNewTruck
        typeProp={typeProp ? typeProp : 'Truck'}
        truckFormHandler={truckFormHandler}
        trailerFormHandler={trailerFormHandler}
        driverFormHandler={driverFormHandler}
        ref={callApi}
        callApiParent={callApiParent}
      />
      {showTrailer ? (
        <div className={style.popUp}>
          <AddNewTruck
            typeProp={'Trailer'}
            trailerFormHandler={trailerFormHandler}
            callApiParent={callTrailerApiParent}
          />
        </div>
      ) : null}
      {showDriver ? (
        <div className={style.popUp}>
          <DynamicForm
            typeProp={'Driver'}
            formHandler={driverFormHandler}
            callApiParent={callDriverApiParent}
          />{' '}
        </div>
      ) : null}
    </main>
  );
};

export default AddNewEquipment;
