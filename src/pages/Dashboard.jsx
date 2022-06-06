//------------------------------------------------------------Import the library--------------------------------------------

import React, { useState, useEffect, useRef } from "react";
import useAuth from "../hooks/useAuth";
import useAxios from "../hooks/useAxios";
import style from "./Dashboard.module.css";
import DriverCheckCall from "./Dispatch/DriverCheckCall/DriverCheckCall";
import { Modal, Box } from "@mui/material";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import FormikControl from "../components/Formfield/formikControl";
import { loadBingApi, Microsoft } from "./Dispatch/BingMapLoader.ts";
import ConfirmModel from "../components/modals/ConfirmModal";
import WebSocketAction from "../redux/actions/webSocketAction";
import { useNavigate } from "react-router-dom";
import usePagination from "../components/Pagination/pagination";
import { Pagination } from "@material-ui/lab";
// -------------------------------------------------------------use to display the route status-------------------------------------
const statusBar = () => {
  return (
    <div className={style.statusBarMainDiv}>
      <div className={`${style.span} ${style.firstSpan} `}>
        <span>Start Trip</span>
      </div>
      <div className={style.span}>
        <span> At Pick-Up</span>
      </div>
      <div className={style.span}>
        <span>Picked-Up</span>
      </div>
      <div className={style.span}>
        <span> At Delivery</span>
      </div>
      <div className={style.span}>
        <span>Delivered</span>
      </div>
    </div>
  );
};
// -----------------------------------------------------------------------------Main function start from here--------------------------------
function Dashboard() {
  const [Data, setData] = useState([{ check_calls: [{}] }]);
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;
  const [sosPopUp, setSosPopUp] = useState(false);
  const [success, setSuccess] = useState(false);
  const [route, setRoute] = useState({ path: [], dispatchID: "" });
  const [dispatch_ID, setDispatch_ID] = useState("");
  const [driverRoute, setDriverRoute] = useState([]);
  const [openContactDriver, setOpenContactDriver] = useState(false);
  const [sosList, setSosList] = useState([]);
  const [renderMap, setRenderMap] = useState(false);
  const [driverLocation, setDriverLocation] = useState({
    address: "",
    lat: "",
    long: "",
  });
  const [resolveMessage, setResolveMessage] = useState("");

  const socketDataStore = useSelector((state) => state.DispatchReducer.socket);
  const sosStatusData = useSelector(
    (state) => state.WebSocketReducer.sos_status_data
  );
  const sosResolveData = useSelector(
    (state) => state.WebSocketReducer.resolve_message
  );
  console.log("SosResolve", sosResolveData, "Data", Data);
  const current_driver_location = useSelector(
    (state) => state.WebSocketReducer.current_driver_location
  );
  const { auth } = useAuth();
  const Auth = useAuth();
  const user = Auth?.auth?.user;
  const closeref = useRef();
  const AxiosApi = useAxios();
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const User = JSON.parse(localStorage.getItem("user"));
  const count = Math.ceil(Data.length / PER_PAGE);

  // --------------------------------------------------call the dashbord data-----------------------------------------------------
  useEffect(() => {
    AxiosApi("dispatch/dashboard/").then((res) => {
      console.log("dashboard data during api call", res);
      setData(res);
    });

    return () => {
      dispatch(WebSocketAction.setSocketDriverLocation(""));
      dispatch(WebSocketAction.resoleSos(""));
    };
  }, []);
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
    if (sosResolveData) {
      setData((prevData) =>
        prevData.map((item) =>
          item.dispatch_id === sosResolveData?.message?.dispatch
            ? { ...item, driver_alert: false }
            : item
        )
      );
    }
  }, [sosResolveData]);
  useEffect(() => {
    if (sosStatusData) {
      setDriverLocation({
        address: sosStatusData?.message?.address,
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.dispatch_id === sosStatusData?.message?.dispatch
            ? { ...item, driver_alert: sosStatusData?.message?.driver_alert }
            : item
        )
      );
    }
  }, [sosStatusData]);

  const isMounted = useRef(false);
  const mapRef = useRef();

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);
  useEffect(() => {
    if (route?.dispatchID) {
      handleContactDriver(route.dispatchID);
    }
  }, [route]);
  useEffect(() => {
    if (dispatch_ID) {
      setSosPopUp(true);
    }
  }, [dispatch_ID]);

  useEffect(() => {
    if (driverLocation?.lat) {
      handleGeoLocation({
        lat: driverLocation?.lat,
        long: driverLocation?.long,
        wayPoints: driverRoute,
      });
    }
  }, [driverLocation]);

  const handleContactDriver = (dispatchID) => {
    AxiosApi(`dispatch/sos/get_dispatch_sos/?dispatch_id=${dispatchID}`)
      .then((res) => {
        setSosList(res);
      })
      .then(() => setOpenContactDriver(true));
  };

  const handleGetDriverLocation = (id) => {
    console.log("Sent");
    if (socketDataStore) {
      socketDataStore.send(
        JSON.stringify({
          type: "get_driver_location",
          dispatch: id,
        })
      );
    }
  };
  // --------------------------------------------------------------function is used to create the sos by driver---------------------------
  const handleSOS = (values) => {
    let obj = {
      driver: user.id,
      reason: values.reason,
      driver_phone_number: user.phone,
      driver_alert: true,
      resolved: false,
      longitude: null,
      latitude: null,
      address: "",
      dispatch: dispatch_ID,
    };
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("position", position);
      obj.latitude = position?.coords?.latitude;
      obj.longitude = position?.coords?.longitude;
      loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
        var map = new Microsoft.Maps.Map(mapRef.current);
        Microsoft.Maps.loadModule("Microsoft.Maps.Search", function () {
          var searchManager = new Microsoft.Maps.Search.SearchManager(map);
          var reverseGeocodeRequestOptions = {
            location: new Microsoft.Maps.Location(
              position?.coords?.latitude,
              position?.coords?.longitude
            ),
            callback: function (answer) {
              obj.address = answer?.address?.formattedAddress;
              AxiosApi.post("dispatch/sos/", obj).then((res) => {
                setSuccess(true);
                setData((prevData) =>
                  prevData.map((item) => {
                    return item.dispatch_id === obj?.dispatch
                      ? { ...item, sos: [res], driver_alert: true }
                      : item;
                  })
                );
              });
            },
          };
          searchManager.reverseGeocode(reverseGeocodeRequestOptions);
        });
      });
    });
  };

  const handleGeoLocation = (obj) => {
    setRenderMap(true);
    loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
      var map = new Microsoft.Maps.Map(mapRef.current);
      initDirection(obj, map);
    });
  };
  // -------------------------------------------------------function is used to resolved the sos and the status driver alert fron true to false-------------------------------
  const handleResolved = ({ sosID, dispatchID }) => {
    AxiosApi.patch(`dispatch/sos/${sosID}/`, {
      resolved: true,
      resolved_message: resolveMessage,
    }).then(() => {
      setData((prevData) =>
        prevData.map((item) =>
          item.dispatch_id === dispatchID
            ? { ...item, driver_alert: false }
            : item
        )
      );
      setOpenContactDriver(false);
    });
  };

  function initDirection({ lat, long, wayPoints }, map) {
    console.log("wayPoints", wayPoints);
    Microsoft.Maps.loadModule("Microsoft.Maps.Directions", function (e) {
      // Feed Details of Truck and load type and get directions
      var directionsManager = new Microsoft.Maps.Directions.DirectionsManager(
        map
      );
      directionsManager.setRenderOptions({
        itineraryContainer: document.getElementById("printoutPanel"),
      });
      directionsManager.setRequestOptions({
        // routeMode : driving/truck/transit/walking
        routeMode: Microsoft.Maps.Directions.RouteMode.truck,

        vehicleSpec: {
          dimensionUnit: "ft",
          weightUnit: "lb",
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
          vehicleHazardousMaterials: "F",
          vehicleHazardousPermits: "F",
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
  // --------------------------------------------------------function is used to cancel the sos by driver---------------------------
  const handleSosCancel = (sosId, dispatchId) => {
    console.log(sosId, dispatchId);
    AxiosApi.delete(`dispatch/sos/${sosId}/`).then((res) => {
      closeref.current.closeModel();
      setData((prevData) =>
        prevData.map((item) =>
          item.dispatch_id === dispatchId
            ? { ...item, driver_alert: false }
            : item
        )
      );
      
    });
  };

  const data = usePagination(Data, PER_PAGE);
  const handlePageChange = (e, p) => {
    setPage(p);
    data.jump(p);
  };
  return (
    <>
      <div ref={mapRef} className="map" />
      <button
        style={{
          backgroundColor: "azure",
          padding: "1rem 2rem",
          fontSize: "1rem",
        }}
        onClick={() => navigate("/fetchLocation")}
      >
        Redirect to Test Page
      </button>
      <div className={style.dashboardHeading}>
        Dashboard
        {auth?.role === "DM"
          ? ` For Dispatch Manager: ${User?.first_name}`
          : auth?.role === "DISP"
          ? ` For Dispatcher: ${User?.first_name}`
          : auth?.role === "CO"
          ? ` For Carrier Owner: ${User?.first_name}`
          : auth?.role === "D"
          ? ` For Driver: ${User?.first_name}`
          : auth?.role === "B"
          ? ` For Broker: ${User?.first_name}`
          : ""}
      </div>
      {/* -------------------------------------------------------DASHBOARD VIEW WITH GRID FOR DESKTOP-------------------------------- */}
      <div
        className={`${style.headerDiv} ${
          auth?.role === "D" ? style.grideight : style.gridseven
        }`}
      >
        <div className={style.center}>
          {auth.role === "DISP" || auth?.role === "D" || auth.role === "B"
            ? "Carrier"
            : auth?.role === "CO"
            ? "Driver"
            : "Dispatcher"}
        </div>
        <div className={style.center}>
          {auth?.role === "DISP"
            ? "Driver"
            : auth?.role === "CO"
            ? "Dispatcher"
            : auth?.role === "B"
            ? "Dispatcher"
            : auth?.role === "D"
            ? "Carrier Number"
            : "Carrier"}
        </div>
        <div className={style.center}>
          {auth?.role === "DISP"
            ? "Driver Number"
            : auth?.role === "CO" || auth?.role === "B"
            ? "Dispatcher Number"
            : auth?.role === "D"
            ? "Dispatcher"
            : "Driver"}
        </div>
        <div className={style.center}>
          {auth?.role === "D" ? "Dispatcher Number" : "Equipment Type"}
        </div>

        <div className={style.center}>{statusBar()}</div>

        <div className={style.center}>
          {auth.role === "D" ? "" : "Current Driver Location"}
        </div>

        {auth.role !== "B" ? (
          <div
            className={style.driverAlert}
            style={{ textAlign: "center" }}
          >{` ${
            auth?.role !== "D" ? "Alert From Driver" : "Create Alert"
          }`}</div>
        ) : (
          <div
            className={style.driverAlert}
            style={{ background: "transparent" }}
          ></div>
        )}
        <div
          className={style.center}
          style={{ display: auth?.role === "D" ? "" : "none" }}
        >
          {auth.role === "D" ? "Cancel SoS" : ""}
        </div>

        {data.currentData().map((res, index) => {
          return (
            <React.Fragment key={index}>
              <div className={`${style.dataBody}  ${style.leftBorderRadius}`}>
                {auth.role === "DM"
                  ? res?.dispatcher_name
                  : auth?.role === "DISP" ||
                    auth?.role === "D" ||
                    auth?.role === "B"
                  ? res?.carrier_name
                  : res?.driver_name}
              </div>
              <div className={style.dataBody}>
                {auth.role === "DM"
                  ? res?.carrier_name
                  : auth?.role === "DISP"
                  ? res?.driver_name
                  : auth?.role === "D"
                  ? res?.carrier_phone_number
                  : res?.dispatcher_name}
              </div>
              <div className={style.dataBody}>
                {auth?.role === "DM"
                  ? res?.driver_name
                  : auth?.role === "DISP"
                  ? res?.driver_phone
                  : auth?.role === "D"
                  ? res?.dispatcher_name
                  : res?.dispatcher_phone_number}
              </div>
              <div className={style.dataBody}>
                {auth?.role === "D"
                  ? res?.dispatcher_phone_number
                  : res?.trailer_type}
              </div>

              <div className={style.dataBody}>
                {
                  <DriverCheckCall
                    name="dashboard"
                    data={res?.check_calls}
                    dispatchData={[{ load: res?.load }]}
                  />
                }
              </div>
              <div
                className={style.dataBody}
                style={{
                  alignItems: "center",
                  display: "flex",
                  width: "100%",
                  justifyContent: "center",
                }}
              >
                {auth.role !== "D" ? (
                  <button
                    // value={[res?.load?.dispatch?.id, res?.load?.status]}
                    className={style.addCheckCall}
                    onClick={() => {
                      handleGetDriverLocation(res?.dispatch_id);
                      setDriverRoute([
                        ...res?.load?.pickup_location,
                        ...res?.load?.dropoff_location,
                      ]);
                    }}
                    style={{
                      display: auth.role !== "D" ? "" : "none",
                    }}
                  >
                    Check Now
                  </button>
                ) : (
                  " "
                )}
              </div>
              <div
                className={`${style.dataBody}  ${
                  auth?.role !== "D" ? style.rightBorderRadius : ""
                } `}
              >
                {auth.role !== "B" && (
                  <button
                    className={style.sosButtonForDashboard}
                    style={{
                      backgroundColor:
                        res?.driver_alert === true ? "red" : "green",
                      display: auth.role !== "D" ? "" : "none",
                    }}
                    onClick={() => {
                      if (res?.driver_alert) {
                        setRoute({
                          path: [
                            ...res?.load?.pickup_location,
                            ...res?.load?.dropoff_location,
                          ],
                          dispatchID: res?.dispatch_id,
                        });
                      }
                    }}
                  >
                    {res?.driver_alert === true ? "SoS" : "All Okay"}
                  </button>
                )}
                {auth.role === "D" && (
                  <button
                    className={style.sosButton}
                    style={{
                      display: auth.role === "D" ? "" : "none",
                      backgroundColor:
                        res?.driver_alert === false ? "red" : "gray",
                    }}
                    onClick={() => {
                      setDispatch_ID(res?.dispatch_id);
                    }}
                    disabled={res?.driver_alert === false ? false : true}
                  >
                    {`${res?.driver_alert === false ? "SoS" : "SoS Raised"}`}
                  </button>
                )}
              </div>
              <div
                className={`${style.dataBody}  ${
                  auth?.role === "D" ? style.rightBorderRadius : ""
                } `}
                style={{ display: auth?.role === "D" ? "" : "none" }}
              >
                <ConfirmModel
                  title="Are you sure you want to cancel sos"
                  type="Cancel"
                  className={style.sosButton}
                  style={{
                    display: auth.role === "D" ? "" : "none",
                    backgroundColor:
                      res?.driver_alert === false ? "gray" : "red",
                  }}
                  button1="Yes"
                  handleYes={() =>
                    handleSosCancel(res?.sos[0]?.id, res?.dispatch_id)
                  }
                  button2="No"
                  disabled={res?.driver_alert === true ? false : true}
                  ref={closeref}
                />
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* --------------------------------------------------for Mobile-------------------------------------------------- */}
      <div className={style.mobileViewDisplay}>
        {Data.map((res, index) => {
          return (
            <React.Fragment key={index}>
              <div className={style.card} key={index}>
                <div className={style.detailsMainDiv}>
                  <div className={style.dataHeading}>
                    {auth.role === "DISP" ||
                    auth?.role === "B" ||
                    auth?.role === "D"
                      ? "Carrier:"
                      : auth?.role === "CO"
                      ? "Driver:"
                      : "Dispatcher:"}
                  </div>
                  <div>
                    {auth.role === "DM"
                      ? res?.dispatcher_name
                      : auth?.role === "DISP" ||
                        auth?.role === "B" ||
                        auth?.role === "D"
                      ? res?.carrier_name
                      : res?.driver_name}
                  </div>

                  <div className={style.dataHeading}>
                    {auth?.role === "DISP"
                      ? "Driver:"
                      : auth?.role === "CO"
                      ? "Dispatcher:"
                      : auth?.role === "B"
                      ? "Dispatcher:"
                      : auth?.role === "D"
                      ? "Carrier Number:"
                      : "Carrier:"}
                  </div>
                  <div>
                    {auth.role === "DM"
                      ? res?.carrier_name
                      : auth?.role === "DISP"
                      ? res?.driver_name
                      : auth?.role === "D"
                      ? res?.carrier_phone_number
                      : res?.dispatcher_name}
                  </div>

                  <div className={style.dataHeading}>
                    {auth?.role === "DISP"
                      ? "Driver Number:"
                      : auth?.role === "CO"
                      ? "Dispatcher Number:"
                      : auth?.role === "D"
                      ? "Dispatcher:"
                      : "Driver:"}
                  </div>
                  <div>
                    {auth?.role === "DM"
                      ? res?.driver_name
                      : auth?.role === "DISP"
                      ? res?.driver_phone
                      : auth?.role === "B"
                      ? res?.driver_name
                      : auth?.role === "D"
                      ? res?.dispatcher_name
                      : res?.dispatcher_phone_number}
                  </div>

                  <div className={style.dataHeading}>
                    {auth?.role === "D"
                      ? "Dispatcher Number:"
                      : `Equipment Type:`}
                  </div>
                  <div>
                    {auth?.role === "D"
                      ? res?.dispatcher_phone_number
                      : res?.trailer_type}
                  </div>
                </div>
                <div className={`${style.routeDetails} ${style.card}`}>
                  <div className={style.routeStatus}>
                    <p>Start Trip</p>
                    <p> At Pick Up</p>
                    <p>Picked-up </p>
                    <p>At Delivery</p>
                    <p>Delivered</p>
                  </div>
                  <DriverCheckCall
                    name="dashboard"
                    data={res?.check_calls}
                    dispatchData={[{ load: res?.load }]}
                  />
                </div>
                <div className={style.flex}>
                  <div
                    className={style.label}
                    style={{ display: auth?.role !== "D" ? "" : "none" }}
                  >
                    Current Driver Location:
                  </div>
                  {auth.role !== "D" ? (
                    <button
                      value={[res?.load?.dispatch?.id, res?.load?.status]}
                      className={style.sosButtonForDashboard}
                      onClick={() => {
                        handleGetDriverLocation(res?.dispatch_id);
                        setDriverRoute([
                          ...res?.load?.pickup_location,
                          ...res?.load?.dropoff_location,
                        ]);
                      }}
                      style={{
                        backgroundColor: "#ffc000",
                        display: auth.role !== "D" ? "" : "none",
                      }}
                    >
                      Check Now!
                    </button>
                  ) : (
                    ""
                  )}
                </div>
                <div className={style.flex}>
                  <div
                    style={{ display: auth?.role !== "B" ? "" : "none" }}
                    className={style.label}
                  >
                    {`${
                      auth?.role !== "D" ? `Alert From Driver:` : "Create Alert"
                    }`}
                  </div>
                  {auth.role !== "B" && (
                    <button
                      className={style.sosButtonForDashboard}
                      style={{
                        backgroundColor:
                          res?.driver_alert === true ? "red" : "green",
                        display: auth.role !== "D" ? "" : "none",
                      }}
                      onClick={() => {
                        if (res?.driver_alert) {
                          setRoute({
                            path: [
                              ...res?.load?.pickup_location,
                              ...res?.load?.dropoff_location,
                            ],
                            dispatchID: res?.dispatch_id,
                          });
                        }
                      }}
                    >
                      {res?.driver_alert === true ? "SOS" : "All Okay"}
                    </button>
                  )}

                  {auth.role === "D" && (
                    <button
                      className={style.sosButton}
                      style={{
                        display: auth.role === "D" ? "" : "none",
                        backgroundColor:
                          res?.driver_alert === false ? "red" : "gray",
                      }}
                      onClick={() => {
                        setDispatch_ID(res.dispatch_id);
                      }}
                      disabled={res?.driver_alert === false ? false : true}
                    >
                      {`${res?.driver_alert === false ? "SoS" : "SoS Raised"}`}
                    </button>
                  )}
                </div>

                <div className={style.flex}>
                  <div
                    style={{ display: auth?.role === "D" ? "" : "none" }}
                    className={style.label}
                  >
                    Cancel SoS:
                  </div>
                  <ConfirmModel
                    title="Are you sure you want to cancel sos"
                    type="Cancel"
                    className={style.sosButton}
                    style={{
                      display: auth.role === "D" ? "" : "none",
                      backgroundColor:
                        res?.driver_alert === false ? "gray" : "red",
                      marginTop: "10px",
                    }}
                    button1="Yes"
                    handleYes={() =>
                      handleSosCancel(res?.sos[0]?.id, res?.dispatch_id)
                    }
                    button2="No"
                    disabled={res?.driver_alert === true ? false : true}
                    ref={closeref}
                  />
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className={style.pagination}>
        <Pagination
          count={count}
          size="medium"
          page={page}
          variant="text"
          shape="rounded"
          onChange={handlePageChange}
        />
      </div>
      {/* -----------show the pop message to the other user when driver create the sos with driver message and driver location --------- */}
      <Modal
        open={openContactDriver}
        onClose={() => setOpenContactDriver(false)}
      >
        <Box className={style.sosPopUpContactDriver}>
          {sosList.map((item, index) => (
            <div key={index}>
              <h2 className={style.titleHead}>SOS</h2>
              <div className={style.heading}>
                <h2>Contact Driver Now!</h2>
              </div>
              <div className={style.wrapSos}>
                <div className={style.sosPopContactDriverWrap}>
                  <p className={style.sosPopContactDriverLabel}>
                    Driver Message:
                  </p>
                  <p className={style.messageSos}>{item.reason}</p>
                </div>
                <div className={style.sosPopContactDriverWrap}>
                  <label className={style.sosPopContactDriverLabel}>
                    Driver Phone:
                  </label>
                  <p className={style.phoneSos}>{item?.driver_phone_number}</p>
                </div>
                <div className={style.sosPopContactDriverWrap}>
                  <label className={style.sosPopContactDriverLabel}>
                    Owner Phone:
                  </label>
                  <p className={style.phoneSos}>{item?.owner_phone_number}</p>
                </div>
                <div className={style.sosPopContactDriverWrap}>
                  <div className={style.sosPopContactDriverLabel}>
                    Driver Location:
                  </div>

                  <button
                    className={style.geoSosButton}
                    onClick={() =>
                      handleGeoLocation({
                        lat: item?.latitude,
                        long: item?.longitude,
                        wayPoints: route.path,
                      })
                    }
                  >
                    <i className={`bx bxs-map-pin bx-sm ${style.map_pin}`}></i>
                    {item?.address}
                  </button>
                </div>
                <div className={style.sosPopContactDriverWrap}>
                  <div className={style.sosPopContactDriverLabel}>
                    Resolve Message:
                  </div>

                  <textarea
                    rows={4}
                    cols={143}
                    className={style.textedArea}
                    onChange={(e) => setResolveMessage(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className={style.buttonWrapSos}>
                  <button
                    className={style.sosButtons}
                    onClick={() =>
                      handleResolved({
                        sosID: item?.id,
                        dispatchID: item?.dispatch,
                      })
                    }
                  >
                    Resolved
                  </button>
                  <button
                    className={style.sosButtons}
                    onClick={() => setOpenContactDriver(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Box>
      </Modal>

      <Modal open={renderMap} onClose={() => setRenderMap(false)}>
        <Box>
          <div className={style.geoAddress}>
            <span>Address:</span>
            <p>{driverLocation?.address}</p>
          </div>
          <div
            ref={mapRef}
            className={`map ${style.gioMap}`}
            style={{
              display: "block",
              zIndex: "10",
            }}
          />
        </Box>
      </Modal>
      <Formik
        initialValues={{ reason: "" }}
        validationSchema={Yup.object().shape({
          reason: Yup.string().required("Required"),
        })}
        onSubmit={(values) => {
          setDispatch_ID("");
          handleSOS(values);
        }}
      >
        {(formik) => (
          <Modal
            open={sosPopUp}
            onClose={() => {
              formik.resetForm();
              setSosPopUp(false);
              setSuccess(false);
              setDispatch_ID("");
            }}
          >
            <Box className={style.sosPopUp}>
              <Form>
                {success ? (
                  <h3>Successfull !!</h3>
                ) : (
                  <FormikControl
                    control="textarea"
                    label="Reason for raising 'SOS'*"
                    name="reason"
                  />
                )}

                <div className={style.sosButtonWrap}>
                  {success ? (
                    <button
                      onClick={() => {
                        formik.resetForm();
                        setSosPopUp(false);
                        setSuccess(false);
                      }}
                      className={style.blueButton}
                      type="button"
                    >
                      Close
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        formik.resetForm();
                        setSosPopUp(false);
                        setDispatch_ID("");
                      }}
                      className={style.whiteButton}
                      type="button"
                    >
                      Cancel
                    </button>
                  )}
                  {success ? null : (
                    <button type="submit" className={style.blueButton}>
                      Send Alert
                    </button>
                  )}
                </div>
              </Form>
            </Box>
          </Modal>
        )}
      </Formik>
    </>
  );
}

export default Dashboard;
