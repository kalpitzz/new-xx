import { Button } from '@material-ui/core';
import React, { useEffect, useState, useRef } from 'react';
import style from './CheckCallTable.module.css';
import { useSelector, useDispatch } from 'react-redux';
import useAxios from '../../../hooks/useAxios';
import { useLocation, useNavigate } from 'react-router-dom';
import DispatchAction from '../../../redux/actions/DispatchAction';
import { loadBingApi, Microsoft } from '../BingMapLoader.ts';
import useAuth from '../../../hooks/useAuth';
import dayjs from 'dayjs';
import WebSocketAction from '../../../redux/actions/webSocketAction';
import { Box, Modal } from '@mui/material';
const CheckCallTable = ({ dispatchDetails }) => {
  const [Data, setData] = useState([]);
  const [tripStartData, settripStartData] = useState([{}]);
  const [checkCallData, setcheckCallData] = useState([{}]);
  const [driverLocation, setDriverLocation] = useState({
    address: '',
    lat: '',
    long: '',
  });

  const socketDataStore = useSelector((state) => state.DispatchReducer.socket);
  const current_driver_location = useSelector(
    (state) => state.WebSocketReducer.current_driver_location
  );

  const [renderMap, setRenderMap] = useState(false);
  const AxiosApi = useAxios();
  const mapRef = useRef();
  const { auth } = useAuth();
  const summaryData = useSelector((state) =>
    state.DispatchReducer.dispatchSummaryData === undefined
      ? [{}]
      : state.DispatchReducer.dispatchSummaryData
  );
  console.log('driver name', summaryData[0]?.driver?.user?.first_name);

  const dispatch = useDispatch();
  // const Auth = useAuth();

  const CheckCallData = useSelector(
    (state) => state.DispatchReducer.checkCallData
  );
  console.log('check call table data', CheckCallData);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (driverLocation?.lat) {
      console.log('driverLoc', driverLocation);
      handleGeoLocation({
        lat: driverLocation?.lat,
        long: driverLocation?.long,
        wayPoints: [
          ...dispatchDetails[0].load.pickup_location,
          ...dispatchDetails[0].load.dropoff_location,
        ],
      });
    }
  }, [driverLocation]);

  // Check for change in socket driver location and updates form input
  useEffect(() => {
    if (current_driver_location) {
      setDriverLocation({
        lat: current_driver_location?.message?.latitude,
        long: current_driver_location?.message?.longitude,
        address: current_driver_location?.message?.address,
      });
    }
  }, [current_driver_location]);

  useEffect(() => {
    AxiosApi(`dispatch/checkcall/?dispatch_id=${location.state}`).then(
      (res) => {
        dispatch(DispatchAction.setCheckCallData(res));
        setData(res);
      }
    );
    return () => {
      dispatch(WebSocketAction.setSocketDriverLocation(''));
    };
  }, []);

  useEffect(() => {
    settripStartData(Data?.filter((res) => res?.status === 'Trip Started'));
    setcheckCallData(Data?.filter((res) => res?.status !== 'Trip Started'));
  }, [Data]);

  console.log('data', Data);

  console.log(
    'trip data',
    tripStartData,
    'check call data',
    checkCallData,
    'dispatchDetails',
    dispatchDetails
  );

  const handleAddCheckCall = () => {
    dispatch(
      DispatchAction.setDispatchId(
        dispatchDetails
          ? {
              id: dispatchDetails[0].id,
              status: dispatchDetails[0].status,
              wayPointToCompare:
                dispatchDetails[0].status === 'Trip Started'
                  ? dispatchDetails[0].load.pickup_location[0].address.line_1
                  : dispatchDetails[0].status === 'Picked Up'
                  ? dispatchDetails[0].load.dropoff_location[0].address.line_1
                  : '',
            }
          : ''
      )
    );
    navigate('/check_call');
  };

  const handleGeoLocation = (obj) => {
    setRenderMap(true);
    loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
      var map = new Microsoft.Maps.Map(mapRef.current);
      initDirection(obj, map);
    });
  };

  function initDirection({ lat, long, wayPoints }, map) {
    console.log('wayPoints', wayPoints, 'lat', lat, 'long', long);
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function (e) {
      // Feed Details of Truck and load type and get directions
      var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(
        map
      );

      directionsManager.setRenderOptions({
        itineraryContainer: document.getElementById('printoutPanel'),
      });

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
          address: item.address.line_1,
        });

        directionsManager.addWaypoint(wp);
      });

      // Calculates directions based on waypoints
      directionsManager.calculateDirections();

      var loc = new Microsoft.Maps.Location(lat, long);
      var pin = new Microsoft.Maps.Pushpin(loc);
      map.entities.push(pin);
      // map.setView({ center: loc, zoom: 16 });
    });
  }

  const filterData = (id) => {
    return Data.filter((item) => item.id === id);
  };

  const handleEdit = (id) => {
    dispatch(
      DispatchAction.setDispatchId(
        dispatchDetails
          ? {
              id: dispatchDetails[0].id,
              status: dispatchDetails[0].status,
              data: filterData(id),
            }
          : ''
      )
    );
    navigate('/check_call');
  };

  const handleGetDriverLocation = (id) => {
    console.log('checkCall');
    if (socketDataStore) {
      socketDataStore.send(
        JSON.stringify({
          type: 'get_driver_location',
          dispatch: id,
        })
      );
    }
  };

  return (
    <div>
      <div className={`card ${style.checkCallTableDiv}`}>
        <h2>Driver Trip Start Check Call</h2>
        <table className={style.mytable}>
          <thead className={style.thead}>
            <tr>
              <td>Date</td>
              <td>Location</td>
              <td>updated By</td>
              <td>Unit No.</td>
              <td>Status</td>
              <td>Driver</td>
              <td>Geo Location</td>
              <td>Edit</td>
            </tr>
          </thead>
          <tbody className={style.tbody}>
            <tr>
              <td>
                {tripStartData[0]?.current_date_time === undefined
                  ? ''
                  : dayjs(tripStartData[0]?.current_date_time).format(
                      'YYYY-MM-DD HH:mm'
                    )}
              </td>

              <td>
                {tripStartData[0]?.city} {tripStartData[0]?.zipcode}
              </td>
              <td>{tripStartData[0]?.modified_by}</td>
              <td>{tripStartData[0]?.truck_unit_number}</td>
              <td>{tripStartData[0]?.status}</td>
              <td>
                {`${
                  tripStartData[0] === undefined
                    ? ''
                    : dispatchDetails[0]?.driver?.user?.first_name
                }  `}
                {tripStartData[0] === undefined
                  ? ''
                  : dispatchDetails[0]?.driver?.user?.last_name}
              </td>
              <td
                onClick={() => {
                  setDriverLocation({
                    lat: '',
                    long: '',
                    address: tripStartData[0]?.city,
                  });
                  handleGeoLocation({
                    lat: tripStartData[0]?.latitude,
                    long: tripStartData[0]?.longitude,
                    wayPoints: [
                      ...dispatchDetails[0].load.pickup_location,
                      ...dispatchDetails[0].load.dropoff_location,
                    ],
                    address: tripStartData[0]?.city,
                  });
                }}
              >
                <i className={`bx bxs-map-pin bx-sm ${style.map_pin}`}></i>
              </td>
              <td onClick={() => handleEdit(tripStartData[0]?.id)}>
                <i className={`bx bxs-edit ${style.editButton}`}></i>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className={`card ${style.checkCallTableDiv}`}>
        <div className={style.driverCheckCall}>
          <div>
            <h2>Status Change Updates</h2>
          </div>
          <div className={style.driverButtonMainDiv}>
            <Button
              variant="outlined"
              onClick={handleAddCheckCall}
              style={{
                display:
                  auth.role === 'DM' || auth.role === 'DISP' ? '' : 'none',
              }}
            >
              {tripStartData[0]?.status !== 'Trip Started'
                ? 'Add Check Call'
                : 'Update the status'}
            </Button>
            <Button
              variant="contained"
              className={style.contained}
              style={{ display: auth?.role !== 'D' ? '' : 'none' }}
              id="getDriverLocation"
              onClick={() =>
                handleGetDriverLocation(tripStartData[0]?.dispatch)
              }
            >
              GEt driver location
            </Button>
          </div>
        </div>
        <table className={style.mytable}>
          <thead className={style.thead}>
            <tr>
              <td>Date</td>
              <td>Location</td>
              <td>updated By</td>
              <td>Unit No.</td>
              <td>Status</td>
              <td>Driver</td>
              <td>Geo Location</td>
              <td>Edit</td>
            </tr>
          </thead>
          <tbody className={style.tbody}>
            {checkCallData.map((res, index) => {
              return (
                <tr key={index}>
                  <td>
                    {dayjs(res?.current_date_time).format('YYYY-MM-DD HH:mm')}
                  </td>
                  <td>
                    {res?.city}
                    {res?.zipcode}
                  </td>
                  <td>{res?.modified_by}</td>
                  <td>{dispatchDetails[0]?.truck?.unit_number}</td>
                  <td>{res?.status}</td>
                  <td>
                    {`${dispatchDetails[0]?.driver?.user?.first_name}  `}
                    {dispatchDetails[0]?.driver?.user?.last_name}
                  </td>
                  <td
                    onClick={() => {
                      setDriverLocation({
                        lat: '',
                        long: '',
                        address: res?.city,
                      });
                      handleGeoLocation({
                        lat: res?.latitude,
                        long: res?.longitude,
                        wayPoints: [
                          ...dispatchDetails[0].load.pickup_location,
                          ...dispatchDetails[0].load.dropoff_location,
                        ],
                        address: res?.city,
                      });
                    }}
                  >
                    <i className={`bx bxs-map-pin bx-sm ${style.map_pin}`}></i>
                  </td>
                  <td onClick={() => handleEdit(res?.id)}>
                    <i className={`bx bxs-edit ${style.editButton}`}></i>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal open={renderMap} onClose={() => setRenderMap(false)}>
        <Box>
          <div className={style.geoAddress}>
            <span>Address:</span>
            <p> {driverLocation?.address}</p>
          </div>
          <div
            ref={mapRef}
            className={`map ${style.gioMap}`}
            style={{
              display: 'block',
              zIndex: '10',
            }}
          />
        </Box>
      </Modal>
    </div>
  );
};

export default CheckCallTable;
