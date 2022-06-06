import React from 'react';
import TextStyle from './textField.module.css';

const TextField = ({
  label,
  details,
  detailsStyle,
  textWrap,
  labelStyle,
  link = false,
}) => {
  return (
    <div className={`${TextStyle.Wrap} ${textWrap}`}>
      <p className={`${TextStyle.Label} ${labelStyle}`}>{label}</p>
      {link ? (
        <a
          className={`${TextStyle.Details} ${detailsStyle} `}
          href={details}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button
            className={TextStyle.viewButton}
            style={{
              cursor: details ? 'pointer' : 'not-allowed',
              backgroundColor: details ? '#dbf3ff' : '',
            }}
          >
            <i className="bx bx-link-external"></i> VIEW
          </button>
        </a>
      ) : (
        <p className={`${TextStyle.Details} ${detailsStyle} `}>{details}</p>
      )}
    </div>
  );
};

export default TextField;
