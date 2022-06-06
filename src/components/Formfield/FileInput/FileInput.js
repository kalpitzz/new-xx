import React from 'react';
import { ErrorMessage, useField } from 'formik';
import inputStyle from '../Input/Input.module.css';
import Texterror from '../TextError/Texterror';

function InputField(props) {
  const { label, name, ...rest } = props;
  const [field, meta] = useField(props);
  return (
    <div className={inputStyle.Wrap}>
      <label htmlFor={name} className={inputStyle.LabelStyle}>
        {label}
      </label>
      <input
        type="file"
        // {...field}
        {...rest}
        autoComplete="off"
        /*Adding class for border red if feild is required & touched */
        className={`${inputStyle.inputFieldStyle} ${
          meta.touched && meta.error && inputStyle.errorStyle
        }`}
      />

      <ErrorMessage name={field.name} component={Texterror} />
    </div>
  );
}

export default InputField;
