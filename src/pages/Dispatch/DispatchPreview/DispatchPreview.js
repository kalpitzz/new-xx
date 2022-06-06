import React, { useState, useEffect } from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Tab from '@mui/material/Tab';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';

import Box from '@mui/material/Box';
import DispatchForm from '../dispatch_form';
import DriverStatus from '../DriverCheckCall/DriverStatus';
import DispatchSummery from '../Dispatchsummary/DispatchSummary';
import CheckCallTable from '../CheckCallTable/CheckCallTable';
import TripSheet from '../TripSheet';
import dayjs from 'dayjs';
// import Documents from '../../LOADS/PreviewForm/PreiewComponent/Documents';
import Notes from '../../Loads/PreviewForm/PreiewComponent/Notes';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import useAxios from '../../../hooks/useAxios';
import style from './DispatchPreview.module.css';
import useAuth from '../../../hooks/useAuth';
import DispatchAction from '../../../redux/actions/DispatchAction';

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DispacthPreview = () => {
  const [Data, setData] = useState([{}]);
  // const [checkCallData, setCheckCallData] = useState('');
  // const [noteData, setNoteData] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const AxiosApi = useAxios();

  // const AxiosApi = useAxios();
  const dispatch = useDispatch();
  const { auth } = useAuth();

  const TableData = useSelector((state) => {
    return state.DispatchReducer.dispatchTableData;
  });

  const final = (TableData) => {
    if (TableData === undefined) {
      return '';
    } else {
      const finalD = TableData.filter((res) => {
        return res?.id === parseInt(location.state);
      });
      return finalD;
    }
  };

  //---------------------------------------------------------use effect--------------------------------------------------------------------
  useEffect(() => {
    if (!TableData) {
      AxiosApi('dispatch/').then((res) => {
        dispatch(DispatchAction.setdispatchTableData(res));
        setData(final(res));
      });
    }
    setData(final(TableData));
    let temp = final(TableData);
    console.log('TableData', temp);
    dispatch(DispatchAction.setPreviewForDispatch(temp ? temp[0]?.load : ''));
    // callCheckApi();
  }, []);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //---------------------------------------------------------------handle edit----------------------------------------------------

  console.log(Data[0]?.status !== 'Cancelled', Data[0]?.status);
  const handleCancel = () => {
    let obj = {
      dispatch: Data[0]?.id,
      status: 'cancelled',
      current_date_time: dayjs(new Date()).format(),
    };
    // AxiosApi.post(`dispatch/checkcall/?dispatch_id=${Data[0].id}`, obj).then(
    //   (res) => {
    //     setData([{ ...Data[0], status: res.status }]);
    //   }
    // );
  };
  const handleDelivered = (type) => {
    let obj = {
      dispatch: Data[0]?.id,
      status: type,
      current_date_time: dayjs(new Date()).format(),
    };
    AxiosApi.post(`dispatch/checkcall/?dispatch_id=${Data[0].id}`, obj).then(
      (res) => {
        setData([{ ...Data[0], status: res.status }]);
      }
    );
  };

  return (
    <>
      <div className={style.summeryLoadDetail}>
        <div className={style.summaryArrowMainDiv}>
          <div className={style.summaryArrowDiv}>
            {console.log('Data', Data)}
            <Button
              onClick={() => {
                navigate(-1);
              }}
              className={style.summaryArrow}
            >
              <ArrowBackIcon />
            </Button>

            <p>
              {Data[0]?.load?.carrier_name}({Data[0]?.dispatch_no})
            </p>
          </div>
          <Grid item style={{ margin: 'auto' }}>
            <div
              id={style.previewstatus}
              className={
                Data[0]?.status === 'Completed'
                  ? style.avail
                  : Data[0]?.status === 'Dispatched'
                  ? style.dispatch
                  : Data[0]?.status === 'Trip Started'
                  ? style.dispatch
                  : Data[0]?.status === 'Picked Up'
                  ? style.picked_up
                  : Data[0]?.status === 'Arrived At Pick-up'
                  ? style.arrived_at_pick_up
                  : Data[0]?.status === 'Arrived At Delivery'
                  ? style.arrived_at_delivery
                  : Data[0]?.status === 'Delivered'
                  ? style.delivered
                  : Data[0]?.status === 'Cancelled'
                  ? style.cancel
                  : ''
              }
            >
              {Data[0]?.status === 'Trip Started'
                ? 'Dispatched'
                : Data[0]?.status}
            </div>
          </Grid>
        </div>
        <div
          className={style.editCancelLoadDiv}
          style={{
            display:
              (auth?.role === 'DM' && Data[0]?.status !== 'Cancelled') ||
              (auth?.role === 'DISP' && Data[0]?.status !== 'Cancelled')
                ? ''
                : 'none',
          }}
        >
          {/* <Grid item md={2}> */}
          <Link
            to="/loadtable/status"
            state={{
              status: 'cancelled',
              id: location.state,
              from: 'dispatch',
            }}
          >
            {/* && Data[0]?.status !== 'Delivered */}
            <Button
              size="large"
              variant="contained"
              className={`btn_card1 ${style.summaryCancelButton}`}
              style={{
                display:
                  (auth?.role === 'DM' &&
                    Data[0]?.status !== 'Delivered' &&
                    Data[0]?.status !== 'Completed') ||
                  (auth?.role === 'DISP' &&
                    Data[0]?.status !== 'Delivered' &&
                    Data[0]?.status !== 'Completed')
                    ? ''
                    : 'none',
              }}
              onClick={handleCancel}
            >
              <i className={`bx bx-x ${style.bxCheck}`}></i> Cancel
            </Button>
          </Link>
          {/* </Grid> */}
          <div>
            <Button
              size="large"
              variant="contained"
              className={`btn_card1  ${style.summaryCancelButton}`}
              onClick={() => handleDelivered('delivered')}
              style={{
                display:
                  (auth?.role === 'DM' &&
                    Data[0]?.status !== 'Delivered' &&
                    Data[0]?.status !== 'Completed') ||
                  (auth?.role === 'DISP' &&
                    Data[0]?.status !== 'Delivered' &&
                    Data[0]?.status !== 'Completed')
                    ? ''
                    : 'none',
              }}
            >
              <i className={`bx bx-check ${style.bxCheck}`}></i>
              Delivered
            </Button>
          </div>
          <Button
            size="large"
            variant="contained"
            className={`btn_card1  ${style.summaryCancelButton}`}
            onClick={() => handleDelivered('completed')}
            style={{
              display:
                (auth?.role === 'DM' && Data[0]?.status !== 'Completed') ||
                (auth?.role === 'DISP' && Data[0]?.status !== 'Completed')
                  ? ''
                  : 'none',
            }}
          >
            <i className={`bx bx-check ${style.bxCheck}`}></i>
            completed
          </Button>
        </div>
      </div>

      <Grid item>
        <Box sx={{ width: '100%' }}>
          <Box
            sx={{
              borderBottom: 1,
              borderColor: 'divider',
              fontSize: '13px',
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              className={style.Tabs}
            >
              <Tab
                label="Summary"
                {...a11yProps(0)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Driver & Equipments"
                {...a11yProps(1)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Routing"
                {...a11yProps(2)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Check Call"
                {...a11yProps(3)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Trip Sheet"
                {...a11yProps(4)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Documents"
                {...a11yProps(5)}
                className={style.summaryNavBar}
              />
              <Tab
                label="Notes"
                {...a11yProps(6)}
                className={style.summaryNavBar}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <DispatchSummery />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <DispatchForm dispatchDetails={Data} />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <DriverStatus dispatchDetails={Data} />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <CheckCallTable dispatchDetails={Data} />
          </TabPanel>
          <TabPanel value={value} index={4}>
            <TripSheet dispatchDetails={Data} />
          </TabPanel>
          <TabPanel value={value} index={5}>
            <Notes name={'document'} from="dispatch_document" />
          </TabPanel>
          <TabPanel value={value} index={6}>
            <Notes from={'dispatch_note'} />
          </TabPanel>
        </Box>
      </Grid>
    </>
  );
};

export default DispacthPreview;
