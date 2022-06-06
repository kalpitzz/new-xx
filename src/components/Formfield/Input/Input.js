//this is the universal input field component which is used everywhere
// this input field is control by the FormikControl component
import React from 'react';
import { ErrorMessage, Field, useField } from 'formik';
import inputStyle from './Input.module.css';
import Texterror from '../TextError/Texterror';

function InputField(props) {
  const {
    label,
    name,
    dolar = false,
    fieldStyle,
    fieldWrap,
    customWrap,
    disable = false,
    ...rest
  } = props;
  const [field, meta] = useField(props);
  return (
    <div className={`${inputStyle.Wrap} ${customWrap}`}>
      <label htmlFor={name} className={inputStyle.LabelStyle}>
        {label}
      </label>
      <div className={`${inputStyle.inputFieldWrap} ${fieldWrap}`}>
        {dolar ? <i className={`bx bx-dollar ${inputStyle.dolar}`}></i> : null}
        <Field
          {...field}
          {...rest}
          autoComplete="off"
          /*Adding class for border red if feild is required & touched */
          className={`${inputStyle.inputFieldStyle} ${
            meta.touched && meta.error && inputStyle.errorStyle
          } ${fieldStyle}`}
        />
        <ErrorMessage name={field.name} component={Texterror} />
      </div>
    </div>
  );
}

export default InputField;
