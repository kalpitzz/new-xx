import React from 'react';
import { ErrorMessage, useField } from 'formik';
import textFieldStyle from './textField.module.css';

export const TextField = ({
  label,
  labelStyle,
  inputStyle,
  height,
  wrapStyle,
  ...props
}) => {
  const [field, meta] = useField(props);
  return (
    <div className={`${textFieldStyle.wrap} ${wrapStyle} `}>
      <label
        htmlFor={field.name}
        className={`${textFieldStyle.labelStyle} ${labelStyle}`}
      >
        {label}
      </label>
      <input
        {...field}
        {...props}
        autoComplete="off"
        /*Adding class for border red if feild is required & touched */
        className={`${textFieldStyle.inputStyle} ${inputStyle} ${height} ${
          meta.touched && meta.error && textFieldStyle.errorStyle
        }`}
      />
      {/* Errormessage div with inlineStyles */}
      <ErrorMessage name={field.name}>
        {(msg) => (
          <div
            style={{
              color: 'red',
              position: 'absolute',
              right: '2rem',
              top: '2rem',
              fontSize: '.7rem',
              backgroundColor: 'white',
            }}
          >
            {msg}
          </div>
        )}
      </ErrorMessage>
    </div>
  );
};
