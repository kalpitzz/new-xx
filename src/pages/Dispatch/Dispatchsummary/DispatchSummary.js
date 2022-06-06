import { KeyboardArrowDown } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import style from "./DispatchSummery.module.css";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useAxios from "../../../hooks/useAxios";
import { Button } from "@material-ui/core";
import DriverCheckCall from "../DriverCheckCall/DriverCheckCall";
import DispatchAction from "../../../redux/actions/DispatchAction";
import Note from "../../Loads/PreviewForm/PreiewComponent/RenderNotes";
// import DispatchNoteAction from "../../../redux/actions/DispatchNoteAction";
import useAuth from "../../../hooks/useAuth";

const DispatchSummary = () => {
  const [freightdisplay, setfreightdisplay] = useState("none");
  const [routeDisplay, setrouteDisplay] = useState("none");
  const [driverEquipmentDisplay, setdriverEquipmentDisplay] = useState("none");
  const [recentCheckCallDisplay, setrecentCheckCallDisplay] = useState("none");
  const [notesDisplay, setnotesDisplay] = useState("none");
  const [Data, setData] = useState([{}]);
  const [NoteData, setNoteData] = useState([{}]);
  const [checkCallData, setcheckCallData] = useState([{}]);

  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const AxiosApi = useAxios();

  const { auth } = useAuth();
  const TableData = useSelector((state) => {
    return state.DispatchReducer.dispatchTableData;
  });

  // const summaryData = useSelector(
  //   (state) => state.DispatchReducer.dispatchSummaryData
  // );

  // const CheckCallData = useSelector(
  //   (state) => state.DispatchReducer.checkCallData
  // );

  // const noteData = useSelector((state) => {
  //   return state.DispatchNoteReducer.noteData;
  // });

  //------------------------------------------------------------------------USE EFFECT----------------------------------------------------------
  useEffect(() => {
    //---------------------------------------------------------------------------HANDLE NOTES DATA----------------------------------------------

    AxiosApi(`dispatch/notes/?dispatch_id=${location.state}`).then((res) => {
      setNoteData(res);
    });

    AxiosApi(`dispatch/checkcall/?dispatch_id=${location.state}`).then(
      (res) => {
        setcheckCallData(res);
      }
    );

    //-------------------------------------------------------------------HANDLE FILTER DATA ACCORDING TO THE ID---------

    const final = (TableData) => {
      if (TableData === undefined) {
        return "";
      } else {
        const finalD = TableData.filter((res) => {
          return res.id === parseInt(location.state);
        });
        return finalD;
      }
    };
    console.log("final", final(TableData));
    dispatch(DispatchAction.setdispatchSummaryData(final(TableData)));
    setData(final(TableData));
  }, []);

  // --------------------------------------------------HANDLE DISPLAY------------------------------------
  const handleFreightDisplay = () => {
    if (freightdisplay === "none") {
      setfreightdisplay("");
    } else {
      setfreightdisplay("none");
    }
  };

  const handleRouteDisplay = () => {
    if (routeDisplay === "none") {
      setrouteDisplay("");
    } else {
      setrouteDisplay("none");
    }
  };

  const handleDriverAndEquipmentDisplay = () => {
    if (driverEquipmentDisplay === "none") {
      setdriverEquipmentDisplay("");
    } else {
      setdriverEquipmentDisplay("none");
    }
  };

  const handleRecentCheckCallDisplay = () => {
    if (recentCheckCallDisplay === "none") {
      setrecentCheckCallDisplay("");
    } else {
      setrecentCheckCallDisplay("none");
    }
  };
  const handleNotesDisplay = () => {
    if (notesDisplay === "none") {
      setnotesDisplay("");
    } else {
      setnotesDisplay("none");
    }
  };
  const handleAddCheckCall = () => {
    dispatch(
      DispatchAction.setDispatchId(
        Data ? { id: Data[0].id, status: Data[0].status } : ""
      )
    );
    navigate("/check_call");
  };
  // ---------------------------------------------------------------------RECENT CHECK CALL DATA------------------------------------------------------
  let startTrip = checkCallData.filter((res) => res?.status === "Trip Started");

  return (
    <>
      {/* <div className={style.dispatchsummeryMainDiv}> */}
      {/* -----------------------------------------------------------------DISPATCH DETAILS----------------------------------------------- */}
      <div className={`card ${style.dispatchDetailsMainDiv}`}>
        <div className={style.summeryDispatchNumber}>LOAD-1001</div>
        <div className={style.dispatchDetails}>
          <div className={`${style.detailsDiv1}`}>
            <p className={style.carrierName}>{Data[0]?.load?.carrier_name}</p>
            <div>
              <p className={style.label}>Pick Up</p>
              <p className={style.addressDetails}>
                {Data[0]?.load?.pickup_location[0]?.address?.line_1}
                <br />
                {dayjs(Data[0]?.load?.pickup_location[0]?.start_time).format(
                  "YYYY-MM-DD HH:mm"
                )}
              </p>
              <p className={style.label}>Drop Off</p>
              <p className={style.addressDetails}>
                {
                  Data[0]?.load?.dropoff_location[
                    Data[0]?.load?.dropoff_location.length - 1
                  ]?.address?.line_1
                }
                <br />
                {dayjs(
                  Data[0]?.load?.dropoff_location[
                    Data[0]?.load?.dropoff_location.length - 1
                  ]?.start_time
                ).format("YYYY-MM-DD HH:mm")}
              </p>
              <p className={style.label}>Total Miles</p>
              <p className={style.addressDetails}>
                {Data[0]?.load?.total_mile}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* -----------------------------------------------------------------FREIGHT DETAILS-------------------------------------------------------- */}
      <div
        className={`card ${style.shipperMainDiv}`}
        onClick={handleFreightDisplay}
      >
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-package ${style.icon}`}></div>
            <div>
              <h3>Freight Details</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <button onClick={handleFreightDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>

        <div
          className={style.freightLoadDetails}
          style={{ display: freightdisplay }}
        >
          {Data[0]?.load?.freight_details.map((res, index) => {
            return (
              <React.Fragment key={index}>
                <p className={style.freightIndex}>Freight {index + 1}</p>

                <p className={style.label}>Description:</p>
                <p className={style.freightDescription}>{res.description}</p>

                <p className={style.label}>Weight:</p>
                <p>
                  {res.weight} {res.weight_unit_name}
                </p>
                <p className={style.label}>Quantity:</p>
                <p>
                  {res.quantity} {res.quantity_type_name}
                </p>
                <p className={style.label}>L*W*H:</p>
                <p>
                  {res.length}*{res.width}*{res.height}
                </p>
                <p className={style.label}>Declared Value:</p>
                <p>${res.declared_value}</p>
              </React.Fragment>
            );
          })}
          <p className={style.label}>Trailer Type:</p>
          <p>{Data[0]?.trailer_type}</p>
        </div>
      </div>
      {/* ---------------------------------------------------------------------ROUTE DETAILS--------------------------------- */}
      <div
        className={`card ${style.shipperMainDiv}`}
        onClick={handleRouteDisplay}
      >
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-directions ${style.icon}`}></div>
            <div>
              <h3>Routing Details</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            {/* <Button
              variant="outlined"
              className={`bx bx-directions ${style.viewTrip} ${style.showButtonWithName}`}
              onClick={() => {
                console.log("click on View trip");
                // navigate("/driverstatus");
              }}
            >
              view trip
            </Button> */}

            {/* <button
              className={`bx bx-directions ${style.viewTrip} ${style.showButtonWithoutName}`}
              onClick={() => {
                console.log("click on View trip");
                // navigate("/driverstatus", { state: Data });
              }}
            ></button> */}

            <button onClick={handleRouteDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>

        <div className={style.routeDetails} style={{ display: routeDisplay }}>
          <div className={style.routeStatus}>
            <p>Start Trip</p>
            <p> At Pick Up</p>
            <p>Picked-up </p>
            <p>At Delivery</p>
            <p>Delivered</p>
          </div>
          <DriverCheckCall
            name="dashboard"
            data={checkCallData}
            dispatchData={Data}
          />
        </div>
      </div>
      {/* </div> */}
      {/* <div className={`card ${style.driverEquipmentDetails}`}>Ankit</div> */}
      {/* ----------------------------------------------------------------------Driver & equipment Details------------------------------------------- */}
      <div
        className={`card ${style.shipperMainDiv}`}
        onClick={handleDriverAndEquipmentDisplay}
      >
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bxs-truck ${style.icon}`}></div>
            <div>
              <h3>Driver & Equipment</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            {/* <Button
              variant="outlined"
              className={`bx bxs-truck ${style.viewTrip} ${style.showButtonWithName}`}
              style={{
                display: auth.role !== "CO" || auth.role !== "D" ? "" : "none",
              }}
            >
              View Assignment
            </Button> */}

            {/* <button
              className={`bx bxs-truck ${style.viewTrip} ${style.showButtonWithoutName}`}
              onClick={() => {
                console.log("click on View trip");
              }}
            ></button> */}

            <button onClick={handleDriverAndEquipmentDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>

        <div
          className={style.freightLoadDetails}
          style={{ display: driverEquipmentDisplay }}
        >
          <p className={style.label}>Driver Name:</p>

          <p>
            {Data[0]?.driver?.user?.first_name}
            {` ${Data[0]?.driver?.user?.last_name}`}
          </p>
          <p className={style.label}>Truck Unit No.</p>
          <p>{Data[0]?.truck?.unit_number}</p>
          <p className={style.label}>Trailer Unit No.</p>
          <p>{Data[0]?.truck?.trailer_unit_number}</p>
        </div>
      </div>

      {/* -------------------------------------------------------------------RECENT CHECK CALL---------------------------------------  */}
      <div
        className={`card ${style.shipperMainDiv}`}
        onClick={handleRecentCheckCallDisplay}
      >
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-flag ${style.icon}`}></div>
            <div>
              <h3>Recent Check Calls</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <Button
              variant="outlined"
              className={`bx bx-flag ${style.viewTrip} ${style.showButtonWithName}`}
              onClick={handleAddCheckCall}
            >
              Add Check Call
            </Button>
            <button
              className={`bx bx-flag ${style.viewTrip} ${style.showButtonWithoutName}`}
              onClick={() => {
                console.log("click on View trip");
              }}
            ></button>
            <button onClick={handleRecentCheckCallDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>

        <div style={{ display: recentCheckCallDisplay }}>
          <p className={style.label}>Last Check Call</p>
          <div className={style.checkcallDateLocation}>
            <p>
              At {checkCallData[checkCallData.length - 1]?.city}
              {checkCallData[checkCallData.length - 1]?.zip_code}
            </p>
            <p>
              {dayjs(
                checkCallData[checkCallData.length - 1]?.current_date_time
              ).format("YYYY-MM-DD HH:mm")}
            </p>
          </div>
          <p className={style.label}>Starting Trip</p>
          <div className={style.checkcallDateLocation}>
            <p>
              At {startTrip[0] === undefined ? "" : startTrip[0]?.city}{" "}
              {startTrip[0] === undefined ? "" : startTrip[0]?.zip_code}
            </p>
            <p>
              {startTrip[0] === undefined
                ? ""
                : dayjs(startTrip[0]?.current_date_time).format(
                    "YYYY-MM-DD HH:mm"
                  )}
            </p>
          </div>
        </div>
      </div>
      {/* ----------------------------------------------------------------Notes------------------------------------------------------------------------ */}
      <div
        className={`card ${style.shipperMainDiv}`}
        onClick={handleNotesDisplay}
      >
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-notepad ${style.icon}`}></div>
            <div>
              <h3>Notes for the Dispatch</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <button onClick={handleNotesDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>
        <div className={style.notesViewDiv} style={{ display: notesDisplay }}>
          <div className={style.renderMainDiv}>
            <Note data={NoteData} type={"note"} />
          </div>
        </div>
      </div>
    </>
  );
};
// style={{ display: notesdisplay }}
export default DispatchSummary;
