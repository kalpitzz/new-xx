import React from 'react';
import InputField from './Input/Input';
import Select from './Select/Select';
import Textarea from './Textarea/Textarea';
import Radiobutton from './RadioButton/Radiobutton';
import FileInput from './FileInput/FileInput';
import PhoneNumber from './PhoneNumber/PhoneNumber';
const FormikControl = (props) => {
  const { control, ...rest } = props;
  switch (control) {
    case 'input':
      return <InputField {...rest} />;
    case 'select':
      return <Select {...rest} />;
    case 'textarea':
      return <Textarea {...rest} />;
    case 'radio':
      return <Radiobutton {...rest} />;
    case 'file':
      return <FileInput {...rest} />;
    case 'phone':
      return <PhoneNumber {...rest} />;
    default:
      return null;
  }
};

export default FormikControl;
