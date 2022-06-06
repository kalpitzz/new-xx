import React, { useEffect, useState, useRef } from 'react';
// import TextField from './TextField/textField';
import TextField from '../../components/previewTextField/textField';
import Style from './index.module.css';
import { useDispatch, useSelector } from 'react-redux';
import FormAction from '../../redux/actions/FormAction';
import ConfirmationModal from '../../components/modals/ConfirmModal';
import AlertModel from '../../components/modals/AlertModel';
import useAxios from '../../hooks/useAxios';
import { useNavigate, Link } from 'react-router-dom';

const OwnerDetailsPreview = () => {
  let axiosapi = useAxios();
  const dispatch = useDispatch();
  const axiosApi = useAxios();
  let navigate = useNavigate();
  const [response, setResponse] = useState({});
  const [render, setRender] = useState(0);
  const id = useSelector((state) => state.FormReducer.previewId);
  const prevRole = useSelector((state) => state.FormReducer.formType);
  const invitation = useSelector((state) => state.FormReducer.invitation);
  const closeModelRef = useRef();
  // Fetch Owner data based on ID
  async function fetch() {
    const value = await axiosapi.get(`/company/carrier/${id}/`);
    console.log(value);
    setResponse(value);
    setRender(1);
  }
  // Filter invite data from store based on ID
  function filterInvitation() {
    console.log(invitation.filter((item) => item.id === id)[0].application);
    setResponse(invitation.filter((item) => item.id === id)[0].application);
    setRender(1);
  }
  useEffect(() => {
    if (prevRole === 'Invitation') {
      filterInvitation();
    } else {
      fetch();
    }
  }, []);

  const handleYes = () => {
    axiosApi
      .delete(`/company/carrier/${id}/`)
      .then(dispatch(FormAction.deleteAction({ id: id, role: 'Owner' })))
      .then(navigate('/AddressBook'));
  };

  const handleClose = () => {
    navigate('/AddressBook');
  };

  const handleEdit = () => {
    // dispatch(FormAction.setPreviewId(response.in));
    dispatch(FormAction.setPreview(response));
    navigate('/ownerForm');
  };

  const approveHandler = (id) => {
    axiosApi
      .post(
        `/company/invitation/approve/`,
        invitation.filter((item) => item.id === id)[0].application
      )
      .then((res) => console.log(res));
  };

  function check(item) {
    return item === null || item === undefined ? '' : item;
  }

  function yesNo(item) {
    if (item !== null && item !== undefined && item !== '') {
      return item === true ? 'Yes' : 'No';
    }
    return '';
  }
  return render ? (
    <main>
      <div id={Style.title}>
        <Link to="/AddressBook">
          <i className="bx bx-left-arrow-alt bx-sm"></i>
        </Link>
        <h2>Carrier Profile</h2>
      </div>
      <section className={Style.sectionWrap}>
        <p className={Style.heading}>{`Owner Details`}</p>
        <div className={Style.line}></div>
        <div className={Style.TextSectionWrap}>
          <TextField label={'Carrier Name'} details={response.name} />
          <TextField label={'Contact Name'} details={response.contact_name} />
          <TextField label={'MC Number'} details={response.mc_number} />
          <TextField label={'Phone Number'} details={response.phone} />
          <TextField
            label={'Email Address'}
            details={response.email}
            detailsStyle={Style.letterBreak}
          />
          <TextField label={'DOT Number'} details={response.dot_number} />
          <TextField label={'FAX'} details={response.fax} />
        </div>
      </section>
      <section className={Style.sectionWrap}>
        <p className={Style.heading}>{`Owner Address`}</p>
        <div className={Style.line}></div>
        <div className={Style.TextSectionWrap}>
          <TextField
            label={'Address'}
            details={`${check(response.address.line_1)} ${check(
              response.address.line_2
            )} ${check(response.address.city)} ${check(
              response.address.state
            )} ${check(response.address.zipcode)}`}
          />
          <TextField
            label={'Additional Notes'}
            details={response.address.additional_notes}
          />
        </div>
      </section>
      <section className={Style.sectionWrap}>
        <p className={Style.heading}>{`Additional Contact`}</p>
        <div className={Style.line}></div>
        <div className={Style.TextSectionWrap}>
          <TextField
            label={'Contact Name'}
            details={`${check(response.additional_contact.first_name)} ${check(
              response.additional_contact.last_name
            )}`}
          />
          <TextField
            label={'Phone'}
            details={response.additional_contact.contact_phone}
          />
          <TextField
            label={'Contact Designation'}
            details={response.additional_contact.designation}
          />
          <TextField
            label={'Email address'}
            details={response.additional_contact.contact_email}
            detailsStyle={Style.letterBreak}
          />
        </div>
      </section>
      <section className={Style.sectionWrap}>
        <p className={Style.heading}>{`Website/Social`}</p>
        <div className={Style.line}></div>
        <div className={Style.TextSectionWrap}>
          <TextField
            label={'Website'}
            details={response.customer.social.website}
            detailsStyle={Style.letterBreak}
          />
          <TextField
            label={'Instagram'}
            details={response.customer.social.instagram}
            detailsStyle={Style.letterBreak}
          />
          <TextField
            label={'Twitter'}
            details={response.customer.social.twitter}
            detailsStyle={Style.letterBreak}
          />
          <TextField
            label={'Facebook'}
            details={response.customer.facebook}
            detailsStyle={Style.letterBreak}
          />
          <TextField
            label={'LinkedIn'}
            details={response.customer.linkedin}
            detailsStyle={Style.letterBreak}
          />
        </div>
      </section>
      {response.factoring_company ? (
        <section className={Style.sectionWrap}>
          <p className={Style.heading}>{`Factoring Company Details`}</p>
          <div className={Style.line}></div>
          <div className={Style.TextSectionWrap}>
            <TextField
              label={'Company Name'}
              details={response.factoring_company.factory_name}
            />
            <TextField
              label={'Login ID'}
              details={response.factoring_company.login_id}
            />
            <TextField
              label={'Password'}
              details={response.factoring_company.password}
            />
            <TextField
              label={'URL'}
              details={response.factoring_company.login_url}
              detailsStyle={Style.letterBreak}
            />
          </div>
        </section>
      ) : null}
      {response.insurance ? (
        <section className={Style.sectionWrap}>
          <p className={Style.heading}>{`Insurance Details`}</p>
          <div className={Style.line}></div>
          <div className={Style.TextSectionWrap}>
            <TextField
              label={'Company Name'}
              details={response.insurance.insurance_company_name}
            />
            <TextField
              label={'Insurance Document'}
              details={response.insurance.insurance_file}
            />
            <TextField
              label={'Insurance Expiration Date'}
              details={response.insurance.insurance_expiration_date}
            />
          </div>
        </section>
      ) : null}
      {response.additional_details ? (
        <section className={Style.sectionWrap}>
          <p className={Style.heading}>{`Additional Details`}</p>
          <div className={Style.line}></div>
          <div className={Style.TextSectionWrap}>
            <TextField
              label={
                'Do you have a PO interchange agreement/Known owned Trailer coverage?'
              }
              details={yesNo(
                response.additional_details.po_interchange_agreement
              )}
              labelStyle={Style.AdDetailsLabel}
              detailsStyle={Style.AdDetailsDetails}
              textWrap={Style.AdDetailsWrap}
            />
            <TextField
              label={'Do you have Reefer breakdown coverage?'}
              details={yesNo(response.additional_details.reefer_bd_coverage)}
              textWrap={Style.AdDetailsWrap}
              labelStyle={Style.AdDetailsLabel}
              detailsStyle={Style.AdDetailsDetails}
            />
            <TextField
              label={
                'I understnd that there will be a $25 Load cancellation fees under this circumstances'
              }
              details={yesNo(
                response.additional_details.load_cancellation_fees
              )}
              textWrap={Style.AdDetailsWrap}
              labelStyle={Style.AdDetailsLabel}
              detailsStyle={Style.AdDetailsDetails}
            />
            <TextField
              label={
                'How much is the average gross revenue per week in the last couple of weeks?'
              }
              details={
                response.additional_details.avg_gross_revenue_per_week
                  ? `$ ${check(
                      response.additional_details.avg_gross_revenue_per_week
                    )}`
                  : ''
              }
              textWrap={Style.AdDetailsWrap}
              labelStyle={Style.AdDetailsLabel}
              detailsStyle={Style.AdDetailsDetails}
            />
            <TextField
              label={'How often does your driver go home?'}
              details={response.additional_details.driver_go_home}
              textWrap={Style.AdDetailsWrap}
              labelStyle={Style.AdDetailsLabel}
              detailsStyle={Style.AdDetailsDetails}
            />
            <TextField
              label={
                'How much is your expected Revenue with Metromax Dispatch?'
              }
              details={
                response.additional_details.expected_revenue
                  ? `$ ${check(response.additional_details.expected_revenue)}`
                  : ''
              }
              textWrap={Style.AdDetailsWrap}
              labelStyle={Style.AdDetailsLabel}
              detailsStyle={Style.AdDetailsDetails}
            />
          </div>
        </section>
      ) : null}
      {response.equipments_detail ? (
        <section className={Style.sectionWrap}>
          <p className={Style.heading}>{`Equipment Details`}</p>
          <div className={Style.line}></div>
          <div className={Style.TextSectionWrap}>
            <TextField
              label={'Start Date'}
              details={response.equipments_detail.equipments_start_date}
            />
            <TextField
              label={'Total Number of Trucks you Own'}
              details={response.equipments_detail.total_truck_own}
            />
            <TextField
              label={"Enter number of Trucks that you'd like to start with"}
              details={response.equipments_detail.total_truck_start}
            />
            <TextField
              label={'Add Description'}
              details={response.equipments_detail.equipments_description}
            />
          </div>
        </section>
      ) : null}

      <div id={Style.ButtonSection}>
        <div>
          {prevRole === 'Invitation' ? (
            <AlertModel
              type="Approve"
              title="Approved!!"
              button1="Close"
              button2="Okay!"
              navigateTo="#"
              handleClick={() => approveHandler(id)}
              // style={{
              //   fontWeight: '500',
              //   fontSize: '1rem',
              //   color: 'black',
              //   backgroundColor: 'white',
              // }}
              // ref={closeModelRef}
              id="pop"
            />
          ) : (
            <ConfirmationModal
              type="Delete"
              title="Are you sure you want to delete this Info."
              subtitle="You cannot undo this action "
              button1="Yes"
              button2="No"
              handleYes={handleYes}
            />
          )}

          <button onClick={handleEdit}>Edit</button>

          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </main>
  ) : (
    ''
  );
};

export default OwnerDetailsPreview;
