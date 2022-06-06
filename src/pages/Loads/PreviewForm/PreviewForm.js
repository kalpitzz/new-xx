import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";

import Button from "@material-ui/core/Button";
//import "./style.css";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
//import abc from "dan-styles/custom-components/custom-styles.scss";

import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";

//import TabPanel from "@material-ui/lab/TabPanel";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import LoadSummary from "./PreiewComponent/LoadSummary";

import Documents from "./PreiewComponent/Documents";
import Notes from "./PreiewComponent/Notes";
import { ExpandMore } from "@material-ui/icons";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core";

import { Link, useLocation, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import useAxios from "../../../hooks/useAxios";
import LoadReducer from "../../../redux/reducers/LoadReducer";
import LoadAction from "../../../redux/actions/LoadAction";
import style from "../LoadTablePage/Loads.module.css";
import useAuth from "../../../hooks/useAuth";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Loads = () => {
  const [Data, setData] = useState([
    { carrier_name: "", load_no: "", status: "" },
  ]);
  const location = useLocation();
  const navigate = useNavigate();
  console.log(location.state);

  // const AxiosApi = useAxios();
  const dispatch = useDispatch();
  const { auth } = useAuth();

  const TableData = useSelector((state) => {
    return state.LoadReducer.tableData;
  });
  // const previewData = useSelector((state) => {
  //   console.log(state.LoadReducer.loadPreview);
  //   return state.LoadReducer.loadPreview;
  // });
  // console.log(previewData);

  const final = (TableData) => {
    console.log(TableData === undefined);
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
  //---------------------------------------------------------use effect--------------------------------------------------------------------
  useEffect(() => {
    setData(final(TableData));
  }, []);

  console.log(TableData);
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const AxiosApi = useAxios();
  //---------------------------------------------------------------handle edit----------------------------------------------------
  const handleEdit = () => {
    AxiosApi("load/accessorial_fee/")
      .then((res) => dispatch(LoadAction.setLoadNum(res)))
      .then(() => dispatch(LoadAction.setPreview(Data[0])))
      .then(() => navigate("/loadtable/createload"));
  };

  return (
    <>
      <div className={style.summeryLoadDetail}>
        <div className={style.summaryArrowDiv}>
          <Button
            onClick={() => {
              navigate(-1);
            }}
            className={style.summaryArrow}
          >
            <ArrowBackIcon />
          </Button>

          <p>
            {Data[0]?.carrier_name}({Data[0]?.load_no})
          </p>

          <Grid item>
            <div
              id={style.previewstatus}
              className={
                Data[0]?.status.toLowerCase() === "completed"
                  ? style.avail
                  : Data[0]?.status.toLowerCase() === "rejected"
                  ? style.reject
                  : Data[0]?.status.toLowerCase() === "draft"
                  ? style.inDraft
                  : Data[0]?.status.toLowerCase() === "dispatched"
                  ? style.dispatch
                  : Data[0]?.status.toLowerCase() === "trip started"
                  ? style.dispatch
                  : Data[0]?.status.toLowerCase() === "picked up"
                  ? style.picked_up
                  : Data[0]?.status.toLowerCase() === "arrived at pick-up"
                  ? style.arrived_at_pick_up
                  : Data[0]?.status.toLowerCase() === "arrived at delivery"
                  ? style.arrived_at_delivery
                  : Data[0]?.status.toLowerCase() === "delivered"
                  ? style.delivered
                  : Data[0]?.status.toLowerCase() === "cancelled"
                  ? style.cancel
                  : Data[0]?.status.toLowerCase() === "accepted"
                  ? style.accepted
                  : ""
              }
            >
              {console.log(Data[0]?.status)}
              {Data[0]?.status === "Trip Started"
                ? "Dispatched"
                : Data[0]?.status}
            </div>
          </Grid>
        </div>
        <div className={style.editCancelLoadDiv}>
          {/* <Grid item md={2}> */}
          <Link
            to="/loadtable/status"
            state={{ status: "cancelled", id: location.state }}
          >
            <Button
              size="larger"
              variant="contained"
              className={`btn_card1 ${style.summaryCancelButton}`}
              style={{
                display: `${
                  (auth?.role === "DM" && Data[0]?.status === "Accepted") ||
                  (auth?.role === "DISP" && Data[0]?.status === "Accepted")
                    ? ""
                    : "none"
                }`,
              }}
            >
              X Cancel Load
            </Button>
          </Link>
          {/* </Grid> */}
          <Grid item md={2}>
            <Button
              size="larger"
              variant="contained"
              className={`btn_card1 ${style.summaryCancelButton}`}
              onClick={handleEdit}
              style={{
                display: `${
                  (auth?.role === "DM" && Data[0]?.status === "draft") ||
                  (auth?.role === "DISP" && Data[0]?.status === "draft")
                    ? ""
                    : "none"
                }`,
              }}
            >
              Edit Load
            </Button>
          </Grid>
        </div>
      </div>

      <Grid item>
        <Box sx={{ width: "100%" }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              fontSize: "13px",
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="Load Summary"
                {...a11yProps(0)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Documents"
                {...a11yProps(1)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Notes"
                {...a11yProps(2)}
                className={style.summaryNavBar}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <LoadSummary />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Documents />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Notes />
          </TabPanel>
        </Box>
      </Grid>
    </>
  );
};

export default Loads;

// const data = {
//   shippername: "",
//   pickup: {
//     address1: {
//       zip: 123,
//       city: "",
//     },
//     address2: {
//       zip: 123,
//       city: "",
//     },
//   },
// };

// const new_Address = {
//   zip: 123,
//   city: "",
// };
