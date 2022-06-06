import React, { useRef } from 'react';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import FormStyle from './allForm.module.css';
import FormikControl from '../../components/Formfield/formikControl';
import useAxios from '../../hooks/useAxios';
import AlertModel from '../../components/modals/AlertModel';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormAction from '../../redux/actions/FormAction';

const OwnerInvite = () => {
  let axiosApi = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: '',
      contact_phone: '',
      first_name: '',
      last_name: '',
      company_name: '',
    },

    // Yup Validations
    validationSchema: Yup.object({
      first_name: Yup.string().required('Required'),
      company_name: Yup.string().required('Required'),
      contact_phone: Yup.string().min(10, 'Must be 10 digits'),
      email: Yup.string().email('Invalid email address'),
    }),
    onSubmit: (values) => {
      let obj = {
        user: {
          email: values.email,
          phone: values.contact_phone,
          first_name: values.first_name,
          last_name: values.last_name,
        },
        company_name: values.company_name,
      };
      axiosApi.post('/company/invitation/', obj).then((res) => {
        console.log(res);
        dispatch(FormAction.addAction({ res: res, role: 'Invitation' }));
        alertRef.current.showModel();
      });
    },
  });

  const handleBack = () => {
    navigate('/AddressBook');
  };

  const alertRef = useRef();

  return (
    <FormikProvider value={formik}>
      <main id={FormStyle.PageWrap}>
        <div id={FormStyle.title}>
          <i className="bx bx-left-arrow-alt bx-sm" onClick={handleBack}></i>
          <h2>{`Invite Owner`}</h2>
        </div>
        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <div id={FormStyle.outerWrap}>
            <p>{`Owner Details`}</p>
            <div id={FormStyle.line}></div>
            <div id={FormStyle.formikWrap}>
              <FormikControl
                control="input"
                label={`Owner First Name*`}
                name={`first_name`}
                placeholder={`Type Owner First Name`}
              />
              <FormikControl
                control="input"
                label={`Owner Last Name`}
                name={`last_name`}
                placeholder={`Type Owner Last Name`}
              />
              <FormikControl
                control="input"
                label={`Company Name*`}
                name={`company_name`}
                placeholder={`Type Company Name`}
              />
              <FormikControl
                control="input"
                label="Email"
                name={`email`}
                placeholder="Enter email"
              />
              <FormikControl
                control="phone"
                label="Phone"
                name={`contact_phone`}
                placeholder="Enter Phone Number"
                onChange={(e) => formik.setFieldValue('contact_phone', `+${e}`)}
                phoneWrap={FormStyle.phoneWrap}
              />
            </div>
          </div>

          <div id={FormStyle.buttonWrap}>
            <div id={FormStyle.twoButtonWraps}>
              <button type="reset" onClick={handleBack}>
                Cancel
              </button>
              <AlertModel
                type="Send Invite"
                typeoff="submit"
                title={`Invitation Sent Successfully!!`}
                button1="Close"
                button2="Okay!"
                navigateTo={'/AddressBook'}
                ref={alertRef}
                handleOkay={() => console.log('Successfully added')}
              />
              {/* <button type="submit">{`Send Invite`}</button> */}
            </div>
          </div>
        </form>
      </main>
    </FormikProvider>
  );
};

export default OwnerInvite;
