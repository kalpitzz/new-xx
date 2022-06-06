import React, {
  useRef,
  forwardRef,
  useEffect,
  useState,
  useImperativeHandle,
} from "react";
import { useNavigate } from "react-router-dom";
import FormikControl from "../../components/Formfield/formikControl";
import Style from "./dispatch.module.css";
import { Formik, Form, Field } from "formik";
import AlertModel from "../../components/modals/AlertModel";
import PreviewField from "../../components/previewTextField/textField";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import LoadAction from "../../redux/actions/LoadAction";
import DispatchAction from "../../redux/actions/DispatchAction";
import useAxios from "../../hooks/useAxios";
import * as Yup from "yup";

const Dispatch = forwardRef(
  (
    {
      driverFormHandler,
      truckFormHandler,
      trailerFormHandler,
      dispatchDetails,
    },
    ref
  ) => {
    const status = [
      { value: "", key: "Select Status" },
      { value: "arrived_at_pick_up", key: "At Pick-Up" },
      { value: "picked_up", key: "Picked Up" },
      { value: "arrived_at_delivery", key: "Arrived at Delivery" },
      { value: "deliverd", key: "Delivered" },
    ];

    const alertRef = useRef();
    const AxiosApi = useAxios();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [trailerList, setTrailer] = useState([
      {
        key: "Loading...",
        value: "",
        company: "",
        truck: "",
        driver: "",
        trailer: "",
      },
    ]);
    const [driverList, setDriver] = useState([
      {
        key: "Loading...",
        value: "",
        company: "",
        truck: "",
        driver: "",
        trailer: "",
      },
    ]);
    const [truckList, setTruck] = useState([
      {
        key: "Loading...",
        value: "",
        company: "",
        truck: "",
        driver: "",
        trailer: "",
      },
    ]);
    const [dispatchNum, setDispatchNum] = useState("");
    const [dropTrailerVal, setDropTrailer] = useState(false);
    const dispatch_load_data = useSelector(
      (state) => state.DispatchReducer.dispatchLoadPreview
    );
    console.log("dispatchD", dispatchDetails);
    // console.log('disP', dispatch_load_data);
    const handleback = () => {
      navigate(-1);
    };
    // console.log('dips', dispatch_load_data);
    let previewData = dispatchDetails
      ? dispatchDetails?.load
      : dispatch_load_data;
    let trailerCount = 0;
    let trailer = [
      {
        key: "Select Trailer",
        value: "",
        company: "",
        truck: "",
        driver: "",
        trailer: "",
      },
    ];
    // console.log('dispatch', dispatchDetails);

    const modifyStatus = (status) => {
      switch (status) {
        case "Dispatched":
          return "dispatched";
        case "Trip Started":
          return "trip_started";
        case "Arrived At Pick-up":
          return "arrived_at_pick_up";
        case "Trip Started":
          return "trip_started";
        case "Picked Up":
          return "picked_up";
        case "Arrived At Delivery":
          return "arrived_at_delivery";
        case "Delivered":
          return "delivered";
        case "Cancelled":
          return "cancelled";
        case "Completed":
          return "completed";
        default:
          return "";
      }
    };

    // const modifyStatus = (value) => {
    //   const withOutUnderScore = value.replace(/_/g, "");
    //   console.log(withOutUnderScore);
    //   return withOutUnderScore;
    // };
    let initialValue;
    if (dispatchDetails) {
      initialValue = {
        dispatch_no: dispatchDetails?.dispatch_no,
        load: dispatchDetails?.load.id,
        status: modifyStatus(dispatchDetails?.status),
        driver: dispatchDetails?.driver.id,
        truck: dispatchDetails?.truck.id,
        trailer:
          dispatchDetails?.trailer === null ? "" : dispatchDetails?.trailer.id,
        drop_trailer: dispatchDetails?.trailer === null ? true : false,
      };
    } else {
      initialValue = {
        dispatch_no: "",
        load: "",
        status: "dispatched",
        driver: "",
        truck: "",
        trailer: "",
        drop_trailer: false,
      };
    }

    async function callTrailerApi() {
      trailerCount = trailerCount + 1;
      await AxiosApi("/equipments/trailer/")
        .then((res) => {
          res.map((data) =>
            trailer.push({
              key: data.unit_number,
              value: data.id,
              company: data.company,
              truck: data.truck,
              driver: data.driver,
              trailer: data.id,
            })
          );
        })
        .catch((err) => {
          toast.error("Failed to Fetch Trailer Data!Reconnecting...");
          if (trailerCount < 2) {
            callTrailerApi();
          }
        });
    }

    let driverCount = 0;
    let driver = [
      {
        key: "Select Driver",
        value: "",
        company: "",
        truck: "",
        driver: "",
        trailer: "",
      },
    ];
    async function callDriverApi() {
      driverCount = driverCount + 1;
      await AxiosApi("/drivers/")
        .then((res) => {
          res.map((data) =>
            driver.push({
              key: `${data.user.first_name} ${data.user.last_name}`,
              value: data.id,
              company: data.company_id,
              truck: data.truck,
              trailer: data.trailer,
              driver: data.id,
            })
          );
        })
        .catch((err) => {
          toast.error("Failed to Fetch Driver Data!Reconnecting...");
          if (driverCount < 2) {
            callDriverApi();
          }
        });
    }

    let truckCount = 0;
    let truck = [
      {
        key: "Select Truck",
        value: "",
        company: "",
        truck: "",
        driver: "",
        trailer: "",
      },
    ];
    async function callTruckApi() {
      truckCount = truckCount + 1;
      await AxiosApi("/equipments/truck/")
        .then((res) => {
          res.map((data) =>
            truck.push({
              key: data.unit_number,
              value: data.id,
              company: data.company,
              driver: data.driver,
              trailer: data.trailer,
              truck: data.id,
            })
          );
        })
        .catch((err) => {
          toast.error("Failed to Fetch Driver Data!Reconnecting...");
          if (truckCount < 2) {
            callTruckApi();
          }
        });
    }

    async function callDispatchNumApi() {
      await AxiosApi("/dispatch/new_dispatch/").then((res) =>
        setDispatchNum(res.dispatch_no)
      );
    }

    useEffect(() => {
      if (!dispatchDetails) {
        callDispatchNumApi();
      }
      callTrailerApi().then(() => setTrailer(trailer));
      callDriverApi().then(() => setDriver(driver));
      callTruckApi().then(() => setTruck(truck));
    }, []);

    useImperativeHandle(ref, () => ({
      callDriverHandler() {
        callDriverApi().then(() => setDriver(driver));
      },
      callTruckHandler() {
        callTruckApi().then(() => setTruck(truck));
      },
      callTrailerHandler() {
        callTrailerApi().then(() => setTrailer(trailer));
      },
    }));

    const validation = Yup.object().shape({
      driver: Yup.string().required("Required"),
      truck: Yup.string().required("Required"),
      trailer: !dropTrailerVal ? Yup.string().required("Required") : "",
    });
    const checkForNull = (value) => {
      return value === null ? "" : value;
    };

    const replaceString = (string) => {
      console.log("string", string);
      if (string == "" || string === undefined) return "";
      let newString = string.replaceAll("_", " ");
      return capitalize(newString);
    };

    const capitalize = (string) => {
      if (string == "") return "";
      let newString = string.charAt(0).toUpperCase() + string.slice(1);
      return newString;
    };

    return (
      <main>
        {!dispatchDetails ? (
          <div id={Style.title}>
            <i className="bx bx-left-arrow-alt bx-sm" onClick={handleback}></i>
            <h2>DISPATCH-{dispatchNum}</h2>
          </div>
        ) : null}

        {/* <input type={'search'} placeholder={'Search'} id={Style.search} /> */}
        <Formik
          initialValues={initialValue}
          validationSchema={validation}
          onSubmit={(values) => {
            let submitObj = { ...values };
            submitObj.dispatch_no = dispatchDetails
              ? dispatchDetails.dispatch_no
              : dispatchNum;
            submitObj.load = previewData?.id;
            if (dispatchDetails) {
              AxiosApi.patch(
                `/dispatch/${dispatchDetails.id}/`,
                submitObj
              ).then((res) => {
                dispatch(
                  DispatchAction.editdispatchTableData({
                    id: dispatchDetails.id,
                    data: res,
                  })
                );
                alertRef.current.showModel();
              });
            } else {
              AxiosApi.post("/dispatch/", submitObj).then((res) => {
                if (res.message) {
                  alertRef.current.setTitle(
                    `Your Updated Dispatch No is ${res.message.substring(
                      res.message.indexOf(":") + 1
                    )}`
                  );
                }
                dispatch(
                  LoadAction.setLoadStatus({
                    status: res.status,
                    id: previewData?.id,
                  })
                );
                alertRef.current.showModel();
              });
            }
          }}
        >
          {(formik) => (
            <Form>
              <div className={Style.AllWrap}>
                <section className={Style.card}>
                  <h3>Driver Details</h3>
                  <div id={Style.line}></div>
                  <div className={Style.wrapField}>
                    <FormikControl
                      control="select"
                      label="Select Driver*"
                      name="driver"
                      options={driverList}
                      wrap={true}
                      clickHandler={driverFormHandler}
                      onChange={(e) => {
                        formik.handleChange("driver")(e.target.value);

                        let trailer = trailerList.filter(
                          (item) => item.driver === e.target.value
                        );
                        let truck = truckList.filter(
                          (item) => item.driver === e.target.value
                        );

                        if (trailer.length > 0) {
                          if (!dropTrailerVal) {
                            formik.setFieldValue("trailer", trailer[0].trailer);
                          }
                        } else {
                          formik.setFieldValue("trailer", "");
                        }
                        if (truck.length > 0) {
                          formik.setFieldValue("truck", truck[0].truck);
                        } else {
                          formik.setFieldValue("truck", "");
                        }
                      }}
                    />
                  </div>
                </section>
                <section className={Style.card}>
                  <h3>Truck Details</h3>
                  <div id={Style.line}></div>
                  <div className={Style.wrapField}>
                    <FormikControl
                      control="select"
                      label="Select Truck*"
                      name="truck"
                      options={truckList}
                      wrap={true}
                      clickHandler={truckFormHandler}
                    />
                  </div>
                </section>
                <section className={Style.card}>
                  <h3>Trailer Details</h3>
                  <div id={Style.line}></div>
                  <div className={Style.wrapField}>
                    <FormikControl
                      control="select"
                      label="Select Trailer*"
                      name="trailer"
                      options={trailerList}
                      wrap={true}
                      clickHandler={trailerFormHandler}
                      disabled={formik.values.drop_trailer ? true : false}
                    />
                    <div id={Style.dropTrailer}>
                      <Field
                        type="checkbox"
                        onClick={() => {
                          setDropTrailer((prev) => !prev);
                          formik.setFieldValue(
                            "drop_trailer",
                            !formik.values.drop_trailer
                          );
                          formik.setFieldValue("trailer", "");
                        }}
                        checked={formik.values.drop_trailer === true}
                        name="drop_trailer"
                        id="drop_trailer"
                      />
                      <label htmlFor="drop_trailer">Drop trailer</label>
                    </div>
                  </div>
                </section>
              </div>

              <section id={Style.buttonSection}>
                <div
                  id={`${Style.buttonWraper}`}
                  className={Style.dispatchButtonWrapper}
                >
                  <button type="reset">Reset All</button>
                  <AlertModel
                    type={`Assign Driver and Equipment`}
                    title={`Successfully Assigned.`}
                    button1="Close"
                    button2="Okay!"
                    typeoff="button"
                    ref={alertRef}
                    handleClick={formik.submitForm}
                    handleOkay={() => console.log("Saved")}
                    navigateTo={-1}
                  />
                </div>
              </section>

              <section className={Style.FreightWrap}>
                <h3>Freight Details</h3>
                <section className={Style.card}>
                  <div className={Style.LoadWrapDispatch}>
                    <PreviewField
                      label={"Load No:"}
                      details={previewData?.load_no}
                    />
                    <PreviewField
                      label={"Load Type:"}
                      details={replaceString(previewData?.load_type)}
                    />
                    <PreviewField
                      label={"Trailer Type:"}
                      details={replaceString(previewData?.trailer_type)}
                    />
                  </div>
                  {previewData?.freight_details.map(
                    (freight_details, index) => (
                      <div key={index}>
                        <h4>{`Freight ${index + 1}`}</h4>
                        <div id={Style.line}></div>
                        <div className={Style.FreightWrapDispatch}>
                          <PreviewField
                            label={"Description:"}
                            details={freight_details?.description}
                          />
                          <PreviewField
                            label={"Quantity:"}
                            details={`${checkForNull(
                              freight_details?.quantity
                            )} ${freight_details?.quantity_type_name}`}
                          />
                          <PreviewField
                            label={"Declared Value:"}
                            details={`${
                              freight_details?.declared_value
                                ? "$" + freight_details?.declared_value
                                : ""
                            }`}
                          />
                          <PreviewField
                            label={"Weight:"}
                            details={`${checkForNull(
                              freight_details?.weight
                            )} ${freight_details?.weight_unit_name}`}
                          />
                          <PreviewField
                            label={"Dimensions:"}
                            details={`${checkForNull(
                              freight_details?.length
                            )} X ${checkForNull(
                              freight_details?.width
                            )} X ${checkForNull(freight_details?.height)} ${
                              freight_details?.dimensions_unit
                            }`}
                          />
                          <PreviewField
                            label={"Comment:"}
                            details={`${freight_details?.comment}`}
                          />
                        </div>
                      </div>
                    )
                  )}
                </section>
              </section>
            </Form>
          )}
        </Formik>
      </main>
    );
  }
);

export default Dispatch;
