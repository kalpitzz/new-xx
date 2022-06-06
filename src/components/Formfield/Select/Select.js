import React from 'react';
import { ErrorMessage, Field, useField } from 'formik';
import inputStyle from '../Input/Input.module.css';
import Texterror from '../TextError/Texterror';
import selectStyle from './select.module.css';

function Select(props) {
  const {
    label,
    name,
    options,
    fieldStyle,
    addNew = false,
    fieldWrap,
    clickHandler,
    customWrap,
    disabled,
    wrap = false,
    ...rest
  } = props;
  const [field, meta] = useField(props);

  return (
    <div className={`${inputStyle.Wrap} ${customWrap}`}>
      <label htmlFor={name} className={inputStyle.LabelStyle}>
        {label}
      </label>
      <div className={`${inputStyle.inputFieldWrap} ${fieldWrap}`}>
        <Field
          as="select"
          id={name.toString()}
          {...field}
          {...rest}
          autoComplete="off"
          disabled={disabled}
          /*Adding class for border red if feild is required & touched */

          className={`${inputStyle.inputFieldStyle} ${selectStyle.inputField} ${
            meta.touched && meta.error && inputStyle.errorStyle
          } ${fieldStyle}`}
        >
          {options.map((option) => {
            return (
              <option key={option.value} value={option.value}>
                {option.key}
              </option>
            );
          })}
        </Field>

        {wrap ? (
          <button
            id={selectStyle.addNewButtonWrap}
            type="button"
            onClick={() => clickHandler()}
          >
            <i className="bx bx-plus"></i>Add New
          </button>
        ) : null}
        <ErrorMessage name={field.name} component={Texterror} />
      </div>
      {addNew ? (
        <button
          id={inputStyle.addNewButton}
          type="button"
          onClick={() => clickHandler()}
        >
          <i className="bx bx-plus"></i>Add New
        </button>
      ) : null}
    </div>
  );
}

export default Select;
