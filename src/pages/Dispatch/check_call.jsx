import React, { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormikControl from '../../components/Formfield/formikControl';
import Style from './dispatch.module.css';
import { Formik, Form, Field } from 'formik';
import AlertModel from '../../components/modals/AlertModel';
import { Button, Modal, Box } from '@mui/material';
import useAxios from '../../hooks/useAxios';
import { loadBingApi, Microsoft } from './BingMapLoader.ts';
import { useSelector, useDispatch } from 'react-redux';
import DispatchAction from '../../redux/actions/DispatchAction';
import WebSocketAction from '../../redux/actions/webSocketAction';
import dayjs from 'dayjs';
import './mapStyle.css';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';

const Check_call = () => {
  const dispatch = useDispatch();
  const dispatchId = useSelector((state) => state.DispatchReducer.dispatch_id);
  const socketDataStore = useSelector((state) => state.DispatchReducer.socket);
  const current_driver_location = useSelector(
    (state) => state.WebSocketReducer.current_driver_location
  );
  const Range = 1;
  const modifyStatus = (status) => {
    switch (status) {
      case 'Trip Started':
        return 'trip_started';
      case 'Arrived At Pick-up':
        return 'arrived_at_pick_up';
      case 'Picked Up':
        return 'picked_up';
      case 'Arrived At Delivery':
        return 'arrived_at_delivery';
      case 'Delivered':
        return 'delivered';
      case 'Cancelled':
        return 'cancelled';
      case 'Completed':
        return 'completed';
      default:
        return '';
    }
  };
  const getStatus = (status) => {

    switch (status) {
      case 'Dispatched':
        return 'trip_started';
      case 'Trip Started':
        return 'arrived_at_pick_up';
      case 'Arrived At Pick-up':
        return 'picked_up';
      case 'Picked Up':
        return 'arrived_at_delivery';
      case 'Arrived At Delivery':
        return 'delivered';
      case 'Delivered':
        return 'completed';
      default:
        return '';
    }
  };
  const returnStatus = (status) => {
    switch (status) {
      case 'Dispatched':
        return { value: 'trip_started', key: 'Trip Started' };
      case 'Trip Started':
        return { value: 'arrived_at_pick_up', key: 'Arrived At Pick-up' };
      case 'Arrived At Pick-up':
        return { value: 'picked_up', key: 'Picked Up' };
      case 'Picked Up':
        return { value: 'arrived_at_delivery', key: 'Arrived At Delivery' };
      default:
        return '';
    }
  };
  console.log('Dispacth', dispatchId);
  const allStatus = [
    { value: '', key: 'Select Status' },
    { value: 'trip_started', key: 'Trip Started' },
    { value: 'arrived_at_pick_up', key: 'Arrived At Pick-up' },
    { value: 'picked_up', key: 'Picked Up' },
    { value: 'arrived_at_delivery', key: 'Arrived At Delivery' },
    { value: 'delivered', key: 'Delivered' },
    { value: 'cancelled', key: 'Cancelled' },
    { value: 'completed', key: 'Completed' },
  ];

  const defaultStatus = [
    { value: '', key: 'Select Status' },
    { value: 'delivered', key: 'Delivered' },
    { value: 'cancelled', key: 'Cancelled' },
    { value: 'completed', key: 'Completed' },
  ];

  // console.log('dispatchID', dispatchId);
  const status = [
    { value: '', key: 'Select Status' },

    {
      value: returnStatus(dispatchId.status).value,
      key: returnStatus(dispatchId.status).key,
    },

    { value: 'delivered', key: 'Delivered' },
    { value: 'cancelled', key: 'Cancelled' },
    { value: 'completed', key: 'Completed' },
  ];

  const alertRef = useRef();
  const checkRef = useRef();
  const formSubmit = useRef();
  const AxiosApi = useAxios();
  const navigate = useNavigate();
  const { state } = useLocation();
  // console.log('state', state);

  const [choice, setChoice] = useState('Manual');
  const [rangeAlert, SetRangeAlert] = useState(false);
  const [driverLocation, setDriverLocation] = useState({
    address: '',
    lat: '',
    long: '',
  });

  // Bing Map init---------------------------------------------------------------------------------------------------------------------------

  const [destination1, setDestination1] = useState({
    address: {
      addressLine: '',
      adminDistrict: '',
      countryRegion: '',
      countryRegionISO2: '',
      district: '',
      formattedAddress: '',
      locality: '',
      postalCode: '',
    },
    lat: null,
    long: null,
  });

  useEffect(() => {
    if (driverLocation?.lat) {
      checkRef.current.setFieldValue('address', driverLocation?.address);
      checkRef.current.setFieldValue('zip_code', driverLocation?.zip_code);
      checkRef.current.setFieldValue('latitude', driverLocation?.lat);
      checkRef.current.setFieldValue('longitude', driverLocation?.long);
      checkRef.current.setFieldValue('city', driverLocation?.city);
    }
  }, [driverLocation]);

  useEffect(() => {
    if (destination1?.address?.postalCode) {
      console.log(destination1);
      checkRef.current?.setFieldValue('city', destination1?.address.locality);
      checkRef.current?.setFieldValue(
        'zip_code',
        destination1?.address.postalCode
      );
      checkRef.current?.setFieldValue('latitude', destination1?.lat);
      checkRef.current?.setFieldValue('longitude', destination1?.long);
      checkRef.current?.setFieldValue(
        'address',
        destination1?.address.formattedAddress
      );
    } else if (destination1?.address?.locality) {
      checkRef.current?.setFieldValue('city', destination1?.address.locality);
      checkRef.current?.setFieldValue('zip_code', '');
      checkRef.current?.setFieldValue('latitude', destination1?.lat);
      checkRef.current?.setFieldValue('longitude', destination1?.long);
      checkRef.current?.setFieldValue(
        'address',
        destination1?.address.formattedAddress
      );
    }
  }, [destination1]);

  function initMap() {
    function selectedSuggestion1(suggestionResult) {
      setDestination1({
        address: suggestionResult.address,
        lat: suggestionResult.location.latitude,
        long: suggestionResult.location.longitude,
      });
    }

    // -------------------------------------------------------------------------------------------------------------------------------------------

    Microsoft.Maps.loadModule('Microsoft.Maps.AutoSuggest', function () {
      // Autosuggest feature
      var manager1;

      manager1 = new Microsoft.Maps.AutosuggestManager({
        maxResults: 5,
        businessSuggestions: true,
        // map: map,
      });

      manager1.attachAutosuggest(
        '.location_1',
        '.location_1_container',
        selectedSuggestion1
      );
    });
  }

  // --------------------------------------------------------------------------------------------------------------------------------------

  const handleback = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (current_driver_location) {
      console.log('Driver Location', current_driver_location);
      setDriverLocation({
        lat: current_driver_location?.message?.latitude,
        long: current_driver_location?.message?.longitude,
        address: current_driver_location?.message?.address,
        zip_code: current_driver_location?.message?.zip_code,
        city: current_driver_location?.message?.city,
      });
    }
  }, [current_driver_location]);

  function checkForNull(input) {
    return input === null ? '' : input;
  }

  let initialValue;
  if (dispatchId.data) {
    initialValue = {
      address: dispatchId?.data[0].address,
      dispatch: dispatchId?.id,
      status: modifyStatus(dispatchId?.data[0].status),
      latitude: dispatchId?.data[0].latitude,
      longitude: dispatchId?.data[0].longitude,
      notes: dispatchId?.data[0].notes,
      odometer: dispatchId?.data[0].odometer,
      reason: dispatchId?.data[0].reason,
      city: dispatchId?.data[0].city,
      zip_code: checkForNull(dispatchId?.data[0].zip_code),
      current_date_time: dayjs(dispatchId?.data[0].current_date_time).format(
        'YYYY-MM-DDTHH:mm'
      ),
    };
  } else {
    initialValue = {
      address: '',
      dispatch: dispatchId?.id,
      status: '',
      latitude: '',
      longitude: '',
      notes: '',
      odometer: '',
      reason: '',
      city: '',
      zip_code: '',
      current_date_time: '',
    };
  }

  useEffect(() => {
    loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
      initMap();
    });
    return () => {
      dispatch(WebSocketAction.setSocketDriverLocation(''));
    };
  }, []);

  const validation = Yup.object().shape({
    status: Yup.string().required('Required'),
    address: Yup.string().required('Required'),
    zip_code: Yup.string().required('Required'),
    current_date_time: Yup.string().required('Required'),
  });
  // console.log('dispatchId', dispatchId);
  // console.log('ref', checkRef);

  useEffect(() => {
    if (destination1?.address.locality) {
      loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
        initMap();
      });
    }
  }, [destination1]);

  const handleGetDriverLocation = () => {
    if (socketDataStore) {
      socketDataStore.send(
        JSON.stringify({
          type: 'get_driver_location',
          dispatch: dispatchId.id,
        })
      );
    }
  };

  function initDirection({ dispatchId, wayPoints }, map, api_object) {
    console.log('wayPoints', wayPoints, 'id', dispatchId);
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function (e) {
      // Feed Details of Truck and load type and get directions
      console.log('Map', map);
      var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(
        map
      );

      directionsManager.setRequestOptions({
        // routeMode : driving/truck/transit/walking
        routeMode: Microsoft.Maps.Directions.RouteMode.truck,

        vehicleSpec: {
          dimensionUnit: 'ft',
          weightUnit: 'lb',
          vehicleHeight: 5,
          vehicleWidth: 3.5,
          vehicleLength: 30,
          vehicleWeight: 30000,
          vehicleAxles: 3,
          vehicleTrailers: 2,
          vehicleSemi: true,
          vehicleMaxGradient: 10,
          vehicleMinTurnRadius: 15,
          vehicleAvoidCrossWind: true,
          vehicleAvoidGroundingRisk: true,
          vehicleHazardousMaterials: 'F',
          vehicleHazardousPermits: 'F',
        },

        //  To calculate the number of routes max 3
        maxRoutes: 3,

        //For Distance unit Change (km, miles)
        distanceUnit: Microsoft.Maps.Directions.DistanceUnit.miles,
      });

      wayPoints.map((item) => {
        var wp = new Microsoft.Maps.Directions.Waypoint({
          address: item,
        });

        directionsManager.addWaypoint(wp);
      });

      // Calculates distance based on waypoints
      directionsManager.calculateDirections();

      Microsoft.Maps.Events.addHandler(
        directionsManager,
        'directionsUpdated',
        calculateTimeDistance
      );

      function calculateTimeDistance(e) {
        //Get the current route index.
        var routeIdx = directionsManager.getRequestOptions().routeIndex;

        //Get the distance of the route, rounded to 2 decimal places.
        var distance = Math.round(
          (e.routeSummary[routeIdx].distance * 100) / 100
        );

        //Get the distance units used to calculate the route.
        var units = directionsManager.getRequestOptions().distanceUnit;

        var distanceUnits = '';

        if (units == Microsoft.Maps.Directions.DistanceUnit.km) {
          //If in kilometers
          distanceUnits = 'km';
        } else {
          //If in miles
          distanceUnits = 'miles';
        }
        console.log(`${distance} ${distanceUnits}`);
        if (distance > Range) {
          SetRangeAlert(true);
        } else {
          alert('CheckCall Created with Verification!');

          // AxiosApi.post(
          //   `dispatch/checkcall/?dispatch_id=${id}`,
          //   api_object
          // ).then((res) => {
          //   dispatch(
          //     DispatchAction.changeStatusDispatchTableData({
          //       id: id,
          //       status:status,
          //     })
          //   );
          //   alertRef.current.showModel();
          // });
        }

        // //Time is in seconds, convert to minutes and round off.
        // var time = Math.round(e.routeSummary[routeIdx].timeWithTraffic / 60);

        // // Hours are extracted
        // var time_hrs = Math.trunc(time / 60);

        // // Minutes Are Extracted
        // var time_min = Math.round(time % 60);
      }
    });
  }

  const forceCheckCall = () => {
    console.log('Submit', formSubmit.current);
    // alert('Form Submit After Alert');
    alertRef.current.showModel();
    // AxiosApi.post(
    //   `dispatch/checkcall/?dispatch_id=${dispatchId.id}`,
    //   formSubmit.current
    // ).then((res) => {
    //   if (state !== 'dashboard') {
    //     dispatch(DispatchAction.postCheckCallData(res));

    //     dispatch(
    //       DispatchAction.changeStatusDispatchTableData({
    //         id: dispatchId.id,
    //         status: res.status,
    //       })
    //     );
    //   }
    //   if (state === 'dashboard') {
    //     dispatch(
    //       DispatchAction.postCheckCallData({
    //         id: dispatchId.id,
    //         data: res,
    //       })
    //     );
    //   }
    //   // dispatch(DispatchAction.postCheckCallData(res));
    //   SetRangeAlert(false)
    //   alertRef.current.showModel();

    // });
  };

  return (
    <main>
      <Formik
        initialValues={initialValue}
        validationSchema={validation}
        innerRef={checkRef}
        onSubmit={(values) => {
          let submit_value = {
            ...values,
            current_date_time: dayjs(values.current_date_time).format(),
            odometer: values.odometer === '' ? null : values.odometer,
          };

          if (dispatchId.data) {
            AxiosApi.patch(
              `dispatch/checkcall/${dispatchId.data[0].id}/?dispatch_id=${dispatchId.id}`,
              submit_value
            ).then((res) => {
              dispatch(
                DispatchAction.editCheckCallData({
                  id: dispatchId.data[0].id,
                  data: res,
                })
              );
              alertRef.current.showModel();
            });
          } else if (
            current_driver_location &&
            dispatchId.wayPointToCompare &&
            (dispatchId.status === 'Trip Started' ||
              dispatchId.status === 'Picked Up')
          ) {
            formSubmit.current = submit_value;
            let way_Points = [
              dispatchId.wayPointToCompare,
              driverLocation.address,
            ];

            loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
              var map = new Microsoft.Maps.Map(
                document.getElementById('myMap'),
                {}
              );
              initDirection(
                { dispatchId: dispatchId.id, wayPoints: way_Points },
                map,
                submit_value
              );
            });
          } else if (
            dispatchId.status === 'Dispatched' ||
            dispatchId.status === 'Arrived At Pick-up' ||
            dispatchId.status === 'Arrived At Delivery' ||
            dispatchId.status === 'Delivered'
          ) {
            AxiosApi.post(
              `dispatch/checkcall/?dispatch_id=${dispatchId.id}`,
              submit_value
            ).then((res) => {
              if (state !== 'dashboard') {
                dispatch(DispatchAction.postCheckCallData(res));

                dispatch(
                  DispatchAction.changeStatusDispatchTableData({
                    id: dispatchId.id,
                    status: res.status,
                  })
                );
              }
              if (state === 'dashboard') {
                dispatch(
                  DispatchAction.postCheckCallData({
                    id: dispatchId.id,
                    data: res,
                  })
                );
              }
              // dispatch(DispatchAction.postCheckCallData(res));
              alertRef.current.showModel();
            });
          }

          console.log('Submit Value', submit_value);
        }}
      >
        {(formik_check_call) => (
          <div className={Style.checkCall}>
            <div id={Style.title}>
              <i
                className="bx bx-left-arrow-alt bx-sm"
                onClick={handleback}
              ></i>
              <h2>Check Call</h2>
              <div className={Style.choiceWrap}>
                <div>
                  <Button
                    type="button"
                    className={choice === 'Manual' ? Style.active : ''}
                    onClick={() => {
                      setChoice('Manual');
                      dispatch(WebSocketAction.setSocketDriverLocation(''));
                      formik_check_call.resetForm();
                    }}
                  >
                    Manual
                  </Button>
                  <Button
                    type="button"
                    className={choice === 'Auto' ? Style.active : ''}
                    onClick={() => {
                      handleGetDriverLocation();
                      setChoice('Auto');
                      formik_check_call.setFieldValue(
                        'status',
                        getStatus(dispatchId.status)
                      );
                      formik_check_call.setFieldValue(
                        'current_date_time',
                        dayjs(new Date()).format('YYYY-MM-DDTHH:mm')
                      );
                    }}
                  >
                    Auto
                  </Button>
                </div>
              </div>
            </div>
            <h4>Check Call</h4>
            <Form>
              <div className={Style.checkCallWrap}>
                {/* <FormikControl
                  label="Truck"
                  control="select"
                  options={truckList}
                  name="truck"
                /> */}

                <FormikControl
                  label="Status*"
                  control="select"
                  options={
                    dispatchId?.data
                      ? allStatus
                      : dispatchId?.status === 'Arrived At Delivery'
                      ? defaultStatus
                      : status
                  }
                  name="status"
                  disabled={dispatchId?.data ? true : false}
                />
                <FormikControl
                  label="Date/Time at current location*"
                  control="input"
                  name="current_date_time"
                  type="datetime-local"
                />

                <div className={`${Style.current_Location}`}>
                  <label>Current Location*</label>
                  <div
                    className={`location_1_container  ${Style.current_Location_wrapper} `}
                  >
                    <div
                      className={`${Style.city_wrap} ${
                        formik_check_call?.errors?.city &&
                        formik_check_call?.touched?.city &&
                        Style.errorStyle
                      }`}
                    >
                      <Field
                        name="address"
                        placeholder="Address"
                        className={`location_1 ${Style.city_field}`}
                      />
                      <div
                        style={{
                          display:
                            formik_check_call?.errors?.city &&
                            formik_check_call?.touched?.city
                              ? ''
                              : 'none',
                        }}
                      >
                        {formik_check_call?.errors?.city}
                      </div>
                    </div>
                    <div
                      className={`${Style.zipcode_wrap} ${
                        formik_check_call?.errors?.zip_code &&
                        formik_check_call?.touched?.zip_code &&
                        Style.errorStyle
                      }`}
                    >
                      <Field
                        name="zip_code"
                        placeholder="ZipCode"
                        className={Style.zipcode}
                      />
                      <div
                        style={{
                          display:
                            formik_check_call?.errors?.zip_code &&
                            formik_check_call?.touched?.zip_code
                              ? ''
                              : 'none',
                        }}
                      >
                        {formik_check_call?.errors?.zip_code}
                      </div>
                    </div>
                  </div>
                </div>

                <FormikControl
                  label="Current Odometer"
                  control="input"
                  placeholder="Enter Odometer Reading"
                  name="odometer"
                  type="number"
                />
                <FormikControl
                  label="Enter Reason"
                  placeholder="Type Reason"
                  control="textarea"
                  name="reason"
                />
                <FormikControl
                  label="Notes"
                  control="textarea"
                  placeholder="Type Here"
                  name="notes"
                />
              </div>
              <div id={Style.buttonSection}>
                <div id={Style.buttonWraper}>
                  <button onClick={handleback} type="button">
                    Cancel
                  </button>

                  <AlertModel
                    type={`Save`}
                    title={`Check Call Successfully Created..`}
                    button1="Close"
                    button2="Okay!"
                    typeoff="submit"
                    ref={alertRef}
                    handleOkay={() => console.log('Saved')}
                    navigateTo={-1}
                  />
                </div>
              </div>
              <Modal open={rangeAlert} onClose={() => SetRangeAlert(false)}>
                <Box className={Style.driverAlertWrap}>
                  <h4>Driver not in desired Location Rage</h4>
                  <div className={Style.driverAlertTextWrap}>
                    <p>Would you like to continue anyway?</p>
                    <div className={Style.driverAlertClose}>
                      <button onClick={forceCheckCall}>Continue</button>
                    </div>
                  </div>
                </Box>
              </Modal>
            </Form>
          </div>
        )}
      </Formik>
      <div id="myMap"></div>
    </main>
  );
};
export default Check_call;
