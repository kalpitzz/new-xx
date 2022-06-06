import React, { useEffect, useState } from 'react';
import TextField from '../../components/previewTextField/textField';
import Style from './index.module.css';
import useAxios from '../../hooks/useAxios';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import FormAction from '../../redux/actions/FormAction';
import ConfirmationModal from '../../components/modals/ConfirmModal';

const DynamicFormPreview = () => {
  const dispatch = useDispatch();
  const id = useSelector((state) => state.FormReducer.previewId);
  let type = useSelector((state) => state.FormReducer.formType);
  const [response, setResponse] = useState();
  const [render, setRender] = useState(0);
  let navigate = useNavigate();
  let axiosapi = useAxios();
  useEffect(() => {
    switch (type) {
      case 'Driver':
        axiosapi.get(`/drivers/${id}/`).then((res) => {
          console.log(res);
          setResponse(res);
          setRender(1);
        });
        break;
      case 'Others':
        axiosapi.get(`/company/others/${id}/`).then((res) => {
          console.log(res);
          setResponse(res);
          setRender(1);
        });
        break;
      case 'Broker':
        axiosapi.get(`/company/broker/${id}/`).then((res) => {
          console.log(res);
          setResponse(res);
          setRender(1);
        });
        break;
      case 'Dispatcher':
        axiosapi.get(`/company/dispatcher/${id}/`).then((res) => {
          console.log(res);
          setResponse(res);
          setRender(1);
        });
        break;
      default:
        break;
    }
  }, []);

  const EditHandler = () => {
    dispatch(FormAction.setPreview(response));
  };

  function yesNo(item) {
    if (item !== null && item !== undefined && item !== '') {
      return item === true ? 'Yes' : 'No';
    }
    return '';
  }

  const handleYes = () => {
    switch (type) {
      case 'Broker':
        axiosapi
          .delete(`/company/broker/${id}/`)
          .then(dispatch(FormAction.deleteAction({ id: id, role: type })))
          .then(navigate('/AddressBook'));
        break;
      case 'Driver':
        axiosapi
          .delete(`/drivers/${id}/`)
          .then(dispatch(FormAction.deleteAction({ id: id, role: type })))
          .then(navigate('/AddressBook'));
        break;
      case 'Others':
        axiosapi
          .delete(`/company/others/${id}/`)
          .then(dispatch(FormAction.deleteAction({ id: id, role: type })))
          .then(navigate('/AddressBook'));
        break;
      case 'Dispatcher':
        axiosapi
          .delete(`/company/dispatcher/${id}/`)
          .then(dispatch(FormAction.deleteAction({ id: id, role: type })))
          .then(navigate('/AddressBook'));
        break;
      case 'Owner':
        axiosapi
          .delete(`/company/carrier/${id}/`)
          .then(dispatch(FormAction.deleteAction({ id: id, role: type })))
          .then(navigate('/AddressBook'));
        break;
      default:
        break;
    }
  };
  return render ? (
    <main id={Style.mainWrap}>
      <div id={Style.title}>
        <Link to="/AddressBook">
          <i className="bx bx-left-arrow-alt bx-sm"></i>
        </Link>
        <h2>{`${type} Profile`}</h2>
      </div>
      <section id={Style.CarrierDetailsSection}>
        <div>
          <p id={Style.heading}>{`${type} Details`}</p>
          <div className={Style.Circle}></div>
        </div>
        <div className={Style.TextSectionWrap}>
          <TextField
            label={`Company Name:`}
            details={`${
              type !== 'Dispatcher' && type !== 'Driver'
                ? response.company_name
                : type === 'Dispatcher'
                ? 'Metro Max'
                : response.company_id
            }`}
          />
          <TextField
            label={`${type} Name:`}
            details={`${response.first_name || response.user.first_name} ${
              type === 'Dispatcher' || type === 'Driver'
                ? response.user.last_name == null
                  ? ''
                  : response.user.last_name
                : response.last_name === null
                ? ''
                : response.last_name
            }`}
          />
          <TextField
            label={`Phone number:`}
            details={`${
              type === 'Dispatcher' || type === 'Driver'
                ? response.user.phone === null
                  ? ''
                  : response.user.phone
                : response.contact_phone === null
                ? ''
                : response.contact_phone
            }`}
          />
          <TextField
            label={`Email:`}
            details={`${
              type === 'Dispatcher' || type === 'Driver'
                ? response.user.email === null
                  ? ''
                  : response.user.email
                : response.contact_email === null
                ? ''
                : response.contact_email
            }`}
            detailsStyle={Style.letterBreak}
          />
          <TextField
            label={`Comment:`}
            details={`${
              response.comment === null || response.comment === undefined
                ? ''
                : response.comment
            }`}
          />
        </div>
      </section>

      <section id={Style.CarrierDetailsSection}>
        <div>
          <p id={Style.heading}>{`${type} Address`}</p>
          <div className={Style.Circle}></div>
        </div>
        <div className={Style.TextSectionWrap}>
          <TextField
            label={`Address:`}
            details={`${
              response.address.city === null ? '' : response.address.city
            }, ${response.address.line_1}, ${response.address.line_2}, State: ${
              response.address.state
            } ${response.address.zipcode}`}
            detailsStyle={{ paddingLeft: '2rem' }}
          />
          <TextField
            label={`Additional Notes:`}
            details={`${
              response.address.additional_notes === null ||
              response.address.additional_notes === undefined
                ? ''
                : response.address.additional_notes
            }`}
          />
        </div>
      </section>
      {type === 'Driver' ? (
        <section id={Style.CarrierDetailsSection}>
          <div>
            <p id={Style.heading}>{`Additional Details`}</p>
            <div className={Style.Circle}></div>
          </div>
          <div className={Style.TextSectionWrap}>
            {/* <TextField
              label={
                'Do you have a PO interchange agreement/Known owned Trailer coverage?'
              }
              details={yesNo(
                response.additional_details.po_interchange_agreement
              )}
              labelStyle={Style.AdDetailsLabel}
              detailsStyle={Style.AdDetailsDetails}
              textWrap={Style.AdDetailsWrap}
            /> */}
            <TextField
              label={`Additional Notes:`}
              details={`${
                response.address.additional_notes === null ||
                response.address.additional_notes === undefined
                  ? ''
                  : response.address.additional_notes
              }`}
            />
          </div>
        </section>
      ) : null}

      <div id={Style.ButtonSection}>
        <div>
          <ConfirmationModal
            type="Delete"
            title="Are you sure you want to delete this Info."
            subtitle="You cannot undo this action "
            button1="Yes"
            button2="No"
            handleYes={handleYes}
          />
          <Link
            to={{
              pathname: '/dynamicForm',
            }}
            onMouseDown={EditHandler}
          >
            <button>Edit</button>
          </Link>
          <Link to="/AddressBook">
            <button
              style={{
                backgroundColor: '#3288e6',
                border: 'none',
                color: 'white',
              }}
            >
              Close
            </button>
          </Link>
        </div>
      </div>
    </main>
  ) : null;
};

export default DynamicFormPreview;
