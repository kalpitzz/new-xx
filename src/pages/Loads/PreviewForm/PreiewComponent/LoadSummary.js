import { ArrowForward } from "@mui/icons-material";
import React, { useState, useEffect } from "react";
import style from "../PreviewForm.module.css";
import KeyboardArrowDown from "@mui/icons-material/KeyboardArrowDown";
// import LoadReducer from "../../../../redux/reducers/LoadReducer";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import Note from "./RenderNotes";
import dayjs from "dayjs";
import useAxios from "../../../../hooks/useAxios";
import NoteAction from "../../../../redux/actions/NoteAction";
import DispatchAction from "../../../../redux/actions/DispatchAction";
import useAuth from "../../../../hooks/useAuth";

const LoadSummary = () => {
  // -----------------------------------------------------------DATA----------------------------------------------------------
  const [Data, setData] = useState([
    { pickup_location: [], dropoff_location: [], freight_details: [] },
  ]);
  const [NoteData, setNoteData] = useState([{}]);
  const [total, settotal] = useState(0);
  const [Balance, setBalance] = useState(0);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const AxiosApi = useAxios();
  const TableData = useSelector((state) => {
    return state.LoadReducer.tableData;
  });
  const noteData = useSelector((state) => {
    return state.NoteReducer.noteData;
  });

  //------------------------------------------------------------------------USE EFFECT----------------------------------------------------------
  useEffect(() => {
    //---------------------------------------------------------------------------HANDLE NOTES DATA----------------------------------------------
    if (!noteData) {
      AxiosApi(`load/load_notes/?load_id=${location.state}`).then((res) => {
        dispatch(NoteAction.setNoteData(res));
        setNoteData(res);
      });
    } else {
      setNoteData(noteData);
    }
    //-------------------------------------------------------------------HANDLE FILTER DATA ACCORDING TO THE ID---------------------------------
    const final = (TableData) => {
      if (TableData === undefined) {
        return "";
      } else {
        const finalD = TableData.filter((res) => {
          return res.id === parseInt(location.state);
        });
        console.log(finalD);
        return finalD;
      }
    };

    console.log(final(TableData));
    setData(final(TableData));
    // -------------------------------------------------------------------HANDLE TOTAL CHARGES--------------------------------------------------

    handleTotalCharges(Data[0]);
    function handleTotalCharges() {
      const Data = final(TableData);
      console.log(Data);
      const fuelCharge = parseFloat(
        Data[0]?.charges?.fuel_surcharge?.amount === null
          ? 0
          : Data[0]?.charges?.fuel_surcharge?.amount
      );

      console.log(fuelCharge);
      const haulingFees = parseFloat(
        Data[0]?.charges?.hauling_fee?.amount === null
          ? 0
          : Data[0]?.charges?.hauling_fee?.amount
      );

      console.log(haulingFees);
      const discount = parseFloat(
        Data[0]?.charges?.discount?.amount === null
          ? 0
          : Data[0]?.charges?.discount?.amount
      );
      console.log(discount);
      let accessorialfees = 0;
      let accessorialdeductions = 0;
      Data[0]?.charges?.accessorial_fee.map((res) => {
        accessorialfees =
          accessorialfees + parseFloat(res?.amount === null ? 0 : res?.amount);
      });
      console.log(accessorialfees);
      Data[0]?.charges?.accessorial_deductions.map((res) => {
        accessorialdeductions =
          accessorialdeductions +
          parseFloat(res?.amount === null ? 0 : res?.amount);
      });
      const total =
        haulingFees + fuelCharge + accessorialfees - accessorialdeductions;
      settotal(total.toFixed(2));
      const balance = total.toFixed(2) - discount.toFixed(2);
      setBalance(balance.toFixed(2));
      console.log(total);

      console.log(accessorialdeductions);
    }
  }, []);
  console.log(TableData);

  // -------------------------------------------------------------SET THE DISPLAY---------------------------------------------------
  const [shipperdisplay, setshipperdisplay] = useState("none");
  const [consigneedisplay, setconsigneedisplay] = useState("none");
  const [freightdisplay, setfreightdisplay] = useState("none");
  const [chargesdisplay, setchargesdisplay] = useState("none");
  const [milesdisplay, setmilesdisplay] = useState("none");
  const [notesdisplay, setnotesdisplay] = useState("none");
  //----------------------------------------------------------------HANDLE DISPLAY------------------------------------------------
  const handleShipperDisplay = () => {
    if (shipperdisplay === "none") {
      setshipperdisplay("");
    } else {
      setshipperdisplay("none");
    }
  };
  const handleConsigneeDisplay = () => {
    if (consigneedisplay === "none") {
      setconsigneedisplay("");
    } else {
      setconsigneedisplay("none");
    }
  };
  const handleFreightDisplay = () => {
    if (freightdisplay === "none") {
      setfreightdisplay("");
    } else {
      setfreightdisplay("none");
    }
  };
  const handleChargesDisplay = () => {
    if (chargesdisplay === "none") {
      setchargesdisplay("");
    } else {
      setchargesdisplay("none");
    }
  };

  const handleMilesDisplay = () => {
    if (milesdisplay === "none") {
      setmilesdisplay("");
    } else {
      setmilesdisplay("none");
    }
  };

  const handleNotesDisplay = () => {
    if (notesdisplay === "none") {
      setnotesdisplay("");
    } else {
      setnotesdisplay("none");
    }
  };

  const handleNewDispatch = () => {
    dispatch(DispatchAction.setPreviewForDispatch(Data ? Data[0] : ""));
    navigate("/dispatch");
  };

  return (
    <>
      {/* //-----------------------------------------------LOAD-DISPATCH-MAIN-DIV---------------------------------------------- */}

      <div className={style.loadDisMainDiv}>
        <div className={style.loadDiv}>
          <div className={style.loadNumberDiv}>
            <div>
              <h4>LOAD-{Data[0]?.load_no}</h4>
              <p className={style.name}>{Data[0]?.carrier_name}</p>
            </div>
            <div className={`bx bx-package ${style.loadIcon}`}></div>
          </div>
          <div className={style.loadDetails}>
            <p className={style.label}>Account:</p>
            <p>{Data[0]?.account_no}</p>
            <p className={style.label}>Load Creation:</p>
            <p>
              {dayjs(Data[0]?.creation_datetime).format("YYYY-MM-DD HH:mm")}
            </p>
            <p className={style.label}>Reference:</p>
            <p>{Data[0]?.reference}</p>
          </div>
        </div>

        {/* --------------------------------------------------DISPATCH DIV----------------------------------------------------------- */}
        <div className={`${style.dispatchDiv} ${style.loadDiv}`}>
          <div className={style.loadNumberDiv}>
            <div>
              <h4>DISPATCH</h4>
              <p>
                Dispatch {Data[0]?.status !== "Accepted" ? "" : "Not"} Created
              </p>
              <p
                style={{
                  display:
                    (Data[0]?.status === "Accepted" && auth?.role === "DM") ||
                    (Data[0]?.status === "Accepted" && auth?.role === "DISP")
                      ? ""
                      : "none",
                }}
              >
                Click the button to
                {Data[0]?.status !== "Accepted" ? " view " : " create "}dispatch
                of this load
              </p>
            </div>
            <div className={`bx bxs-truck ${style.truckicon}`}></div>
          </div>

          <div className={style.dispatchButton}>
            <button
              value={Data[0]?.dispatch?.id}
              onClick={() => {
                handleNewDispatch();
              }}
              style={{
                display:
                  (Data[0]?.status === "Accepted" && auth?.role === "DM") ||
                  (Data[0]?.status === "Accepted" && auth?.role === "DISP")
                    ? ""
                    : "none",
              }}
            >
              {console.log("check the dispatch id", Data[0]?.dispatch?.id)}
              {`${
                (Data[0].status === "Accepted" && auth?.role === "DM") ||
                (Data[0]?.status === "Accepted" && auth?.role === "DISP")
                  ? "+ Create Dispatch"
                  : ""
              }`}
            </button>

            {/* ----------------------------------view dispatch button------------------------------------------------------- */}

            <button
              value={Data[0]?.dispatch?.id}
              // style={{
              //   display: `${data.status !== "draft" ? "" : "none"}`,
              // }}
              onClick={() => {
                navigate("/dispatchtable/dispatchsummary", {
                  state: Data[0]?.dispatch?.id,
                });
              }}
              style={{
                display: Data[0]?.status !== "Accepted" ? "" : "none",
              }}
            >
              {console.log("check the dispatch id", Data[0]?.dispatch?.id)}
              {`${
                Data[0].status !== "Accepted" ||
                Data[0]?.dispatch?.id !== undefined
                  ? "View Dispatch"
                  : ""
              }`}
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------SHIPPER DIV--------------------------------------------------------- */}
      <div className={`card ${style.shipperMainDiv}`}>
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-package ${style.icon}`}></div>
            <div>
              <h3>Shipper</h3>
              <p className={style.name}>{Data[0]?.shipper?.name}</p>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <button onClick={handleShipperDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>
        <div className={style.loadDetails} style={{ display: shipperdisplay }}>
          {Data[0]?.pickup_location.map((res, index) => {
            return (
              <>
                <p className={style.label}>Pickup From:</p>
                <p>
                  {res?.address?.line_2}
                  {res?.address?.line_1}
                </p>
                <p className={style.label}>Pickup Date/Time:</p>
                <p>{dayjs(res.start_time).format("YYYY-MM-DD HH:mm")}</p>
              </>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------------------CONSIGNEE DIV-------------------------------------------------------- */}
      <div className={`card ${style.shipperMainDiv}`}>
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-package ${style.icon}`}></div>
            <div>
              <h3>Consignee</h3>
              <p className={style.name}>{Data[0]?.consignee?.name}</p>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <button onClick={handleConsigneeDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>
        <div
          className={style.loadDetails}
          style={{ display: consigneedisplay }}
        >
          {Data[0]?.dropoff_location.map((res) => {
            return (
              <>
                <p className={style.label}>Delivery To:</p>
                <p>
                  {res.address.line_2} {res.address.line_1}
                </p>
                <p className={style.label}>Delivery Date/Time:</p>
                <p>{dayjs(res.start_time).format("YYYY-MM-DD HH:mm")}</p>
              </>
            );
          })}
        </div>
      </div>

      {/* --------------------------------------------------------------------FREIGHT DETAILS------------------------------------------------ */}
      <div className={`card ${style.shipperMainDiv}`}>
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
          {Data[0]?.freight_details.map((res, index) => {
            return (
              <>
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
              </>
            );
          })}
          <p className={style.label}>Trailer Type:</p>
          <p>{Data[0]?.trailer_type}</p>
        </div>
      </div>

      {/* ----------------------------------------------------------------------------CHARGES---------------------------------------------------- */}
      <div className={`card ${style.shipperMainDiv}`}>
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-dollar ${style.icon}`}></div>
            <div>
              <h3>Charges</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <button onClick={handleChargesDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>
        <div style={{ display: chargesdisplay }}>
          <div className={style.freightLoadDetails}>
            <p className={style.label}>Hauling Fee:</p>
            <p>${Data[0]?.charges?.hauling_fee?.amount}</p>
            <p className={style.label}>Fuel Surcharges:</p>
            <p>${Data[0]?.charges?.fuel_surcharge?.amount}</p>
          </div>
          <p className={style.accessorialFees}>Accessorial Fees</p>
          <div className={style.accessorialFeesDiv}>
            <p className={style.label}>Type</p>
            <p className={style.label}>Rate</p>
            <p className={style.label}>Amount</p>
            <p>
              {Data[0]?.charges?.accessorial_fee.map((res) => {
                return (
                  <>
                    {res?.type?.name}
                    <br />
                  </>
                );
              })}
            </p>
            <p>
              {Data[0]?.charges?.accessorial_fee.map((res) => {
                return (
                  <>
                    $ {res?.rate}
                    <br />
                  </>
                );
              })}
            </p>
            <p>
              {Data[0]?.charges?.accessorial_fee.map((res) => {
                return (
                  <>
                    $ {res?.amount}
                    <br />
                  </>
                );
              })}
            </p>
          </div>
          {/* ---------------------------------------------------------------------Accessorial Deduction--------------------------------------------------------- */}
          <p className={style.accessorialFees}>Accessorial Deduction</p>
          <div className={style.accessorialFeesDiv}>
            <p className={style.label}>Type</p>
            <p className={style.label}>Rate</p>
            <p className={style.label}>Amount</p>
            <p>
              {Data[0]?.charges?.accessorial_deductions.map((res) => {
                return (
                  <>
                    {res?.type?.name}
                    <br />
                  </>
                );
              })}
            </p>

            <p>
              {Data[0]?.charges?.accessorial_deductions.map((res) => {
                return (
                  <>
                    $ {res?.rate}
                    <br />
                  </>
                );
              })}
            </p>
            <p>
              {Data[0]?.charges?.accessorial_deductions.map((res) => {
                return (
                  <>
                    $ {res?.amount}
                    <br />
                  </>
                );
              })}
            </p>
          </div>
        </div>
        <div style={{ display: chargesdisplay }}>
          <div className={style.chargesTotalDiv}>
            <p className={style.label}>Total Charges:</p>
            <p>$ {total}</p>
          </div>
          <div className={style.chargesTotalDiv}>
            <p className={style.label}>Discount:</p>
            <p>$ {Data[0]?.charges?.discount?.amount}</p>
          </div>
          <div className={style.chargesTotalDiv}>
            <p className={style.label}>Balance:</p>
            <p>$ {Balance}</p>
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------------------------MILES DIV-------------------------------------------- */}
      <div className={`card ${style.shipperMainDiv}`}>
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-package ${style.icon}`}></div>
            <div>
              <h3>Miles</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <button onClick={handleMilesDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>
        <div className={style.loadDetails} style={{ display: milesdisplay }}>
          <p className={style.label}>Miles Count Method:</p>
          <p>
            {Data[0]?.miles_type === "bing_maps"
              ? "Bing Map"
              : Data[0]?.miles_type}
          </p>
          <p className={style.label}>Total Miles:</p>
          <p>{Data[0]?.total_mile} Miles</p>
        </div>
      </div>

      {/* ------------------------------------------------------------------------NOTES DIV------------------------------------------------------------------- */}
      <div className={`card ${style.shipperMainDiv}`}>
        <div className={style.shipperHeader}>
          <div className={style.leftHeader}>
            <div className={`bx bx-notepad ${style.icon}`}></div>
            <div>
              <h3>Notes for the load</h3>
            </div>
          </div>
          <div className={style.dropDownButton}>
            <button onClick={handleNotesDisplay}>
              <KeyboardArrowDown />
            </button>
          </div>
        </div>
        <div style={{ display: notesdisplay }} className={style.notesViewDiv}>
          <div className={style.renderMainDiv}>
            <Note data={NoteData} type={"note"} />
          </div>
        </div>
      </div>
    </>
  );
};

export default LoadSummary;
