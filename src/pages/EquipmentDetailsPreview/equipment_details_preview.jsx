import React, { useEffect, useState } from 'react';
import PreviewTextField from '../../components/previewTextField/textField';
import Style from './equipment_details.module.css';
import ConfirmModel from '../../components/modals/ConfirmModal';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import EquipmentAction from '../../redux/actions/equipmentAction';
import useAxios from '../../hooks/useAxios';
import { useNavigate } from 'react-router-dom';
const Equipment_Details_Preview = () => {
  const [response, setResponse] = useState();
  const [render, setRender] = useState(0);
  const AxiosApi = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const previewData = useSelector(
    (state) => state.equipmentReducer.equipmentPreview
  );
  const previewType = useSelector((state) => state.equipmentReducer.type);

  useEffect(() => {
    setResponse(previewData);
    setRender(1);
  }, [previewData]);

  const deleteHandler = (id) => {
    AxiosApi.delete(
      `/equipments/${previewType.toLowerCase()}/${previewData.id}/`
    ).then(() => {
      dispatch(
        EquipmentAction.deleteAction({ type: previewType, id: previewData.id })
      );
      navigate('/equipment');
    });
  };

  const editHandler = () => {
    dispatch(
      EquipmentAction.previewAction({
        edit_type: previewType,
        edit_id: previewData.id,
      })
    );
    if (previewType === 'Trailer') {
      navigate(`/equipment/${previewType.toLowerCase()}form`);
    } else {
      navigate('/equipment/addNewEquipment');
    }
  };

  const capitalizeFirstLetter = (string) => {
    return string === null || string === undefined
      ? ''
      : string.charAt(0).toUpperCase() + string.slice(1);
  };

  function check(item, tag) {
    return item === null || item === undefined ? '' : `${item} ${tag}`;
  }

  return (
    <>
      <div id={Style.title}>
        <Link to="/equipment">
          <i className="bx bx-left-arrow-alt bx-sm"></i>
        </Link>
        <h2>{`${previewType} Summary`}</h2>
      </div>
      <main
        id={previewType === 'Truck' ? Style.outerWrap : Style.outerWrapTrailer}
      >
        {render === 1 ? (
          <>
            {' '}
            <section className={`${Style.card} ${Style.header}`}>
              <PreviewTextField
                label="Carrier"
                details={response.company_name}
                textWrap={Style.correctionWrap}
              />
              <PreviewTextField
                label="Unit Number"
                details={response.unit_number}
                textWrap={Style.correctionWrap}
              />
              <PreviewTextField
                label="Dispatcher"
                details={response.dispatcher_name}
                textWrap={Style.correctionWrap}
              />
            </section>
            <section className={`${Style.card} ${Style.basic_details}`}>
              {console.log('res', response)}
              <h4>Basic Details</h4>
              <div className={Style.line}></div>
              <div className={Style.fieldWrapFull}>
                <PreviewTextField label="Model" details={response.model} />
                <PreviewTextField label="Make" details={response.make} />
                {previewType === 'Truck' ? (
                  <PreviewTextField
                    label="Gross Weight"
                    details={check(response.gross_weight, 'lbs')}
                  />
                ) : (
                  <PreviewTextField
                    label="Trailer Type"
                    details={response.trailer_type}
                  />
                )}
                {previewType === 'Truck' ? (
                  <PreviewTextField
                    label="Fuel Type"
                    details={response.fuel_type}
                  />
                ) : (
                  <PreviewTextField
                    label="Trailer Length"
                    details={check(response.trailer_length, 'ft')}
                  />
                )}
                <PreviewTextField
                  label="Number of Axles"
                  details={response.no_of_axle}
                />
                <PreviewTextField label="Status" details={response.status} />
                {previewType === 'Truck' ? (
                  <PreviewTextField
                    label="Additional Notes"
                    details={response.bd_additional_notes}
                  />
                ) : null}
              </div>
            </section>
            <section className={`${Style.card} ${Style.vehicle_details}`}>
              <h4>
                {previewType === 'Truck' ? 'Vehicle' : 'Purchased'} Details
              </h4>
              <div className={Style.line}></div>
              <div className={Style.fieldWrapFull}>
                <PreviewTextField
                  label="Purchased Year"
                  details={response.year_purchased}
                />
                <PreviewTextField label="VIN" details={response.VIN} />
                <PreviewTextField label="Owner" details={response.owner_name} />
                <PreviewTextField
                  label="Title Number"
                  details={response.title_number}
                />
                <PreviewTextField
                  label="Height"
                  details={check(response.height, 'ft')}
                />
                <PreviewTextField
                  label="Unladen Weight"
                  details={check(response.unladen_weight, 'lbs')}
                />
                <PreviewTextField
                  label="Serial Number"
                  details={response.serial_number}
                />
                {previewType === 'Truck' ? (
                  <PreviewTextField
                    label="Additional Notes"
                    details={response.vd_additional_notes}
                  />
                ) : (
                  <PreviewTextField
                    label="Additional Notes"
                    details={response.pd_additional_notes}
                  />
                )}
              </div>
            </section>
            <section className={`${Style.card} ${Style.license}`}>
              <h4>License</h4>
              <div className={Style.line}></div>
              <div className={Style.fieldWrapHalf}>
                <PreviewTextField
                  label="License Plate No."
                  details={response.license.plate_number}
                  labelStyle={Style.labelCorrection}
                />
                <PreviewTextField
                  label="Inspection Date"
                  details={response.license.inspection_date}
                  labelStyle={Style.labelCorrection}
                />
                <PreviewTextField
                  label="Lic Expiration"
                  details={response.license.license_expiration_date}
                  labelStyle={Style.labelCorrection}
                />
                <PreviewTextField
                  label="Registered State"
                  details={capitalizeFirstLetter(
                    response.license.registered_state
                  )}
                  labelStyle={Style.labelCorrection}
                />
                <PreviewTextField
                  label="License Document"
                  details={response.license.license_file}
                  labelStyle={Style.labelCorrection}
                  detailsStyle={Style.documentBrakeText}
                  link={true}
                />
              </div>
            </section>
            <section className={`${Style.card} ${Style.insurance}`}>
              <h4>Insurance</h4>
              <div className={Style.line}></div>
              <div className={Style.fieldWrapHalf}>
                <PreviewTextField
                  label="Insurance Company"
                  details={response.insurance.company_name}
                />
                <PreviewTextField
                  label="Policy Number"
                  details={response.insurance.policy_number}
                />
                <PreviewTextField
                  label="Insurance Exp"
                  details={response.insurance.insurance_expiration_date}
                />
                <PreviewTextField
                  label="Insurance Document"
                  details={response.insurance.insurance_file}
                  detailsStyle={Style.documentBrakeText}
                  link={true}
                />
              </div>
            </section>
            <section className={`${Style.card} ${Style.additional_details}`}>
              <h4>Additional Details</h4>
              <div className={Style.line}></div>
              <div className={Style.fieldWrapFull}>
                <PreviewTextField
                  label="Cost"
                  details={response.cost === null ? '' : `$${response.cost}`}
                />
                <PreviewTextField
                  label="FMV"
                  details={
                    response.fair_market_value === null
                      ? ''
                      : `$${response.fair_market_value}`
                  }
                />
                <PreviewTextField label="Color" details={response.color} />
                <PreviewTextField
                  label="Tire Info"
                  details={response.tire_info}
                />
                <PreviewTextField
                  label="Additional Notes"
                  details={response.ad_additional_notes}
                />
              </div>
            </section>
            <section className={`${Style.card} ${Style.upload}`}>
              <h4>Upload Documents</h4>
              <div className={Style.line}></div>
              <div className={Style.fieldWrapFull}>
                <PreviewTextField
                  label="Document Name"
                  details={response.document.document_name}
                />
                <PreviewTextField
                  label="Document"
                  details={response.document.file}
                  detailsStyle={Style.documentBrakeText}
                  link={true}
                />
                <PreviewTextField
                  label="Description"
                  details={response.document.description}
                />
              </div>
            </section>
            {previewType === 'Truck' ? (
              <section className={`${Style.card} ${Style.assign}`}>
                <h4>Assigned Trailer and Driver</h4>
                <div className={Style.line}></div>
                <div className={Style.fieldWrapFull}>
                  <PreviewTextField
                    label="Assigned Trailer"
                    details={response.trailer_unit_number}
                  />
                  <PreviewTextField
                    label="Assigned Driver"
                    details={response.driver_name}
                  />
                </div>
              </section>
            ) : null}
            <section className={Style.button_section}>
              <div className={Style.button_wrap}>
                <ConfirmModel
                  type="Delete"
                  title="Are you sure you want to delete this Info."
                  subtitle="You cannot undo this action "
                  button1="Yes"
                  button2="No"
                  handleYes={deleteHandler}
                />
                <button onClick={editHandler}>Edit</button>
                <Link to="/equipment">
                  <button>Close</button>
                </Link>
              </div>
            </section>
          </>
        ) : (
          'Loading...'
        )}
      </main>
    </>
  );
};

export default Equipment_Details_Preview;
