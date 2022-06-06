import React, { useState, useRef } from 'react';
import DynamicForm from '../../DynamicForm/Form';
import LoadFrom from './load_form';
import Style from './loadForm.module.css';

const CreateLoad = () => {
  const [showForm, setShowForm] = useState(0);
  const [choice, setChoice] = useState('Broker');
  const callApi = useRef();
  const formHandler = () => {
    setShowForm((prev) => !prev);
  };
  const callBrokerApiParent = () => {
    callApi.current.callBrokerHandler();
  };

  const callOthersApiParent = () => {
    callApi.current.callOthersHandler();
  };
  return (
    <main id={Style.base}>
      <LoadFrom formHandler={formHandler} handler={setChoice} ref={callApi} />
      {showForm ? (
        <div className={Style.popUp}>
          <DynamicForm
            typeProp={choice}
            formHandler={formHandler}
            callApiParent={
              choice === 'Broker' ? callBrokerApiParent : callOthersApiParent
            }
          />
        </div>
      ) : null}
    </main>
  );
};

export default CreateLoad;
