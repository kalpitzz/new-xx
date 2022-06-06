import React, { useState, useEffect, useRef } from 'react';
import '@mui/material';
import { Button, TablePagination, Modal, Box } from '@mui/material';
import style from '../../Loads/LoadTablePage/Loads.module.css';
import { loadBingApi, Microsoft } from '../BingMapLoader.ts';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../../hooks/useAxios';
import AlertModel from '../../../components/modals/AlertModel';
import { useDispatch, useSelector } from 'react-redux';
import DispatchAction from '../../../redux/actions/DispatchAction';
import dayjs from 'dayjs';
import useAuth from '../../../hooks/useAuth';
import csvDownload from 'json-to-csv-export';

//------------------------------------------------------------------------START THE FUCTION-----------------------------------------------------------------------
const Dispatch_table = () => {
  const statusData = [
    'All Dispatch',
    'Dispatched',
    'Arrived at Pick-Up',
    'Picked Up',
    'Arrived At Delivery',
    'Delivered',
    'Completed',
    'Cancelled',
  ];
  const { auth } = useAuth();
  const AxiosApi = useAxios();
  const [tableData, settableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [StatusHeading, setStatusHeading] = useState('All Dispatch');
  const [cancelcell, setcancelcell] = useState('none');
  const [Data, setData] = useState([]);
  const [DriverAlert, SetDriverAlert] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const closeRef = useRef();
  const alertRef = useRef();
  const [render, setrender] = useState(0);
  const Range = 20;
  // const TableData = useSelector(
  //   (state) => state.DispatchReducer.dispatchTableData
  // );

  const modifyStatus = (status) => {
    switch (status) {
      case 'trip_started':
        return 'Trip Started';
      case 'arrived_at_pick_up':
        return 'Arrived At Pick-up';
      case 'picked_up':
        return 'Picked Up';
      case 'arrived_at_delivery':
        return 'Arrived At Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      case 'completed':
        return 'Completed';
      default:
        return '';
    }
  };
  useEffect(() => {
    // if (!TableData) {
    AxiosApi('dispatch/').then((res) => {
      dispatch(DispatchAction.setdispatchTableData(res));
      console.log('res', res);
      setData(res);
      settableData(res);
      setrender(1);
    });
    // }
    // else {
    //   setrender(1);
    //   setData(TableData);
    //   settableData(TableData);
    // }
  }, []);

  //----------------------------------------------------------------------------Navigation--------------------------------------------------------
  const handleNavigation = (e) => {
    navigate('dispatchsummary', { state: e });
  };
  //----------------------------------------------------------------------------Pagination----------------------------------------------------------
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // const searchRes = tableData.filter((data) => {
  //   console.log(Object.values(data.status).join("").includes("Rejected"));
  //   return Object.values(data.status).join("").includes("Rejected");
  // });
  // console.log(searchRes);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  //--------------------------------------------------------------------Search Filter------------------------------------------------------------
  const searchHandle = (event) => {
    if (event === 'All Dispatch') {
      return <>{setData(tableData)}</>;
    }
    const searchData = tableData.filter((word) => {
      return Object.values(word.load)
        .join(' ')
        .toLowerCase()
        .includes(event.toLowerCase());
    });
    setData(searchData);
  };

  //------------------------------------------------------------------Status filter---------------------------------------------------------------
  const handleStatusFilter = (e) => {
    if (e === 'All Dispatch') {
      return <>{(setData(tableData), handlebuttonfilter(e))}</>;
    }

    const FilterData = tableData.filter((word) => {
      return word.status.toLowerCase() === e.toLowerCase();
    });

    setData(FilterData);
    setPage(0);
    handlebuttonfilter(e);
  };

  //--------------------------------------------------------------------------show the option for status filter------------------------------------------------------------
  const StatusFilter = () => {
    return (
      <select
        onChange={(e) => handleStatusFilter(e.target.value)}
        className={style.statusFilter}
      >
        {statusData.map((data, index) => {
          return (
            <option
              key={index}
              value={data}
              style={{
                display: `${
                  (auth.role === 'CO' && data === 'Draft') ||
                  (auth.role === 'D' && data === 'Draft')
                    ? 'none'
                    : ''
                }`,
              }}
            >
              {data}
            </option>
          );
        })}
      </select>
    );
  };

  // ------------------------------------------------------------------------show the reason and accept/reject button----------------------------------------------------
  const handlebuttonfilter = (e) => {
    console.log(e);
    setStatusHeading(e);
    if (e === 'Cancelled') {
      setcancelcell('');
    } else if (
      e === 'All Dispatched' ||
      e === 'Arrived At Pick-Up' ||
      e === 'Picked Up' ||
      e === 'Arrived At Delivery' ||
      e === 'Delivered'
    ) {
      setcancelcell('none');
    }
  };

  //--------------------------------------------------------------------------------HANDLE EXPORT DATA-------------------------------------------------------

  const exportData = async (tableData) => {
    const Data = [];
    await tableData.map((res, index) => {
      Data.push({
        'Date/Time': dayjs(res?.loda?.creation_datetime).format(
          'YYYY-MM-DD HH:mm'
        ),
        'Load No': `${res?.dispatch_no}/${res?.load?.load_no}`,
        'Dispatch Status': res?.status,
        'Carrier Name': res?.load?.carrier_name,
        'Pickup Location': res?.load?.pickup_location[0]?.address?.line_1,
        'Dropoff Location':
          res?.load?.dropoff_location[res?.load?.dropoff_location.length - 1]
            ?.address?.line_1,
        'Total Mile': res?.load?.total_mile,
      });
    });
    csvDownload(Data);
  };

  const handle_geo_checkcall = (obj) => {
    console.log('Obj', obj);
    let api_object = {
      dispatch: obj?.id,
      status: obj?.status,
      latitude: '',
      longitude: '',
      city: '',
      zip_code: '',
      address: '',
      current_date_time: dayjs(new Date()).format(),
    };
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log('position', position);
      api_object.latitude = position?.coords?.latitude;
      api_object.longitude = position?.coords?.longitude;
      loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
        var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {});
        Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
          var searchManager = new Microsoft.Maps.Search.SearchManager(map);
          var reverseGeocodeRequestOptions = {
            location: new Microsoft.Maps.Location(
              position?.coords?.latitude,
              position?.coords?.longitude
            ),
            callback: function (answer) {
              api_object.city = answer?.address?.locality;
              api_object.zip_code = answer?.address?.postalCode;
              api_object.address = answer?.address?.formattedAddress;
              console.log('Api', api_object);
              if (obj.wayPoints) {
                obj.wayPoints.push({
                  address: { line_1: answer?.address?.formattedAddress },
                });

                initDirection(obj, map, api_object);
              } else {
                AxiosApi.post(
                  `dispatch/checkcall/?dispatch_id=${obj?.id}`,
                  api_object
                ).then((res) => {
                  dispatch(
                    DispatchAction.changeStatusDispatchTableData({
                      id: obj?.id,
                      status: res?.status,
                    })
                  );
                  alertRef.current.showModel();
                });
              }
            },
          };
          searchManager.reverseGeocode(reverseGeocodeRequestOptions);
        });
      });
    });
  };

  function initDirection({ id, status, wayPoints }, map, api_object) {
    console.log('wayPoints', wayPoints, 'id', id, 'status', status);
    Microsoft.Maps.loadModule('Microsoft.Maps.Directions', function (e) {
      // Feed Details of Truck and load type and get directions
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
          address: item.address.line_1,
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
          SetDriverAlert(true);
        } else {
          alert('CheckCall Created!');
          setData((prev) =>
            prev.map((item) =>
              item.id === id ? { ...item, status: modifyStatus(status) } : item
            )
          );
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

  return (
    <>
      <div className={style.buttonfilter}>
        <div>
          {statusData.map((data, index) => (
            <button
              value={data}
              key={index}
              onClick={(e) => handleStatusFilter(e.target.value)}
              style={{
                display: `${
                  (auth?.role === 'CO' && data === 'Draft') ||
                  (auth?.role === 'D' && data === 'Draft')
                    ? 'none'
                    : ''
                }`,
              }}
            >
              {data}
            </button>
          ))}
        </div>
      </div>
      <p className={style.statusheading}>{StatusHeading}</p>

      <div className={style.buttonDiv}>
        <Button
          variant="contained"
          style={{ margin: '0 1rem' }}
          onClick={() => exportData(tableData)}
        >
          Export
        </Button>
      </div>

      <input
        placeholder="Search"
        type="search"
        className={style.searchInput}
        onChange={(e) => {
          searchHandle(e.target.value);
        }}
      />
      {/* ----------------------------------------------------------------------------render the data -------------------------- */}
      <div>
        {render ? (
          <table id="loadTable" className={style.mytable}>
            <thead
              sx={{ margin: '0px', padding: '0px' }}
              className={style.thead}
            >
              <tr>
                <td>DATE/TIME</td>
                <td>DISPATCH/LOAD NO</td>
                <td> STATUS{StatusFilter()}</td>
                <td>CARRIER</td>
                <td>PICKUP</td>
                <td>DELIVERY</td>
                <td>MILES</td>
                <td className={cancelcell === 'none' ? style.rightradius : ''}>
                  DISPATCH
                </td>
                <td style={{ display: cancelcell }}>Reason</td>
              </tr>
            </thead>
            <tbody className={style.tbody}>
              {Data.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).map((data, index) => {
                return (
                  <React.Fragment key={index}>
                    <tr key={index} className={style.datatr}>
                      <td
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        {data.date}
                        {dayjs(data?.load?.creation_datetime).format(
                          'YYYY-MM-DD HH:mm'
                        )}
                        <br />
                        {data.time}
                      </td>

                      <td
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        {data?.dispatch_no}
                        <br />/{data?.load?.load_no}
                      </td>

                      <td
                        sx={{ paddingLeft: '0px' }}
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        <p
                          id={style.status}
                          className={
                            data.status.toLowerCase() === 'completed'
                              ? style.avail
                              : data.status.toLowerCase() === 'dispatched'
                              ? style.dispatch
                              : data.status.toLowerCase() === 'trip started'
                              ? style.dispatch
                              : data.status.toLowerCase() === 'picked up'
                              ? style.picked_up
                              : data.status.toLowerCase() ===
                                'arrived at pick-up'
                              ? style.arrived_at_pick_up
                              : data.status.toLowerCase() ===
                                'arrived at delivery'
                              ? style.arrived_at_delivery
                              : data.status.toLowerCase() === 'delivered'
                              ? style.delivered
                              : data.status.toLowerCase() === 'cancelled'
                              ? style.cancel
                              : ''
                          }
                        >
                          {data?.status === 'Trip Started'
                            ? 'Dispatched'
                            : data?.status}
                        </p>
                      </td>
                      <td
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        {data?.load?.carrier_name}
                      </td>
                      <td
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        {data?.load?.pickup_location[0]?.address?.city}
                        <br />
                        {data?.load?.pickup_location[0]?.address?.zipcode}
                      </td>
                      <td
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        {data?.load?.dropoff_location[0]?.address?.city}
                        <br />
                        {data?.load?.dropoff_location[0]?.address?.zipcode}
                      </td>
                      <td
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        {data?.load?.total_mile}
                      </td>

                      {/* -------------------------------------------------------comment view details ----------------- */}
                      <td
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        <Button
                          value={data.id}
                          style={{
                            display: `${data.status !== 'draft' ? '' : 'none'}`,
                          }}
                        >
                          {`${
                            data.status === 'accepted'
                              ? '+ Create Dispatch'
                              : 'View Dispatch'
                          }`}
                        </Button>
                      </td>

                      <td
                        style={{ display: cancelcell }}
                        onClick={() => {
                          handleNavigation(data.id);
                        }}
                      >
                        <p>{data?.status_reason}</p>
                      </td>
                    </tr>

                    <tr
                      className={style.buttonTr}
                      style={{ display: auth?.role === 'D' ? '' : 'none' }}
                    >
                      <td
                        style={{
                          display: data?.status === 'Dispatched' ? '' : 'none',
                        }}
                      >
                        <AlertModel
                          type={'Start Trip'}
                          title={`Check Call Successfully Created..`}
                          button1="Close"
                          button2="Okay!"
                          typeoff="button"
                          ref={alertRef}
                          handleClick={() =>
                            handle_geo_checkcall({
                              id: data?.id,
                              status: 'trip_started',
                            })
                          }
                          handleOkay={() => console.log('Saved')}
                          navigateTo={'#'}
                        />
                      </td>
                      <td
                        style={{
                          display:
                            data?.status === 'Trip Started' ? '' : 'none',
                        }}
                      >
                        <AlertModel
                          type={'Arrived At Pick-Up'}
                          title={`Check Call Successfully Created..`}
                          button1="Close"
                          button2="Okay!"
                          typeoff="button"
                          ref={alertRef}
                          handleClick={() =>
                            handle_geo_checkcall({
                              id: data?.id,
                              status: 'arrived_at_pick_up',
                              wayPoints: [...data.load.pickup_location],
                            })
                          }
                          handleOkay={() => console.log('Saved')}
                          navigateTo={'#'}
                        />
                      </td>
                      <td
                        style={{
                          display:
                            data?.status === 'Arrived At Pick-up' ? '' : 'none',
                        }}
                      >
                        <AlertModel
                          type={'Picked Up'}
                          title={`Check Call Successfully Created..`}
                          button1="Close"
                          button2="Okay!"
                          typeoff="button"
                          ref={alertRef}
                          handleClick={() =>
                            handle_geo_checkcall({
                              id: data?.id,
                              status: 'picked_up',
                            })
                          }
                          handleOkay={() => console.log('Saved')}
                          navigateTo={'#'}
                        />
                      </td>
                      <td
                        style={{
                          display: data?.status === 'Picked Up' ? '' : 'none',
                        }}
                      >
                        <AlertModel
                          type={'Arrived At Delivery'}
                          title={`Check Call Successfully Created..`}
                          button1="Close"
                          button2="Okay!"
                          typeoff="button"
                          ref={alertRef}
                          handleClick={() =>
                            handle_geo_checkcall({
                              id: data?.id,
                              status: 'arrived_at_delivery',
                              wayPoints: [...data.load.dropoff_location],
                            })
                          }
                          handleOkay={() => console.log('Saved')}
                          navigateTo={'#'}
                        />
                      </td>
                      <td
                        style={{
                          display:
                            data?.status === 'Arrived At Delivery'
                              ? ''
                              : 'none',
                        }}
                      >
                        <AlertModel
                          type={'Delivered'}
                          title={`Check Call Successfully Created..`}
                          button1="Close"
                          button2="Okay!"
                          typeoff="button"
                          ref={alertRef}
                          handleClick={() =>
                            handle_geo_checkcall({
                              id: data?.id,
                              status: 'delivered',
                            })
                          }
                          handleOkay={() => console.log('Saved')}
                          navigateTo={'#'}
                        />
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })}
              <TablePagination
                className={style.paginationForMobile}
                rowsPerPageOptions={[10]}
                component="tr"
                count={Data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </tbody>
          </table>
        ) : (
          'Loading The  Dispatch'
        )}
      </div>
      <div id="myMap"></div>
      <div id="printoutPanel"></div>

      {/* -------------------------------------------------------TABLE PAGINATION------------------------------------------------------- */}
      <TablePagination
        className={style.paginationForDesktop}
        rowsPerPageOptions={[10, 15, 25, 50]}
        component="div"
        count={Data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Modal open={DriverAlert} onClose={() => SetDriverAlert(false)}>
        <Box className={style.driverAlertWrap}>
          <h4>CheckCall Not Created!</h4>
          <div className={style.driverAlertTextWrap}>
            <p>You are not in desired Location Range</p>
            <p>Kindly contact your Dispatcher.</p>
          </div>
          <div className={style.driverAlertClose}>
            <button onClick={() => SetDriverAlert(false)}>Close</button>
          </div>
        </Box>
      </Modal>
    </>
  );
};
export default Dispatch_table;
