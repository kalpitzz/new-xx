import React, { useRef, useEffect } from 'react';
import useAxios from '../../hooks/useAxios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import AlertModel from '../../components/modals/AlertModel';
import FormikControl from '../../components/Formfield/formikControl';
import usCities from '../../assets/JsonData/Usa-States-data.json';
import FormAction from '../../redux/actions/FormAction';
import { Formik, Form } from 'formik';
import useAuth from '../../hooks/useAuth';
import Style from './ownerForm.module.css';
import * as Yup from 'yup';

const OwnerForm = () => {
  let axiosapi = useAxios();
  const id = useSelector((state) => state.FormReducer.previewId);
  const type = useSelector((state) => state.FormReducer.formType);
  let previewData = useSelector((state) => state.FormReducer.previewData);
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const { auth } = useAuth();
  const loginRole = auth.role;

  useEffect(() => {
    return () => {
      dispatch(FormAction.setPreview(''));
      dispatch(FormAction.setPreviewId(''));
    };
  }, [dispatch]);
  console.log(previewData);
  const re =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
  let initialValue;

  function check(item) {
    return item === null || item === undefined ? '' : item;
  }

  const handleback = () => {
    navigate('/login');
  };

  console.log(type);

  console.log(loginRole);
  if (previewData) {
    initialValue = {
      id: previewData.id,
      name: check(previewData.name),
      contact_name: check(previewData.contact_name),
      dot_number: check(previewData.dot_number),
      mc_number: check(previewData.mc_number),
      phone: check(previewData.phone),
      fax: check(previewData.fax),
      email: check(previewData.email),
      address: {
        line_1: check(previewData.address.line_1),
        line_2: check(previewData.address.line_2),
        city: check(previewData.address.city),
        state: check(previewData.address.state),
        zipcode: check(previewData.address.zipcode),
        additional_notes: check(previewData.address.additional_notes),
      },
      additional_contact: {
        first_name: check(previewData.additional_contact.first_name),
        last_name: check(previewData.additional_contact.last_name),
        designation: check(previewData.additional_contact.designation),
        contact_phone: check(previewData.additional_contact.contact_phone),
        contact_email: check(previewData.additional_contact.contact_email),
      },
      customer: {
        email: auth.user_carrier_email,
        social: {
          website: check(previewData.customer.social.website),
          instagram: check(previewData.customer.social.instagram),
          facebook: check(previewData.customer.social.facebook),
          twitter: check(previewData.customer.social.twitter),
          linkedin: check(previewData.customer.social.linkedin),
        },
      },

      factoring_company: {
        carrier_company: previewData.factoring_company.id,
        factory_name: check(previewData.factoring_company.factory_name),
        login_id: check(previewData.factoring_company.login_id),
        password: check(previewData.factoring_company.password),
        login_url: check(previewData.factoring_company.login_url),
      },
      insurance: {
        insurance_company_name: check(
          previewData.insurance.insurance_company_name
        ),
        insurance_file: check(previewData.insurance.insurance_file),
        insurance_expiration_date: check(
          previewData.insurance.insurance_expiration_date
        ),
      },
      additional_details: {
        po_interchange_agreement: check(
          previewData.additional_details.po_interchange_agreement
        ),
        reefer_bd_coverage: check(
          previewData.additional_details.reefer_bd_coverage
        ),
        load_cancellation_fees: check(
          previewData.additional_details.load_cancellation_fees
        ),
        avg_gross_revenue_per_week: check(
          previewData.additional_details.avg_gross_revenue_per_week
        ),
        driver_go_home: check(previewData.additional_details.driver_go_home),
        expected_revenue: check(
          previewData.additional_details.expected_revenue
        ),
      },
      equipments_detail: {
        equipments_start_date: check(
          previewData.equipments_detail.equipments_start_date
        ),
        total_truck_own: check(previewData.equipments_detail.total_truck_own),
        total_truck_start: check(
          previewData.equipments_detail.total_truck_start
        ),
        equipments_description: check(
          previewData.equipments_detail.equipments_description
        ),
      },
    };
  } else {
    initialValue = {
      name: '',
      contact_name: '',
      dot_number: '',
      mc_number: '',
      phone: '',
      fax: '',
      email: '',
      address: {
        line_1: '',
        line_2: '',
        city: '',
        state: '',
        zipcode: '',
        additional_notes: '',
      },
      additional_contact: {
        first_name: '',
        last_name: '',
        designation: '',
        contact_phone: '',
        contact_email: '',
      },
      customer: {
        email: auth.user_carrier_email,
        social: {
          website: '',
          instagram: '',
          facebook: '',
          twitter: '',
          linkedin: '',
        },
      },

      factoring_company: {
        factory_name: '',
        login_id: '',
        password: '',
        login_url: '',
      },
      insurance: {
        insurance_company_name: '',
        insurance_file: '',
        insurance_expiration_date: '',
      },
      additional_details: {
        po_interchange_agreement: '',
        reefer_bd_coverage: '',
        load_cancellation_fees: '',
        avg_gross_revenue_per_week: '',
        driver_go_home: '',
        expected_revenue: '',
      },
      equipments_detail: {
        equipments_start_date: '',
        total_truck_own: '',
        total_truck_start: '',
        equipments_description: '',
      },
    };
  }

  const validation = Yup.object({
    name: Yup.string().required('Required'),
    contact_name: Yup.string().required('Required'),
    email: Yup.string().required('Required').email('Invalid email address'),
    dot_number: Yup.string()
      .required('Required')
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(6, 'Must be between 6 to 8 digits')
      .max(8, 'Must be between 6 to 8 digits'),
    mc_number: Yup.string()
      .matches(/^[0-9]+$/, 'Must be only digits')
      .min(6, 'Must be between 6 to 8 digits')
      .max(8, 'Must be between 6 to 8 digits'),
    phone: Yup.string()
      // .matches(/^[0-9]+$/, 'Must be only digits')
      .min(12, 'Must be 10 digits'),
    customer: Yup.object().shape({
      email: Yup.string().required('Required').email('Invalid email address'),
      social: Yup.object().shape({
        website: Yup.string().matches(re, 'URL is not valid'),
        instagram: Yup.string().matches(re, 'URL is not valid'),
        facebook: Yup.string().matches(re, 'URL is not valid'),
        twitter: Yup.string().matches(re, 'URL is not valid'),
        linkedin: Yup.string().matches(re, 'URL is not valid'),
      }),
    }),
    address: Yup.object().shape({
      line_1: Yup.string().required('Required'),
      city: Yup.string().required('Required'),
      state: Yup.string().required('Required'),
      zipcode: Yup.string()
        .required('Required')
        .matches(/^[0-9]+$/, 'Must be only digits')
        .min(5, 'Must be 5 digits')
        .max(5, 'Must be 5 digits'),
    }),
    additional_contact: Yup.object().shape({
      first_name: Yup.string().required('Required'),
      contact_email: Yup.string().email('Invalid email address'),
    }),
  });

  function formatDate() {
    var d = new Date(),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;

    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  const optionObj = [
    { key: 'Yes', value: true },
    { key: 'No', value: false },
  ];
  const alertRef = useRef();

  const keyify = (obj, prefix = '') =>
    Object.keys(obj).reduce((res, el) => {
      if (Array.isArray(obj[el])) {
        return res;
      } else if (typeof obj[el] === 'object' && obj[el] !== null) {
        return [...res, ...keyify(obj[el], prefix + el + '.')];
      }
      return [...res, prefix + el];
    }, []);

  return (
    <>
      <div id={Style.title}>
        {/* <Link to="/login">
          <i className="bx bx-left-arrow-alt bx-sm"></i>
        </Link> */}
        <h2>Carrier Profile</h2>
      </div>

      <section className={`${Style.card} ${Style.cName}`}>
        <h3>Neon Trucking LLC</h3>
      </section>

      <Formik
        initialValues={initialValue}
        onSubmit={(values) => {
          let tempKey = [...keyify(values), 'insurance.insurance_file'];
          console.log(values);
          console.log(tempKey);
          var formData = new FormData();
          tempKey.map((item, i) =>
            formData.append(
              tempKey[i],
              item.split('.').length > 1 //checks for keys with step//
                ? item.split('.')[0] === 'insurance'
                  ? values.insurance[item.split('.')[1]]
                  : item.split('.')[0] === 'address'
                  ? values.address[item.split('.')[1]]
                  : item.split('.')[0] === 'additional_contact'
                  ? values.additional_contact[item.split('.')[1]]
                  : item.split('.')[0] === 'factoring'
                  ? values.factoring[item.split('.')[1]]
                  : item.split('.')[0] === 'additional_details'
                  ? values.additional_details[item.split('.')[1]]
                  : item.split('.')[0] === 'equipments_detail'
                  ? values.equipments_detail[item.split('.')[1]]
                  : item.split('.')[0] === 'customer'
                  ? item.split('.').length === 2
                    ? values.customer[item.split('.')[1]]
                    : values.customer.social[item.split('.')[2]]
                  : ''
                : values[item]
            )
          );

          switch (type) {
            case 'Invitation':
              axiosapi.patch(`/company/invitation/${id}/`, values).then(() => {
                alertRef.current.showModel();
              });
              break;
            case 'Owner':
              previewData
                ? axiosapi.patch(`/company/carrier/${id}/`, values).then(() => {
                    alertRef.current.showModel();
                  })
                : axiosapi
                    .post(`/company/carrier-onboarding/`, values)
                    .then((res) => {
                      dispatch(FormAction.setPreview(res));
                    })
                    .then(() => alertRef.current.showModel());
              break;
            default:
              axiosapi
                .post(`/company/carrier-onboarding/`, values)
                .then((res) => {
                  dispatch(FormAction.setPreview(res));
                })
                .then(() => alertRef.current.showModel());
          }

          // previewData & (type === 'Invitation')
          //   ? axiosapi.patch(`/company/invitation/${id}/`, values).then(() => {
          //       alertRef.current.showModel();
          //     })
          //   : previewData & (type === 'Owner')
          //   ? axiosapi.patch(`/company/carrier/${id}/`, values).then(() => {
          //       alertRef.current.showModel();
          //     })
          //   : axiosapi
          //       .post(`/company/carrier-onboarding/`, values)
          //       .then((res) => {
          //         dispatch(FormAction.setPreview(res));
          //       })
          //       .then(() => alertRef.current.showModel());
        }}
        validationSchema={validation}
      >
        {({ setFieldValue }) => (
          <Form>
            <main id={Style.outerWrap}>
              <section className={`${Style.card} ${Style.cDetails}`}>
                <h4>Carrier Details</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapDetailsFields}>
                  <FormikControl
                    control="input"
                    name="name"
                    label="Carrier Name*"
                    placeholder="Type Carrier Name"
                  />
                  <FormikControl
                    control="input"
                    type="number"
                    name="mc_number"
                    label="MC Number"
                    placeholder="Enter the MC Number"
                  />
                  <FormikControl
                    control="input"
                    name="contact_name"
                    label="Contact Name*"
                    placeholder="Type Contact Name"
                  />
                  <FormikControl
                    control="phone"
                    name="phone"
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    onChange={(e) => setFieldValue('phone', `+${e}`)}
                    phoneWrap={Style.phoneWrap}
                  />
                  <FormikControl
                    control="input"
                    name="dot_number"
                    type="number"
                    label="DOT Number*"
                    placeholder="Type DOT Number"
                  />
                  <FormikControl
                    control="input"
                    name="fax"
                    label="Fax"
                    placeholder="Enter Fax"
                  />
                  <FormikControl
                    control="input"
                    name="email"
                    label="Email Address*"
                    placeholder="Type Email Address"
                  />
                </div>
              </section>
              <section className={`${Style.card} ${Style.cAddress}`}>
                <h4>Carrier Address</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapAddressFields}>
                  <div id={Style.addressLineWrap}>
                    <FormikControl
                      control="input"
                      name="address.line_1"
                      label="Address Line 1*"
                      placeholder="Enter Address 1"
                      fieldWrap={Style.addressFieldWrap}
                      fieldStyle={Style.addressField}
                    />
                    <FormikControl
                      control="input"
                      name="address.line_2"
                      label="Address Line 2"
                      placeholder="Enter Address 2"
                      fieldWrap={Style.addressFieldWrap}
                      fieldStyle={Style.addressField}
                    />
                  </div>
                  <div id={Style.addressWrap}>
                    <FormikControl
                      control="input"
                      name="address.city"
                      label="City*"
                      placeholder="Enter City Name"
                    />
                    <FormikControl
                      control="input"
                      name="address.zipcode"
                      type="number"
                      label="Zip Code*"
                      placeholder="Enter Zip Codes"
                    />
                    <FormikControl
                      control="select"
                      name="address.state"
                      label="State*"
                      options={usCities}
                    />
                  </div>
                </div>
              </section>
              <section className={`${Style.card} ${Style.cAddContact}`}>
                <h4>Additional Contact</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapHalf}>
                  <FormikControl
                    control="input"
                    name="additional_contact.first_name"
                    label="First Name*"
                    placeholder="Type First Name"
                  />
                  <FormikControl
                    control="input"
                    name="additional_contact.last_name"
                    label="Last Name"
                    placeholder="Type Last Name"
                  />
                  <FormikControl
                    control="input"
                    name="additional_contact.designation"
                    label="Contact Designations"
                    placeholder="Type Designation"
                  />
                  <FormikControl
                    control="phone"
                    name="additional_contact.contact_phone"
                    label="Phone Number"
                    placeholder="Enter Phone Number"
                    onChange={(e) =>
                      setFieldValue('additional_contact.contact_phone', `+${e}`)
                    }
                    phoneWrap={Style.phoneWrap}
                  />
                  <FormikControl
                    control="input"
                    name="additional_contact.contact_email"
                    label="Email Address"
                    placeholder="Type Email Address"
                  />
                </div>
              </section>
              <section className={`${Style.card} ${Style.cWebSocial}`}>
                <h4>Website/Social</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapHalf}>
                  <FormikControl
                    control="input"
                    name="customer.social.website"
                    label="Website"
                    placeholder="Enter Website URL"
                  />
                  <FormikControl
                    control="input"
                    name="customer.social.instagram"
                    label="Instagram"
                    placeholder="Add Instagram ID"
                  />
                  <FormikControl
                    control="input"
                    name="customer.social.facebook"
                    label="Facebook"
                    placeholder="Add Facebook ID"
                  />
                  <FormikControl
                    control="input"
                    name="customer.social.twitter"
                    label="twitter"
                    placeholder="Add twitter ID"
                  />
                  <FormikControl
                    control="input"
                    name="customer.social.linkedin"
                    label="LinkedIn"
                    placeholder="Add LinkedIn ID"
                  />
                </div>
              </section>
              <section className={`${Style.card} ${Style.cFactoring}`}>
                <h4>Factoring Company Details</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapDetailsFields}>
                  <FormikControl
                    control="input"
                    name="factoring_company.factory_name"
                    label="Company Name"
                    placeholder="Type Company Name"
                  />
                  <FormikControl
                    control="input"
                    name="factoring_company.login_id"
                    label="Login ID"
                    placeholder="Enter Login ID"
                  />
                  <FormikControl
                    control="input"
                    name="factoring_company.password"
                    label="Password"
                    placeholder="Enter Password"
                  />
                  <FormikControl
                    control="input"
                    name="factoring_company.login_url"
                    label="URL"
                    placeholder="Enter URL"
                  />
                </div>
              </section>
              <section className={`${Style.card} ${Style.cInsurance}`}>
                <h4>Insurance Details</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapDetailsFields}>
                  <FormikControl
                    control="input"
                    name="insurance.insurance_company_name"
                    label="Insurance Company Name"
                    placeholder="Enter here"
                  />
                  <FormikControl
                    control="file"
                    name="insurance.insurance_file"
                    label="Upload Copy of Insurance"
                    placeholder="Upload"
                    onChange={(event) => {
                      setFieldValue(
                        'insurance.insurance_file',
                        event.currentTarget.files[0]
                      );
                    }}
                  />
                  <FormikControl
                    control="input"
                    type="date"
                    min={formatDate()}
                    name="insurance.insurance_expiration_date"
                    label="Insurance Expiration Date"
                    placeholder="Select Date"
                  />
                </div>
              </section>
              <section className={`${Style.card} ${Style.cAddDetails}`}>
                <h4>Additional Details</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapDetailsFields}>
                  <FormikControl
                    control="radio"
                    name="additional_details.po_interchange_agreement"
                    label="Do you have a PO interchange agreement/Known owned Trailer coverage?"
                    options={optionObj}
                    customWrap={Style.additionalDetailsFieldWrap}
                  />
                  <FormikControl
                    control="radio"
                    name="additional_details.reefer_bd_coverage"
                    label="Do you have Reefer breakdown coverage?"
                    options={optionObj}
                    customWrap={Style.additionalDetailsFieldWrap}
                  />
                  <FormikControl
                    control="radio"
                    name="additional_details.load_cancellation_fees"
                    label="I understnd that there will be a $25 Load cancellation fees under this circumstances"
                    options={optionObj}
                    customWrap={Style.additionalDetailsFieldWrap}
                  />
                  <FormikControl
                    control="input"
                    name="additional_details.avg_gross_revenue_per_week"
                    label="How much is the average gross revenue per week in the last couple of weeks?"
                    dolar={true}
                    customWrap={Style.additionalDetailsFieldWrap}
                    fieldStyle={Style.dolarField}
                  />
                  <FormikControl
                    control="input"
                    name="additional_details.driver_go_home"
                    label="How often does your driver go home?"
                    placeholder="Enter Here"
                    customWrap={Style.additionalDetailsFieldWrap}
                  />
                  <FormikControl
                    control="input"
                    name="additional_details.expected_revenue"
                    label="How much is your expected Revenue with Metromax Dispatch?"
                    dolar={true}
                    customWrap={Style.additionalDetailsFieldWrap}
                    fieldStyle={Style.dolarField}
                  />
                </div>
              </section>
              <section className={`${Style.card} ${Style.cEqDetails}`}>
                <h4>Equipment Details</h4>
                <div className={Style.line}></div>
                <div className={Style.wrapDetailsFields}>
                  <FormikControl
                    control="input"
                    name="equipments_detail.equipments_start_date"
                    type="date"
                    label="Start Date"
                    placeholder="Enter here"
                  />
                  <FormikControl
                    control="input"
                    name="equipments_detail.total_truck_own"
                    label="Total Number of Trucks you Own"
                    placeholder="Enter Here"
                  />
                  <FormikControl
                    control="input"
                    name="equipments_detail.total_truck_start"
                    label="Enter number of Trucks that you'd like to start with"
                    placeholder="Enter Here"
                  />
                  <FormikControl
                    control="textarea"
                    name="equipments_detail.equipments_description"
                    label="Add Description"
                    placeholder="Type Here"
                  />
                </div>
              </section>
            </main>
            <section id={`${Style.saveButtonWrap}`}>
              <div id={Style.buttonWrap}>
                <button onClick={handleback}>Cancel</button>

                <AlertModel
                  type="Save"
                  title="The data has been succesfully saved."
                  button1="Close"
                  button2="Okay!"
                  typeoff="submit"
                  ref={alertRef}
                  navigateTo={'/OwnerFormPreview'}
                />
              </div>
            </section>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default OwnerForm;
