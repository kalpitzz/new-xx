import React, { useEffect, useRef, useState } from 'react';
import { TextField } from '../../components/texfield/TextField';
import { useFormik, FormikProvider } from 'formik';
import * as Yup from 'yup';
import FormStyle from './allForm.module.css';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormAction from '../../redux/actions/FormAction';
import AlertModel from '../../components/modals/AlertModel';
import useAuth from '../../hooks/useAuth';
import usCities from '../../assets/JsonData/Usa-States-data.json';

import { useLocation } from 'react-router-dom';
import FormTextField from '../../components/Formfield/formikControl';
import { toast } from 'react-toastify';

const FormPage = ({ typeProp = false, formHandler, callApiParent }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alertRef = useRef();
  // Get preview Data and Type from Store..
  let previewData = useSelector((state) => state.FormReducer.previewData);
  const id = useSelector((state) => state.FormReducer.previewId);
  let role = useSelector((state) => state.FormReducer.formType);

  role = typeProp ? typeProp : role;

  // const LoginRole = useSelector((state) => state.FormReducer.role);
  const { auth } = useAuth();
  const loginRole = auth.role;
  const [carriers, setCarrier] = useState([{ key: 'Loading...', value: '' }]);

  const optionObj = [
    { key: 'Yes', value: true },
    { key: 'No', value: false },
  ];

  // Based on type Value Form is rendered...
  let axiosapi = useAxios();
  let initialValues;
  const { state } = useLocation();

  const resetData = () => {
    dispatch(FormAction.setPreview(''));
  };

  const handleback = () => {
    navigate('/AddressBook');
  };

  if (state === 'newForm' && previewData) {
    resetData();
    previewData = '';
  }

  function check(item) {
    return item === null || item === undefined ? '' : item;
  }

  if (previewData) {
    initialValues = {
      company_name:
        previewData.company_id ||
        (previewData.company_name === null ||
        previewData.company_name === undefined
          ? ''
          : previewData.company_name) ||
        previewData.user.name,
      first_name: previewData.first_name || previewData.user.first_name,
      last_name:
        role === 'Dispatcher' || role === 'Driver'
          ? previewData.user.last_name === null ||
            previewData.user.last_name === undefined
            ? ''
            : previewData.user.last_name
          : previewData.last_name === null ||
            previewData.last_name === undefined
          ? ''
          : previewData.last_name,
      email:
        role === 'Dispatcher' || role === 'Driver'
          ? previewData.user.email === null ||
            previewData.user.email === undefined
            ? ''
            : previewData.user.email
          : previewData.contact_email === null ||
            previewData.contact_email === undefined
          ? ''
          : previewData.contact_email,
      phoneNumber:
        role === 'Dispatcher' || role === 'Driver'
          ? previewData.user.phone !== 'None' &&
            previewData.user.phone !== null &&
            previewData.user.phone !== undefined
            ? previewData.user.phone
            : ''
          : previewData.contact_phone !== null &&
            previewData.contact_phone !== undefined
          ? previewData.contact_phone
          : '',
      comment:
        previewData.comment === null || previewData.comment === undefined
          ? ''
          : previewData.comment,
      addressLine1: previewData.address.line_1,
      addressLine2:
        previewData.address.line_2 === null ||
        previewData.address.line_2 === undefined
          ? ''
          : previewData.address.line_2,
      city: previewData.address.city,
      zipCode: previewData.address.zipcode,
      state: previewData.address.state,
      additionalNotes:
        previewData.address.additional_notes !== null &&
        previewData.address.additional_notes !== undefined
          ? previewData.address.additional_notes
          : '',
      additional_details: {
        max_haul_weight: check(previewData.max_haul_weight),
        rate_confirmation: check(previewData.ate_confirmation),
        ok_with_driver_assist: check(previewData.ok_with_driver_assist),
        regions_of_operation: check(previewData.regions_of_operation),
        equipments_list: check(previewData.equipments_list),
        book_load_yourself: check(previewData.book_load_yourself),
        driver_pay_type: check(previewData.driver_pay_type),
        driver_pay: check(previewData.driver_pay),
        actively_running_with_someone: check(
          previewData.actively_running_with_someone
        ),
        driver_ready_to_start: check(previewData.driver_ready_to_start),
        comfortable_driving_at_night: check(
          previewData.comfortable_driving_at_night
        ),
        permission_to_accept_reject: check(
          previewData.permission_to_accept_reject
        ),
        how_often_driver_go_home: check(previewData.how_often_driver_go_home),
        average_miles_drive_per_day: check(
          previewData.average_miles_drive_per_day
        ),
      },
    };
  } else {
    initialValues = {
      company_name: '',
      first_name: '',
      last_name: '',
      email: '',
      phoneNumber: '',
      comment: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      zipCode: '',
      state: '',
      additionalNotes: '',
      additional_details: {
        max_haul_weight: '',
        rate_confirmation: '',
        ok_with_driver_assist: '',
        regions_of_operation: '',
        equipments_list: '',
        book_load_yourself: '',
        driver_pay_type: '',
        driver_pay: '',
        actively_running_with_someone: '',
        driver_ready_to_start: '',
        comfortable_driving_at_night: '',
        permission_to_accept_reject: '',
        how_often_driver_go_home: '',
        average_miles_drive_per_day: '',
      },
    };
  }

  // const phone =
  //   /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
  const formik = useFormik({
    initialValues: initialValues,

    // Yup Validations
    validationSchema:
      role === 'Driver'
        ? Yup.object({
            company_name: Yup.string().required('Required'),
            first_name: Yup.string().required('Required'),
            phoneNumber: Yup.string().min(10, 'Must be 10 digits'),
            email: Yup.string()
              .required('Required')
              .email('Invalid email address'),
            addressLine1: Yup.string().required('Required'),
            zipCode: Yup.string()
              .required('Required')
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(5, 'Must be 5 digits')
              .max(5, 'Must be 5 digits'),
            state: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
          })
        : Yup.object({
            first_name: Yup.string().required('Required'),
            phoneNumber: Yup.string().min(10, 'Must be 10 digits'),
            email: Yup.string()
              .required('Required')
              .email('Invalid email address'),
            addressLine1: Yup.string().required('Required'),
            zipCode: Yup.string()
              .required('Required')
              .matches(/^[0-9]+$/, 'Must be only digits')
              .min(5, 'Must be 5 digits')
              .max(5, 'Must be 5 digits'),
            state: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
          }),
    onSubmit: (values) => {
      let driver_object = {
        company_id: values.company_name,
        rate_confirmation_permission: values.rate_confirmation_permission,
        user: {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phoneNumber ? `${values.phoneNumber}` : null,
        },
        address: {
          line_1: values.addressLine1,
          line_2: values.addressLine2,
          state: values.state,
          city: values.city,
          zipcode: values.zipCode,
          additional_notes: values.additionalNotes,
        },
        comment: values.comment,
        additional_details: {
          max_haul_weight: values.max_haul_weight,
          rate_confirmation: values.rate_confirmation,
          ok_with_driver_assist: values.ok_with_driver_assist,
          regions_of_operation: values.regions_of_operation,
          equipments_list: values.equipments_list,
          book_load_yourself: values.book_load_yourself,
          driver_pay_type: values.driver_pay_type,
          driver_pay: values.driver_pay,
          actively_running_with_someone: values.actively_running_with_someone,
          driver_ready_to_start: values.driver_ready_to_start,
          comfortable_driving_at_night: values.comfortable_driving_at_night,
          permission_to_accept_reject: values.permission_to_accept_reject,
          how_often_driver_go_home: values.how_often_driver_go_home,
          average_miles_drive_per_day: values.average_miles_drive_per_day,
        },
      };
      let driver_patch_object = {
        company_id: values.company_name,
        user: {
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phoneNumber ? `${values.phoneNumber}` : null,
        },
        address: {
          line_1: values.addressLine1,
          line_2: values.addressLine2,
          state: values.state,
          city: values.city,
          zipcode: values.zipCode,
          additional_notes: values.additionalNotes,
        },
        comment: values.comment,
        additional_details: {
          max_haul_weight: values.max_haul_weight,
          rate_confirmation: values.ate_confirmation,
          ok_with_driver_assist: values.ok_with_driver_assist,
          regions_of_operation: values.regions_of_operation,
          equipments_list: values.equipments_list,
          book_load_yourself: values.book_load_yourself,
          driver_pay_type: values.driver_pay_type,
          driver_pay: values.driver_pay,
          actively_running_with_someone: values.actively_running_with_someone,
          driver_ready_to_start: values.driver_ready_to_start,
          comfortable_driving_at_night: values.comfortable_driving_at_night,
          permission_to_accept_reject: values.permission_to_accept_reject,
          how_often_driver_go_home: values.how_often_driver_go_home,
          average_miles_drive_per_day: values.average_miles_drive_per_day,
        },
      };

      let customer_broker_object = {
        company_name: values.company_name,
        comment: values.comment,
        first_name: values.first_name,
        last_name: values.last_name,
        contact_email: values.email,
        contact_phone: values.phoneNumber ? `${values.phoneNumber}` : null,
        address: {
          line_1: values.addressLine1,
          line_2: values.addressLine2,
          state: values.state,
          city: values.city,
          zipcode: values.zipCode,
          additional_notes: values.additionalNotes,
        },
      };

      let dispatcherPatch = {
        user: {
          first_name: values.first_name,
          last_name: values.last_name,
          phone: values.phoneNumber ? `${values.phoneNumber}` : null,
        },
        comment: values.comment,
        address: {
          line_1: values.addressLine1,
          line_2: values.addressLine2,
          state: values.state,
          city: values.city,
          zipcode: values.zipCode,
          additional_notes: values.additionalNotes,
        },
      };

      let dispatcherPost = {
        user: {
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          phone: values.phoneNumber ? `${values.phoneNumber}` : null,
        },
        comment: values.comment,
        address: {
          line_1: values.addressLine1,
          line_2: values.addressLine2,
          state: values.state,
          city: values.city,
          zipcode: values.zipCode,
          additional_notes: values.additionalNotes,
        },
      };

      if (previewData) {
        switch (role) {
          case 'Others':
            axiosapi
              .patch(`/company/others/${id}/`, customer_broker_object)
              .then((res) =>
                dispatch(FormAction.editAction({ res: res, role: role }))
              )
              .then(() => alertRef.current.showModel());
            break;
          case 'Broker':
            axiosapi
              .patch(`/company/broker/${id}/`, customer_broker_object)
              .then((res) =>
                dispatch(FormAction.editAction({ res: res, role: role }))
              )
              .then(() => alertRef.current.showModel());

            break;
          case 'Driver':
            axiosapi
              .patch(`/drivers/${id}/`, driver_patch_object)
              .then((res) =>
                dispatch(FormAction.editAction({ res: res, role: role }))
              )
              .then(() => alertRef.current.showModel());

            break;
          case 'Dispatcher':
            axiosapi
              .patch(`/company/dispatcher/${id}/`, dispatcherPatch)
              .then((res) =>
                dispatch(FormAction.editAction({ res: res, role: role }))
              )
              .then(() => alertRef.current.showModel());
            break;

          default:
            break;
        }
      } else {
        switch (role) {
          case 'Others':
            axiosapi
              .post('/company/others/', customer_broker_object)
              .then((res) => {
                if (!typeProp) {
                  dispatch(FormAction.addAction({ res: res, role: role }));
                  dispatch(FormAction.setPreviewId(res.id));
                }
                if (typeProp === 'Others') {
                  callApiParent();
                }
              })
              .then(() => alertRef.current.showModel());
            break;
          case 'Broker':
            axiosapi
              .post('/company/broker/', customer_broker_object)
              .then((res) => {
                if (!typeProp) {
                  dispatch(FormAction.addAction({ res: res, role: role }));
                  dispatch(FormAction.setPreviewId(res.id));
                }
                if (typeProp === 'Broker') {
                  callApiParent();
                }
              })
              .then(() => alertRef.current.showModel());
            break;
          case 'Driver':
            axiosapi
              .post('/drivers/', driver_object)
              .then((res) => {
                if (typeProp !== 'Driver') {
                  dispatch(FormAction.addAction({ res: res, role: role }));
                  dispatch(FormAction.setPreviewId(res.id));
                }

                if (typeProp === 'Driver') {
                  callApiParent();
                }
              })
              .then(() => alertRef.current.showModel());
            break;
          case 'Dispatcher':
            axiosapi
              .post('/company/dispatcher/', dispatcherPost)
              .then((res) => {
                dispatch(FormAction.addAction({ res: res, role: role }));
                dispatch(FormAction.setPreviewId(res.id));
              })
              .then(() => alertRef.current.showModel());
            break;

          default:
            break;
        }
      }
    },
  });
  let carrierName = [{ key: 'Select Carrier name', value: '' }];

  const fetchCarrier = async () => {
    await axiosapi
      .get('/company/carrier/')
      .then((res) => {
        res.map((data) => carrierName.push({ key: data.name, value: data.id }));
      })
      .catch(() => {
        toast.error('Reconnecting...');
        fetchCarrier();
      });
  };

  useEffect(() => {
    if (
      (loginRole === 'DM' || loginRole === 'DISP' || loginRole === 'TL') &&
      role === 'Driver'
    ) {
      fetchCarrier().then(() => {
        setCarrier(carrierName);
      });
    }
  }, []);

  useEffect(() => {
    if (typeProp === 'Driver') {
      window.scrollTo(0, 0);
    }
  }, []);
  useEffect(() => {
    return () => {
      dispatch(FormAction.setPreview(''));
    };
  }, [dispatch]);

  useEffect(() => {
    return () => {
      if (typeProp === 'Driver') {
        window.scrollTo(0, document.body.scrollHeight);
      }
    };
  }, []);

  return (
    <FormikProvider value={formik}>
      <main id={FormStyle.outerWrap}>
        <div id={FormStyle.title}>
          <i
            className="bx bx-left-arrow-alt bx-sm"
            onClick={typeProp ? formHandler : handleback}
          ></i>

          <h2>{`${previewData ? 'Edit' : 'Add'} ${role}`}</h2>
        </div>

        <form autoComplete="off" onSubmit={formik.handleSubmit}>
          <div>
            <div id={FormStyle.Wrap}>
              <p id={FormStyle.header}>{`${role} Profile`}</p>
              <div id={FormStyle.line}></div>
              <div id={FormStyle.profileWrap}>
                <FormTextField
                  control="input"
                  label="First Name*"
                  type="text"
                  name="first_name"
                  placeholder="Type First Name"
                  fieldStyle={FormStyle.fieldStyle}
                />
                <FormTextField
                  label={`Last Name`}
                  name={`last_name`}
                  control="input"
                  type="text"
                  placeholder={`Type Last Name`}
                  fieldStyle={FormStyle.fieldStyle}
                />
                {role !== 'Dispatcher' && role !== 'Driver' ? (
                  <FormTextField
                    label={`Company Name`}
                    name={`company_name`}
                    control="input"
                    type="text"
                    placeholder={`Type Company Name`}
                    fieldStyle={FormStyle.fieldStyle}
                  />
                ) : loginRole === 'DO' && role === 'Driver' ? (
                  <FormTextField
                    label={`Company Name*`}
                    name={`company_name`}
                    control="input"
                    type="text"
                    placeholder={`Type Company Name`}
                    fieldStyle={FormStyle.fieldStyle}
                  />
                ) : (loginRole === 'DM' ||
                    loginRole === 'DISP' ||
                    loginRole === 'TL') &&
                  role === 'Driver' ? (
                  <FormTextField
                    label={`Company Name*`}
                    name={`company_name`}
                    control="select"
                    options={carriers}
                    fieldStyle={FormStyle.fieldStyle}
                  />
                ) : null}
                {!previewData ? (
                  <FormTextField
                    label="Email*"
                    name={`email`}
                    control="input"
                    placeholder="Enter email"
                    fieldStyle={FormStyle.fieldStyle}
                  />
                ) : null}
                <FormTextField
                  label="Phone"
                  name={`phoneNumber`}
                  control="phone"
                  placeholder="Enter Phone Number"
                  phoneWrap={FormStyle.fieldStyle}
                  onChange={(e) => formik.setFieldValue('phoneNumber', `+${e}`)}
                />
                <FormTextField
                  label="Comment"
                  name="comment"
                  placeholder="Enter Comment"
                  control="textarea"
                  fieldStyle={FormStyle.fieldStyle}
                />
              </div>
            </div>
            <div id={FormStyle.Wrap}>
              <p id={FormStyle.header}>{`${role} Address`}</p>
              <div id={FormStyle.line}></div>
              <div id={FormStyle.addressOuterWrap}>
                <div id={FormStyle.addressLineWrap}>
                  <FormTextField
                    label={`Address Line1*`}
                    name={`addressLine1`}
                    control="input"
                    placeholder={`Enter Address`}
                    fieldWrap={FormStyle.addressFieldWrap}
                    fieldStyle={FormStyle.addressField}
                  />
                  <FormTextField
                    label={`Address Line2`}
                    name={`addressLine2`}
                    control="input"
                    placeholder={`Enter Address`}
                    fieldWrap={FormStyle.addressFieldWrap}
                    fieldStyle={FormStyle.addressField}
                  />
                </div>
                <div id={FormStyle.addressWrap}>
                  <FormTextField
                    label="City*"
                    fieldStyle={FormStyle.fieldStyle}
                    name="city"
                    control="input"
                    placeholder="Enter City Name"
                  />
                  <FormTextField
                    label="Zip Code*"
                    name="zipCode"
                    fieldStyle={FormStyle.fieldStyle}
                    control="input"
                    placeholder="Enter Zip Code"
                  />
                  <FormTextField
                    label="State*"
                    name="state"
                    fieldStyle={FormStyle.fieldStyle}
                    control="select"
                    options={usCities}
                  />

                  <FormTextField
                    label="Notes"
                    fieldStyle={FormStyle.fieldStyle}
                    name="additionalNotes"
                    placeholder="Additional Notes"
                    control="textarea"
                  />
                </div>
              </div>
            </div>
            {/* rendered only for add driver */}
            {role === 'Driver' ? (
              <section id={`${FormStyle.Wrap}`}>
                <p id={FormStyle.header}>{`Additional Details`}</p>
                <div id={FormStyle.line}></div>
                <div className={FormStyle.wrapDetailsFields}>
                  <FormTextField
                    control="input"
                    name="max_haul_weight"
                    label="What is the Max weight the Driver can Haul?(lbs)"
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                    placeholder="Enter Here"
                  />
                  <FormTextField
                    control="radio"
                    name="rate_confirmation"
                    label="Is the Driver allowed to view the rate confirmation?"
                    options={optionObj}
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                  <FormTextField
                    control="radio"
                    name="ok_with_driver_assist"
                    label="Is the driver okay with Driver Assist?"
                    options={optionObj}
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                  <FormTextField
                    label="Regions of Operation"
                    name="regions_of_operation"
                    fieldStyle={FormStyle.fieldStyle}
                    control="select"
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                    options={usCities}
                  />
                  <FormTextField
                    label="Please mention all the equipments that you have inside the trailer to hold the load."
                    fieldStyle={FormStyle.fieldStyle}
                    name="equipments_list"
                    placeholder="Type here"
                    control="textarea"
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                  <FormTextField
                    control="radio"
                    name="book_load_yourself"
                    label="Are you going to book loads yourself as well?"
                    options={optionObj}
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                  <FormTextField
                    label="Driver pay type"
                    name="driver_pay_type"
                    fieldStyle={FormStyle.fieldStyle}
                    control="select"
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                    options={usCities}
                  />
                  <FormTextField
                    control="input"
                    name="driver_pay"
                    label="Driver Pay"
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                    placeholder="Enter Here"
                  />
                  <FormTextField
                    control="radio"
                    name="actively_running_with_someone"
                    label="Are you actively running with someone else?"
                    options={optionObj}
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />

                  <FormTextField
                    control="input"
                    name="average_miles_drive_per_day"
                    label="Average number of Miles the Driver can drive per day"
                    placeholder="Enter Here"
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                  <FormTextField
                    control="radio"
                    name="driver_ready_to_start"
                    label="Is the Driver Ready to Start?"
                    options={optionObj}
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                  <FormTextField
                    control="radio"
                    name="comfortable_driving_at_night"
                    label="Is the Driver Comfortable Driving at Night?"
                    options={optionObj}
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                  <FormTextField
                    control="radio"
                    name="permission_to_accept_reject"
                    label="Does the Driver have permission to Accept/Reject the loads?"
                    options={optionObj}
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />

                  <FormTextField
                    control="input"
                    name="how_often_driver_go_home"
                    label="How often does your driver go home?"
                    placeholder="Enter Here"
                    customWrap={FormStyle.additionalDetailsFieldWrap}
                  />
                </div>
              </section>
            ) : null}
            {/* {role === 'Driver' ? (
              <div id={FormStyle.Wrap}>
                <p id={FormStyle.header}>{`Rate confirmation`}</p>

                <div id={FormStyle.line}></div>

                <div className={FormStyle.checkbox}>
                  <TextField
                    label="Rate Confirmation Permission"
                    name="rate_confirmation_permission"
                    type="checkbox"
                    labelStyle={FormStyle.label}
                  />
                </div>
              </div>
            ) : null} */}
            <div id={FormStyle.buttonWrap}>
              <div id={FormStyle.twoButtonWraps}>
                <button
                  type="reset"
                  onClick={typeProp ? formHandler : handleback}
                >
                  Cancel
                </button>

                <AlertModel
                  type={`${!previewData ? `Add ${role}` : `Save ${role}`}`}
                  role={role}
                  title={`Successfully added.`}
                  button1="Close"
                  button2="Okay!"
                  typeoff="submit"
                  ref={alertRef}
                  navigateTo={typeProp ? '#' : '/dynamicFormPreview'}
                  handleOkay={
                    typeProp
                      ? formHandler
                      : () => console.log('Successfully added')
                  }
                />
              </div>
            </div>
          </div>
        </form>
      </main>
    </FormikProvider>
  );
};

export default FormPage;
