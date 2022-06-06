import React from 'react';
import Style from './textArea.module.css';
import { useField } from 'formik';

const TextArea = ({
  label,
  wrapStyle,
  labelStyle,
  textAreaStyle,
  ...props
}) => {
  const [field] = useField(props);
  return (
    <div className={`${Style.textAreaWrap} ${wrapStyle}`}>
      <label
        htmlFor={field.name}
        className={`${Style.labelStyle} ${labelStyle}`}
      >
        {label}
      </label>
      <div>
        <textarea
          {...field}
          rows={4}
          cols={143}
          {...props}
          autoComplete="off"
          className={`${Style.textedArea} ${textAreaStyle}`}
        />
      </div>
    </div>
  );
};

export default TextArea;
