import React from 'react';
import { ErrorMessage, Field, useField } from 'formik';
import inputStyle from '../Input/Input.module.css';
import Texterror from '../TextError/Texterror';
import style from './Radiobutton.module.css';

function Select(props) {
  const { label, name, options, ...rest } = props;
  const [field, meta] = useField(props);
  return (
    <div className={style.radioOuterWrap}>
      <label htmlFor={name} className={inputStyle.LabelStyle}>
        {label}
      </label>
      <div className={style.radioWrap}>
        <Field
          id={name.toString()}
          {...field}
          {...rest}
          autoComplete="off"
          /*Adding class for border red if feild is required & touched */

          className={`${inputStyle.inputFieldStyle} ${
            meta.touched && meta.error && inputStyle.errorStyle
          }`}
        >
          {({ field }) => {
            return options.map((option, i) => {
              return (
                <div key={i}>
                  <input
                    type="radio"
                    id={option.value.toString()}
                    {...field}
                    value={option.value}
                    checked={field.value === option.value}
                    className={style.radioField}
                  />
                  <label
                    htmlFor={option.value.toString()}
                    className={style.label}
                  >
                    {option.key}
                  </label>
                </div>
              );
            });
          }}
        </Field>
      </div>
      <ErrorMessage name={field.name} component={Texterror} />
    </div>
  );
}

export default Select;
