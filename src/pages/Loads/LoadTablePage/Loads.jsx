import React, { useState, useEffect, useRef } from "react";
import "@mui/material";
import { Button, TablePagination } from "@mui/material";

// import tableData from "../../../assets/JsonData/LoadTable-data.json";
import style from "./Loads.module.css";

import { useNavigate } from "react-router-dom";

import useAxios from "../../../hooks/useAxios";

import { Add } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import LoadAction from "../../../redux/actions/LoadAction.js";
import DispatchAction from "../../../redux/actions/DispatchAction";
import dayjs from "dayjs";
import useAuth from "../../../hooks/useAuth";
import csvDownload from "json-to-csv-export";
// import FeedOutlinedIcon from "@mui/icons-material";
//------------------------------------------------------------------------START THE FUCTION-----------------------------------------------------------------------
const LoadTable = (props) => {
  // let tableData = [];
  const statusData = [
    "All Load",
    // "Available",
    // "Rejected",
    "Cancelled",
    "Accepted",
    "Draft",
  ];

  const { auth } = useAuth();
  console.log(auth.role);
  const AxiosApi = useAxios();
  const [tableData, settableData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [StatusHeading, setStatusHeading] = useState("All Load");
  const [dispatchcell, setdispatchcell] = useState("");
  const [actioncell, setactioncell] = useState("none");
  const [cancelcell, setcancelcell] = useState("none");
  const [Data, setData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const closeRef = useRef();
  const [render, setrender] = useState(0);
  console.log(closeRef);
  const TableData = useSelector((state) => state.LoadReducer.tableData);
  console.log(TableData);
  useEffect(() => {
    // if (!TableData) {
    console.log(" table api call ");
    AxiosApi("load/load/").then((res) => {
      console.log(res);
      dispatch(LoadAction.setTableData(res));
      setData(res);
      settableData(res);
      setrender(1);
    });
    // }
    // else {
    //   console.log("not call api");
    //   setrender(1);
    //   setData(TableData);
    //   settableData(TableData);
    // }
  }, []);

  console.log(tableData);

  //----------------------------------------------------------------------------Navigation--------------------------------------------------------
  const handleNavigation = (e) => {
    console.log(e);
    navigate("loaddetails", { state: e });
  };
  //----------------------------------------------------------------------------Pagination----------------------------------------------------------
  const handleChangePage = (event, newPage) => {
    // console.log(event);
    setPage(newPage);
  };

  const handleCreateDispatch = (data) => {
    dispatch(DispatchAction.setPreviewForDispatch(data));
    navigate("/dispatch");
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

  //--------------------------------------------------------------------Search Filter-----------------------------
  const searchHandle = (event) => {
    console.log(event);

    if (event === "All Load") {
      return (
        <>
          {
            setData(tableData)
            // , handlebuttonfilter(event)
          }
        </>
      );
    }
    const searchData = tableData.filter((word) => {
      console.log(word);
      return Object.values(word)
        .join(" ")
        .toLowerCase()
        .includes(event.toLowerCase());
    });
    setData(searchData);
    // handlebuttonfilter(event);
  };

  //------------------------------------------------------------------Status filter--------------------------------------
  const handleStatusFilter = (e) => {
    console.log(e);
    if (e === "All Load") {
      return <>{(setData(tableData), handlebuttonfilter(e))}</>;
    }

    const FilterData = tableData.filter((word) => {
      console.log(word.status);
      return word.status.toLowerCase() === e.toLowerCase();
    });

    console.log(FilterData);
    setData(FilterData);
    setPage(0);
    handlebuttonfilter(e);
  };

  //--------------------------------------------------------------------------show the option for status filter------------------------
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
                  (auth.role === "CO" && data === "Draft") ||
                  (auth.role === "D" && data === "Draft")
                    ? "none"
                    : ""
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

  //----------------------------------------------------------------------------handle status-------------------------------------------
  // const handleAcceptstatus = (id) => {
  //   const load_id = parseFloat(id);
  //   const data = {
  //     id: load_id,
  //     status: "accepted",
  //   };
  //   AxiosApi.patch("load/load/change_status/", data).then(() => {
  //     AxiosApi("load/load/").then((res) => {
  //       console.log(res);
  //       dispatch(LoadAction.setTableData(res));
  //       handlebuttonfilter("All Load");
  //     });
  //   });
  //   closeRef.current.closeModel();
  // };

  // const handlereject = (id) => {
  //   console.log(id);
  //   navigate("status", { state: { status: "rejected", id: id } });
  // };
  //----------------------------------------------------------------------- give option to filter according to carrier-------------
  // const CarrierFilter = () => {
  //   return (
  //     <select
  //       onChange={(e) => searchHandle(e.target.value)}
  //       className={style.statusFilter}
  //     >
  //       {tableData.map((data) => {
  //         // console.log(data.pickup);
  //         return (
  //           <option value={data.carrier} style={{ padding: "20px" }}>
  //             {data.carrier}
  //           </option>
  //         );
  //       })}
  //     </select>
  //   );
  // };

  // ------------------------------------------------------------------------show the reason and accept/reject button---------------------
  const handlebuttonfilter = (e) => {
    console.log(e);
    setStatusHeading(e);

    // if (e === "Rejected") {
    //   setreasoncell("");
    //   setcancelcell("none");
    //   setavailablecell("none");
    // } else

    if (e === "Draft") {
      setcancelcell("none");
      setdispatchcell("none");
      setactioncell("");
    } else if (e === "Cancelled") {
      // setavailablecell("none");
      // setreasoncell("none");
      setcancelcell("");
      setdispatchcell("");
      setactioncell("none");
    }
    //   else if (
    //   (e === "Available" && auth?.role === "CO") ||
    //   (e === "Available" && auth?.role === "D")
    // ) {
    //   setreasoncell("none");
    //   setcancelcell("none");
    //   setavailablecell("");
    //   }
    else if (e === "Accepted") {
      setactioncell("none");
      setcancelcell("none");
    } else if (e === "All Load") {
      setdispatchcell("");

      setcancelcell("none");
    }
  };
  //---------------------------------------------------------------------filter according to load number ---------------------------------------------------
  // const LoadNoFilter = () => {
  //   return (
  //     <select
  //       onChange={(e) => searchHandle(e.target.value)}
  //       className={style.statusFilter}
  //     >
  //       <option value="All Load" style={{ padding: "20px" }}>
  //         All Load
  //       </option>
  //       {tableData.map((data) => {
  //         return (
  //           <option value={data.load_no} style={{ padding: "20px" }}>
  //             {data.load_no}
  //           </option>
  //         );
  //       })}
  //     </select>
  //   );
  // };
  //----------------------------------------------------------------------HANDLE ADD NEW LOAD-------------------------------------------------------------
  const handleAddNew = () => {
    // AxiosApi('load/load/new_load/')
    //   .then((res) => dispatch(LoadAction.setLoadNum(res)))
    //   .then(() => navigate('/loadtable/createload'));
    navigate("/loadtable/createload");
  };
  //----------------------------------------------------------------------------HANDLE EDIT LOAD---------------------------------------------------------------
  const handleEdit = (id) => {
    AxiosApi("load/accessorial_fee/")
      .then((res) => dispatch(LoadAction.setLoadNum(res)))
      .then(() =>
        dispatch(
          LoadAction.setPreview(...tableData.filter((item) => item.id === id))
        )
      )
      .then(() => navigate("/loadtable/createload"));
  };

  //-----------------------------------------------------------------------HANDLE EXPORT DATA-------------------------------------------------------

  // console.log(tableData.sort((a, b) => a.id - b.id));
  const exportData = async (tableData) => {
    const Data = [];
    console.log(tableData);
    await tableData.map((res, index) => {
      Data.push({
        "Date/Time": dayjs(res.creation_datetime).format("YYYY-MM-DD HH:mm"),
        "Load No": res.load_no,
        Status: res.status,
        "Carrier Name": res.carrier_name,
        "Pickup Location": res?.pickup_location[0]?.address?.line_1,
        "Dropoff Location":
          res?.dropoff_location[res?.dropoff_location.length - 1]?.address
            ?.line_1,
        "Total Mile": res?.total_mile,
      });
    });
    // console.log(Data);
    csvDownload(Data);
  };

  return (
    <>
      <div className={`${style.loadbuttonfilter} ${style.buttonfilter}`}>
        {statusData.map((data, index) => (
          <button
            value={data}
            key={index}
            onClick={(e) => handleStatusFilter(e.target.value)}
            style={{
              display: `${
                (auth?.role === "CO" && data === "Draft") ||
                (auth?.role === "D" && data === "Draft") ||
                (auth?.role === "B" && data === "Draft")
                  ? "none"
                  : ""
              }`,
            }}
          >
            {data}
          </button>
        ))}
      </div>
      <p className={style.statusheading}>{StatusHeading}</p>

      <div className={style.buttonDiv}>
        <Button
          variant="contained"
          style={{ margin: " 0 1rem" }}
          onClick={() => exportData(tableData)}
        >
          Export
        </Button>

        <Button
          variant="contained"
          onClick={handleAddNew}
          style={{
            display: `${
              auth.role === "DM" || auth.role === "DISP" ? "" : "none"
            }`,
          }}
        >
          <Add /> Add New Load
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

      <div>
        {render ? (
          <table id="loadTable" className={style.mytable}>
            <thead
              sx={{ margin: "0px", padding: "0px" }}
              className={style.thead}
            >
              <tr>
                <td>DATE/TIME</td>
                <td>
                  LOAD
                  {/* {LoadNoFilter()} */}
                </td>
                <td>
                  STATUS
                  {StatusFilter()}
                </td>
                <td>
                  CARRIER
                  {/* {CarrierFilter()} */}
                </td>
                <td>
                  PICKUP
                  {/* {PickUpFilter()} */}
                </td>
                <td>DELIVERY</td>
                <td>MILES</td>
                {/* <td>LINEHAUL</td> */}

                {/* <td>Action</td> */}
                {/* <td style={{ display: availablecell }}>Accept/Reject</td> */}
                {/* <td style={{ display: reasoncell }}>Reason</td> */}
                <td style={{ display: cancelcell }}>Reason</td>
                <td style={{ display: actioncell }}>Action</td>
                <td style={{ display: dispatchcell }}>DISPATCH</td>
              </tr>
            </thead>

            <tbody className={style.tbody}>
              {Data.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              ).map((data, index) => {
                return (
                  <tr key={index} className={style.datatr}>
                    <td>
                      <button
                        className={style.navButton}
                        value={data.id}
                        onClick={(e) => {
                          handleNavigation(e.target.value);
                        }}
                      >
                        {data.date}
                        {dayjs(data?.creation_datetime).format(
                          "YYYY-MM-DD HH:mm"
                        )}
                        <br />
                        {data.time}
                      </button>
                    </td>

                    <td
                      onClick={() => {
                        handleNavigation(data.id);
                      }}
                    >
                      {data.load_no}
                    </td>

                    <td
                      onClick={() => {
                        handleNavigation(data.id);
                      }}
                      sx={{ paddingLeft: "0px" }}
                    >
                      <p
                        id={style.status}
                        className={
                          data.status.toLowerCase() === "completed"
                            ? style.avail
                            : data.status.toLowerCase() === "rejected"
                            ? style.reject
                            : data.status.toLowerCase() === "draft"
                            ? style.inDraft
                            : data.status.toLowerCase() === "dispatched"
                            ? style.dispatch
                            : data.status.toLowerCase() === "trip started"
                            ? style.dispatch
                            : data.status.toLowerCase() === "picked up"
                            ? style.picked_up
                            : data.status.toLowerCase() === "arrived at pick-up"
                            ? style.arrived_at_pick_up
                            : data.status.toLowerCase() ===
                              "arrived at delivery"
                            ? style.arrived_at_delivery
                            : data.status.toLowerCase() === "delivered"
                            ? style.delivered
                            : data.status.toLowerCase() === "cancelled"
                            ? style.cancel
                            : data.status.toLowerCase() === "accepted"
                            ? style.accepted
                            : ""
                        }
                      >
                        {data?.status === "Trip Started"
                          ? "Dispatched"
                          : data?.status}
                      </p>
                    </td>
                    <td
                      onClick={() => {
                        handleNavigation(data.id);
                      }}
                    >
                      {data.carrier_name}
                    </td>
                    <td
                      onClick={() => {
                        handleNavigation(data.id);
                      }}
                    >
                      {data?.pickup_location[0]?.address?.city}
                      <br />
                      {data?.pickup_location[0]?.address?.zipcode}
                    </td>
                    <td
                      onClick={() => {
                        handleNavigation(data.id);
                      }}
                    >
                      {data?.dropoff_location[0]?.address?.city}
                      <br />
                      {data?.dropoff_location[0]?.address?.zipcode}
                    </td>
                    <td
                      onClick={() => {
                        handleNavigation(data.id);
                      }}
                    >
                      {data?.total_mile}
                    </td>
                    {/* <td>
                        
                          {data?.linehaul}
                        
                      </td> */}

                    {/* -------------------------------------------------------comment view details ---------------------------------------------------- */}

                    {/* 
                      <td   onClick={() => {
                          handleNavigation(data.id);
                        }} style={{ display: reasoncell }}>
                        <p>{data?.status_reason}</p>
                      </td> */}
                    <td
                      onClick={() => {
                        handleNavigation(data.id);
                      }}
                      style={{ display: cancelcell }}
                    >
                      <p>{data?.status_reason}</p>
                    </td>
                    {/* //-----------------Accept reject button------------------------------------------------------- */}
                    {/* <td style={{ display: availablecell }}>
                       
                        <ConfirmModal
                          type={<AddTaskOutlined />}
                          title="Are you sure you want to Accept the Load ?"
                          subtitle="This action cannot be undone by you "
                          button1="Yes"
                          button2="No"
                          ref={closeRef}
                          className={style.acceptButton}
                          handleYes={() => handleAcceptstatus(data.id)}
                        />
                
                        <ConfirmModal
                          type={<CancelOutlined />}
                          title="Are you sure you want to reject the Load ?"
                          subtitle="This action cannot be undone by you "
                          button1="Yes"
                          button2="No"
                          className={style.rejectButton}
                          handleYes={() => handlereject(data.id)}
                        />
                      </td> */}

                    {/* <Button>
                      <Cancel />
                    
                    <Button>
                      <CheckBoxOutlined />
                    </Button> */}
                    <td style={{ display: actioncell }}>
                      <button
                        onClick={() => {
                          handleEdit(data?.id);
                        }}
                        className={style.editButton}
                        style={{
                          display: `${
                            (data.status === "draft" && auth?.role === "DM") ||
                            (data.status === "draft" && auth?.role === "DISP")
                              ? ""
                              : "none"
                          }`,
                        }}
                      >
                        <i className="bx bx-edit"></i>
                      </button>
                    </td>
                    <td style={{ display: dispatchcell }}>
                      {/* <Link
                          to={{ pathname: "/loaddetails", state: `${data.id}` }}
                        > */}
                      <Button
                        value={data?.dispatch?.id}
                        // style={{
                        //   display: `${data.status !== "draft" ? "" : "none"}`,
                        // }}
                        onClick={() => {
                          data.status === "Accepted"
                            ? handleCreateDispatch(data)
                            : navigate("/dispatchtable/dispatchsummary", {
                                state: data?.dispatch?.id,
                              });
                        }}
                      >
                        {`${
                          (data.status === "Accepted" && auth?.role === "DM") ||
                          (data?.status === "Accepted" && auth?.role === "DISP")
                            ? "+ Create Dispatch"
                            : data?.dispatch?.id === undefined
                            ? ""
                            : "View Dispatch"
                        }`}
                      </Button>
                      {/* </Link> */}
                    </td>
                  </tr>
                );
              })}

              <TablePagination
                rowsPerPageOptions={[10]}
                component="div"
                count={Data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className={style.paginationForMobile}
              />
            </tbody>
          </table>
        ) : (
          "Loading The Load"
        )}
      </div>

      {/* </TableContainer> */}
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
    </>
  );
};
export default LoadTable;
