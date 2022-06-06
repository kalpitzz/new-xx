import React from 'react';
import { ErrorMessage, Field, useField } from 'formik';
import inputStyle from '../Input/Input.module.css';
import Texterror from '../TextError/Texterror';
import PhoneInput from 'react-phone-input-2';
import './style.css';

function PhoneNumber(props) {
  const { label, name, dolar = false, phoneWrap, ...rest } = props;
  const [field, meta] = useField(props);

  return (
    <div className={inputStyle.Wrap}>
      <label htmlFor={name} className={inputStyle.LabelStyle}>
        {label}
      </label>
      <div className={`${inputStyle.inputFieldWrap}  ${phoneWrap}`}>
        {dolar ? <i className={`bx bx-dollar ${inputStyle.dolar}`}></i> : null}

        <PhoneInput
          specialLabel={''}
          country={'us'}
          inputProps={{
            name: props.name,
            required: true,
          }}
          inputStyle={{
            borderColor: props.touched && props.error && 'red',
          }}
          {...props}
          placeholder={'Enter Phone Number'}
          value={field.value}
        />
        <ErrorMessage name={field.name} component={Texterror} />
      </div>
    </div>
  );
}

export default PhoneNumber;

// how to call

{
  /* <PhoneNumber
  name="phoneNumber"
  label="Phone Number"
  onChange={(e) => {
    console.log(e);

    formik.setFieldValue("phoneNumber", e);
  }}
 
/>; */
}
