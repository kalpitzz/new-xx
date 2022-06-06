import React from 'react';
import { ErrorMessage, Field, useField } from 'formik';
import inputStyle from '../Input/Input.module.css';
import Texterror from '../TextError/Texterror';

function Textarea(props) {
  const { label, name, textAreaStyle, fieldStyle, customWrap, ...rest } = props;
  const [field, meta] = useField(props);
  return (
    <div className={`${inputStyle.Wrap} ${customWrap}`}>
      <label htmlFor={name} className={inputStyle.LabelStyle}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <textarea
          {...field}
          rows={4}
          cols={143}
          {...rest}
          autoComplete="off"
          className={`${inputStyle.textedArea} ${textAreaStyle} ${
            meta.touched && meta.error && inputStyle.errorStyle
          } ${fieldStyle}`}
        />
        <ErrorMessage name={field.name} component={Texterror} />
      </div>
    </div>
  );
}

export default Textarea;
