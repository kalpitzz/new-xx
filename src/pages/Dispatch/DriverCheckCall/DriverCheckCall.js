//------------------------------------------------IMPORT LIBRARY-------------------------------------------------------
import React, { useState, useEffect } from "react";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import style from "./DriverCheckCall.module.css";
import dayjs from "dayjs";

//------------------------------------------------------START FUNCTION------------------------------------------------------------
const DriverCheckCall = (props) => {
  const [displayType, setdisplayType] = useState("");
  const Data = props.dispatchData;
  const CheckCallData = props.data;

  useEffect(() => {
    props.name === "dashboard" ? setdisplayType("none") : setdisplayType("");
  }, []);
  //-----------------------------------------------------DRIVER STATUS-------------------------------------------------------

  //-----------------------------------------------------INTIAL VALUE BY DISPATCHER-----------------------------------------
  let Dispatcher = {
    shippLocation: `${Data[0]?.load?.pickup_location[0]?.address?.city}, ${Data[0]?.load?.pickup_location[0]?.address?.state}`,
    shippDate: dayjs(Data[0]?.load?.pickup_location[0]?.start_time).format(
      "YYYY-MM-DD HH:mm"
    ),

    shipzipcode: Data[0]?.load?.pickup_location[0]?.address?.zipcode,
    consizipcode:
      Data[0]?.load?.dropoff_location[
        Data[0]?.load?.dropoff_location.length - 1
      ]?.address?.zipcode,
    consiLocation: `  ${
      Data[0]?.load?.dropoff_location[
        Data[0]?.load?.dropoff_location.length - 1
      ]?.address?.city
    },
      ${
        Data[0]?.load?.dropoff_location[
          Data[0]?.load?.dropoff_location.length - 1
        ]?.address?.state
      }`,
    consiDate: dayjs(
      Data[0]?.load?.dropoff_location[
        Data[0]?.load?.dropoff_location.length - 1
      ]?.start_time
    ).format("YYYY-MM-DD HH:mm"),

    pickedUpDate: dayjs(Data[0]?.load?.pickup_location[0]?.start_time)
      .add(2, "h")
      .format("YYYY-MM-DD HH:mm"),

    DeliveryDate: dayjs(
      Data[0]?.load?.dropoff_location[
        Data[0]?.load?.dropoff_location.length - 1
      ]?.start_time
    )
      .add(2, "h")
      .format("YYYY-MM-DD HH:mm"),
  };
  //-----------------------------------------------------INTIAL VALUE BY DRIVER---------------------------------------------

  const StartData = CheckCallData?.filter(
    (res) => res?.status === "Trip Started"
  );
  const ShipData = CheckCallData?.filter(
    (res) => res?.status === "Arrived At Pick-up"
  );
  const PickedupData = CheckCallData?.filter(
    (res) => res?.status === "Picked Up"
  );
  const ConsiData = CheckCallData?.filter(
    (res) => res?.status === "Arrived At Delivery"
  );
  const EndData = CheckCallData?.filter((res) => res?.status === "Delivered");
  let Driver = {
    startzipcode: `${StartData[0] === undefined ? "" : StartData[0]?.zip_code}`,
    startLocation: `${StartData[0] === undefined ? "" : StartData[0]?.city}`,
    startDate: `${
      StartData[0] === undefined
        ? ""
        : dayjs(StartData[0]?.current_date_time).format("YYYY-MM-DD HH:mm")
    }`,
    shippDate: `${
      ShipData[0] === undefined
        ? ""
        : dayjs(ShipData[0]?.current_date_time).format("YYYY-MM-DD HH:mm")
    }`,
    pickedUpDate: `${
      PickedupData[0] === undefined
        ? ""
        : dayjs(PickedupData[0]?.current_date_time).format("YYYY-MM-DD HH:mm")
    }`,

    consiDate: `${
      ConsiData[0] === undefined
        ? ""
        : dayjs(ConsiData[0]?.current_date_time).format("YYYY-MM-DD HH:mm")
    }`,
    endDate: `${
      EndData[0] === undefined
        ? ""
        : dayjs(EndData[0]?.current_date_time).format("YYYY-MM-DD HH:mm")
    }`,
  };

  //--------------------------------------------------------------CONVERT STRING DATE AND TIME INTO 24 FORMAT------------------
  const disConsiTime = new Date(Date.parse(Dispatcher.consiDate));
  const driConsiTime = new Date(Date.parse(Driver.consiDate));
  const disShipTime = new Date(Date.parse(Dispatcher.shippDate));
  const driShipTime = new Date(Date.parse(Driver.shippDate));
  const dispickedUpTime = new Date(Date.parse(Dispatcher.pickedUpDate));
  const disdeliveredTime = new Date(Date.parse(Dispatcher.DeliveryDate));
  const dripickedUpTime = new Date(Date.parse(Driver.pickedUpDate));
  const drideliveredTime = new Date(Date.parse(Driver.endDate));
  //----------------------------------------------------------HANDLE SHIP STATUS FUNCTION-----------------------------------------
  const handleshipstatus = () => {
    if (Driver.shippDate === "") {
      return "";
    } else if (driShipTime <= disShipTime) {
      return style.ontime;
    } else {
      return style.delay;
    }
  };

  const handlePickedUpStatus = () => {
    if (Driver.pickedUpDate === "") {
      return "";
    } else if (dripickedUpTime <= dispickedUpTime) {
      return style.ontime;
    } else {
      return style.delay;
    }
  };

  const handleDeliveredStatus = () => {
    if (Driver.endDate === "") {
      return "";
    } else if (drideliveredTime <= disdeliveredTime) {
      return style.ontime;
    } else {
      return style.delay;
    }
  };
  //----------------------------------------------------------HANDLE CONSI STATUS FUNCTION------------------------------------------
  const handleconsistatus = () => {
    if (Driver.consiDate === "") {
      return "";
    } else if (driConsiTime <= disConsiTime) {
      return style.ontime;
    } else {
      return style.delay;
    }
  };
  //---------------------------------------------------------------HANDLE TRUCK VISIBILTY-------------------
  const handleStartTruckVisiblty = () => {
    if (
      Driver.startDate !== "" &&
      Driver.shippDate === "" &&
      Driver.pickedUpDate === "" &&
      Driver.consiDate === "" &&
      Driver.endDate === "" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Cancelled" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Delivered" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Completed"
    ) {
      return style.truckBG;
    } else {
      return style.truckDisplay;
    }
  };

  const handleShipTruck = () => {
    if (
      Driver.startDate !== "" &&
      Driver.shippDate !== "" &&
      Driver.pickedUpDate === "" &&
      Driver.consiDate === "" &&
      Driver.endDate === "" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Cancelled" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Delivered" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Completed"
    ) {
      return style.truckBG;
    } else {
      return style.truckDisplay;
    }
  };

  const handlePickedUPTruck = () => {
    if (
      Driver.startDate !== "" &&
      Driver.shippDate !== "" &&
      Driver.pickedUpDate !== "" &&
      Driver.consiDate === "" &&
      Driver.endDate === "" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Cancelled" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Delivered" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Completed"
    ) {
      return style.truckBG;
    } else {
      return style.truckDisplay;
    }
  };
  const handleConsiTruck = () => {
    if (
      Driver.startDate !== "" &&
      Driver.shippDate !== "" &&
      Driver.pickedUpDate !== "" &&
      Driver.consiDate !== "" &&
      Driver.endDate === "" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Cancelled" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Delivered" &&
      CheckCallData[CheckCallData.length - 1]?.status !== "Completed"
    ) {
      return style.truckBG;
    } else {
      return style.truckDisplay;
    }
  };

  const handleEndTruck = () => {
    if (
      (Driver.startDate !== "" &&
        Driver.shippDate !== "" &&
        Driver.pickedUpDate !== "" &&
        Driver.consiDate !== "" &&
        Driver.endDate !== "" &&
        CheckCallData[CheckCallData.length - 1]?.status !== "Completed") ||
      CheckCallData[CheckCallData.length - 1]?.status === "Delivered"
    ) {
      return style.truckBG;
    } else {
      return style.truckDisplay;
    }
  };

  //---------------------------------------------------------------RETURN---------------------------------------------------------------
  return (
    <div
      className={` ${
        props.name === "dashboard" ? "" : style.DriverCheckCallMainDiv
      }`}
    >
      {/* -------------------------------------------------------STEPPER START--------------------------------------------------- */}
      <div
        className={style.statusHeading}
        style={{ display: `${props.name === "dashboard" ? "none" : ""}` }}
      >
        <table className={style.table}>
          <thead className={style.thead}>
            <tr>
              <td>Start Trip</td>
              <td>Arrived At Pick Up</td>
              <td>Picked Up</td>
              <td>Arrived At Delivery</td>
              <td>Delivered</td>
            </tr>
          </thead>
        </table>
      </div>
      <div
        className={`${
          props.name === "dashboard"
            ? style.DasStepper
            : style.RFS_StepperContainer
        } `}
      >
        <div className={style.by} style={{ display: displayType }}>
          <span className={style.byDot}></span>
          <div className={style.expected}>
            Expected Time
            <br />
            (Dispatcher)
          </div>
          <span className={style.byDot}></span>
          <div className={style.actual}>
            Actual Time <br />
            (Driver)
          </div>
        </div>

        {/* ------------------------------------------------------FIRST STEP----------------------------------------------  */}
        <div className={`${style.RFS_StepContainer} `}>
          <div className={`${style.RFS_StepMain}`}>
            <button
              className={`${style.RFS_StepButton} ${
                StartData[0]?.status === "Trip Started" ? style.start : ""
              }`}
            >
              <span
                className={`${
                  style.RFS_StepButtonContent
                } ${handleStartTruckVisiblty()}`}
              >
                <LocalShippingIcon className={`${style.icon} ${style.blink}`} />
              </span>
            </button>

            <div
              className={`${style.RFS_LabelContainer}`}
              style={{ display: displayType }}
            >
              <span className={`${style.RFS_Label}`}>
                <p className={style.p}>{Driver.startLocation}</p>
                <p className={style.p}> {Driver.startzipcode}</p>
                <p>{Driver.startDate}</p>
              </span>
            </div>
          </div>
        </div>
        {/* ------------------------------------------------------------SECOND STEP------------------------------------------------ */}
        <div className={`${style.RFS_StepContainer}`}>
          <div
            className={`${
              props.name === "dashboard"
                ? style.fordashboard_RFS_ConnectorContainer
                : style.RFS_ConnectorContainer
            }`}
          >
            <span className={`${style.RFS_Connector} `}></span>
          </div>
          <div
            className={`${style.RFS_StepMain}  ${
              props.name === "dashboard" ? "" : style.secondstep
            }`}
          >
            <div
              className={`${style.RFS_LabelContainer}`}
              style={{ display: displayType }}
            >
              <span className={`${style.RFS_Label}`}>
                <p className={style.p}>
                  {Dispatcher.shippLocation === "" ? (
                    <span style={{ visibility: "hidden" }}>''</span>
                  ) : (
                    Dispatcher.shippLocation
                  )}
                </p>
                <p className={style.p}>
                  {Dispatcher.shipzipcode === "" ? (
                    <span style={{ visibility: "hidden" }}>''</span>
                  ) : (
                    Dispatcher.shipzipcode
                  )}
                </p>
                <p>
                  {Dispatcher.shippDate === "" ? (
                    <span style={{ visibility: "hidden" }}>''</span>
                  ) : (
                    Dispatcher.shippDate
                  )}
                </p>
              </span>
            </div>
            <button className={`${style.RFS_StepButton} ${handleshipstatus()}`}>
              <span
                className={`${
                  style.RFS_StepButtonContent
                } ${handleShipTruck()}`}
              >
                <LocalShippingIcon
                  className={`${style.icon}  ${style.blink}`}
                />
              </span>
            </button>
            <div
              className={`${style.RFS_LabelContainer}`}
              style={{ display: displayType }}
            >
              <span className={`${style.RFS_Label}`}>
                <p className={style.p}>{Dispatcher.shippLocation}</p>
                <p className={style.p}>{Dispatcher.shipzipcode}</p>
                <p>
                  {Driver.shippDate}-{Driver.shippTime}
                </p>
              </span>
            </div>
          </div>
        </div>
        {/* ----------------------------------------------------------THIRD STEP-------------------------------------- */}
        <div className={`${style.RFS_StepContainer}`}>
          <div
            className={`${
              props.name === "dashboard"
                ? style.fordashboard_RFS_ConnectorContainer
                : style.RFS_ConnectorContainer
            }`}
          >
            <span
              className={`${style.RFS_Connector}  
             
              `}
            ></span>
          </div>
          <div className={`${style.RFS_StepMain}`}>
            <button
              disabled=""
              className={`${style.RFS_StepButton} ${handlePickedUpStatus()}`}
            >
              <span
                className={`${
                  style.RFS_StepButtonContent
                } ${handlePickedUPTruck()}`}
              >
                <LocalShippingIcon
                  className={`${style.icon}  ${style.blink}`}
                />
              </span>
            </button>
            <div
              className={`${style.RFS_LabelContainer}`}
              style={{ display: displayType }}
            >
              <span className={`${style.RFS_Label}`}>
                <p className={style.p}>{Dispatcher.shippLocation}</p>
                <p className={style.p}>{Dispatcher.shipzipcode}</p>
                <p>{Driver.pickedUpDate}</p>
              </span>
            </div>
          </div>
        </div>
        {/* ---------------------------------------------------------FOURTH STEP-------------------------------------------------- */}
        <div className={`${style.RFS_StepContainer}`}>
          <div
            className={`${
              props.name === "dashboard"
                ? style.fordashboard_RFS_ConnectorContainer
                : style.RFS_ConnectorContainer
            }`}
          >
            <span className={`${style.RFS_Connector}`}></span>
          </div>
          <div
            className={`${style.RFS_StepMain}  ${
              props.name === "dashboard" ? "" : style.secondstep
            }`}
          >
            <div
              className={`${style.RFS_LabelContainer}`}
              style={{ display: displayType }}
            >
              <span className={`${style.RFS_Label}`}>
                <p className={style.p}>
                  {Dispatcher.consiLocation === "" ? (
                    <span style={{ visibility: "hidden" }}>''</span>
                  ) : (
                    Dispatcher.consiLocation
                  )}
                </p>
                <p className={style.p}>
                  {Dispatcher.consizipcode === "" ? (
                    <span style={{ visibility: "hidden" }}>''</span>
                  ) : (
                    Dispatcher.consizipcode
                  )}
                </p>
                <p>
                  {Dispatcher.consiDate === "" ? (
                    <span style={{ visibility: "hidden" }}>''</span>
                  ) : (
                    Dispatcher.consiDate
                  )}
                </p>
              </span>
            </div>
            <button
              className={`${style.RFS_StepButton} ${handleconsistatus()}`}
            >
              <span
                className={`${
                  style.RFS_StepButtonContent
                } ${handleConsiTruck()}`}
              >
                <LocalShippingIcon
                  className={`${style.icon} ${style.blink} `}
                />
              </span>
            </button>
            <div
              className={`${style.RFS_LabelContainer}`}
              style={{ display: displayType }}
            >
              <span className={`${style.RFS_Label}`}>
                <p className={style.p}>{Dispatcher.consiLocation}</p>
                <p className={style.p}> {Dispatcher.consizipcode}</p>
                <p>{Driver.consiDate}</p>
              </span>
            </div>
          </div>
        </div>

        {/* -------------------------------------------FIFTH STEP---------------------------------------------------------- */}
        <div className={`${style.RFS_StepContainer}`}>
          <div
            className={`${
              props.name === "dashboard"
                ? style.fordashboard_RFS_ConnectorContainer
                : style.RFS_ConnectorContainer
            }`}
          >
            <span className={`${style.RFS_Connector}  `}></span>
          </div>
          <div className={`${style.RFS_StepMain}`}>
            <button
              disabled=""
              className={`${style.RFS_StepButton} ${handleDeliveredStatus()}`}
            >
              <span
                className={`${style.RFS_StepButtonContent} ${handleEndTruck()}`}
              >
                <LocalShippingIcon className={`${style.icon} `} />
              </span>
            </button>
            <div
              className={`${style.RFS_LabelContainer}`}
              style={{ display: displayType }}
            >
              <span className={`${style.RFS_Label}`}>
                <p className={style.p}>{Dispatcher.consiLocation}</p>
                <p className={style.p}>{Dispatcher.consizipcode}</p>
                <p>{Driver.endDate}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverCheckCall;
