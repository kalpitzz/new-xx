import React, { useState, useEffect } from "react";
import DriverCheckCall from "./DriverCheckCall";
import style from "./DriverCheckCall.module.css";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
import { useDispatch, useSelector } from "react-redux";
import useAxios from "../../../hooks/useAxios";
import { useLocation } from "react-router-dom";
import DispatchAction from "../../../redux/actions/DispatchAction";

const DriverStatus = ({ dispatchDetails }) => {
  const [CheckCallData, setCheckCallData] = useState([{}]);

  const dispatch = useDispatch();
  const AxiosApi = useAxios();
  const location = useLocation();
  console.log("dispatch id", location.state);
  const Data = useSelector(
    (state) => state.DispatchReducer.dispatchSummaryData
  );
  console.log("Data", Data);
  console.log("DispatchDetails", dispatchDetails);
  const checkCallData = useSelector(
    (state) => state.DispatchReducer.checkCallData
  );
  console.log("checkcalldata by redux", checkCallData);
  console.log("check call data from route screen", CheckCallData);
  console.log(Data);
  useEffect(() => {
    AxiosApi(`dispatch/checkcall/?dispatch_id=${location.state}`).then(
      (res) => {
        console.log("call check call api", res);
        dispatch(DispatchAction.setCheckCallData(res));
        setCheckCallData(res);
      }
    );
  }, []);

  console.log(Data);
  return (
    <div className={`card ${style.cardMainDiv}`}>
      {/* --------------------------------------------------------HEADER PART---------------------------------------------------- */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h3>Truck 104 Route</h3>
        <div>
          {/* <button className={style.direction}>
            <NearMeOutlinedIcon className={style.mapoutlined} />
            Direction
          </button> */}
          <button className={style.direction}>
            <MapOutlinedIcon className={style.mapoutlined} /> Route Plan
          </button>
        </div>
      </div>

      <DriverCheckCall data={CheckCallData} dispatchData={dispatchDetails} />

      <table className={style.mytable}>
        <thead className={style.thead}>
          <tr>
            <td>From</td>
            <td>to</td>
            <td>Total</td>
          </tr>
        </thead>
        <tbody>
          {dispatchDetails?.map((res, index) => (
            <tr>
              <td>{res?.load?.pickup_location[index]?.address?.line_1}</td>
              <td>{res?.load?.dropoff_location[index]?.address?.line_1}</td>
              <td>{res?.load?.total_mile}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverStatus;
