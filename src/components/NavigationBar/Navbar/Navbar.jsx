import React, { useRef } from 'react';
import styles from '../../css/navbar.module.css';
import ThemeMenu from '../../ThemeMenu/ThemeMenu';
import user_image from '../../../assets/images/user_icon.png';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import BellNotification from '../Bell-notification/BellNotification';
import useAuth from '../../../hooks/useAuth';
import useAxios from '../../../hooks/useAxios';
import DispatchAction from '../../../redux/actions/DispatchAction';
import {
  loadBingApi,
  Microsoft,
} from '../../../pages/Dispatch/BingMapLoader.ts';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import './navbar.css';
const renderUserToggle = (curr_user) => {
  return (
    <div className={styles.topnav__right_user}>
      <div className={styles.topnav__right_user__image}>
        {curr_user.image ? (
          <img src={curr_user.image} alt="User" />
        ) : (
          <img src={curr_user.image} alt="user" />
        )}
      </div>
      <h2 className={styles.topnav__right_user__name}>
        {curr_user.display_name?.first_name}
        {console.log('curr_user', curr_user)}
      </h2>
    </div>
  );
};

const DEFAULT_NOTIFICATION = {
  image:
    'https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png',
  message: 'Notification one.',
  detailPage: '/events',
  receivedTime: '12h ago',
};

function Navbar() {
  const AxiosApi = useAxios();
  const dispatch = useDispatch();
  const [curr_user, setCurr_User] = useState({
    display_name: JSON.parse(localStorage.getItem('user')),
    image: user_image,
  });

  const socketDataStore = useSelector((state) => state.DispatchReducer.socket);
  // if (socketDataStore) {
  //   socketDataStore.onmessage = function (event) {
  //     let message = JSON.parse(event.data);
  //     console.log('message', message);
  //     switch (message.type) {
  //       case 'driver_sos':
  //         {
  //           console.log('message', message);
  //           toast.warn(`Driver raised 'SOS'!`, {
  //             position: 'top-center',
  //             autoClose: false,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             toastClassName: 'dark-toast',
  //           });
  //         }
  //         break;
  //       case 'get_current_location':
  //         {
  //           console.log('HEllo');
  //           navigator.geolocation.getCurrentPosition(function (position) {
  //             loadBingApi(process.env.REACT_APP_API_KEY).then(() => {
  //               var map = new Microsoft.Maps.Map(mapRef.current);
  //               Microsoft.Maps.loadModule('Microsoft.Maps.Search', function () {
  //                 var searchManager = new Microsoft.Maps.Search.SearchManager(
  //                   map
  //                 );
  //                 var reverseGeocodeRequestOptions = {
  //                   location: new Microsoft.Maps.Location(
  //                     position?.coords?.latitude,
  //                     position?.coords?.longitude
  //                   ),
  //                   callback: function (answer) {
  //                     socketDataStore.send(
  //                       JSON.stringify({
  //                         type: 'send_driver_location',
  //                         latitude: position?.coords?.latitude,
  //                         longitude: position?.coords?.longitude,
  //                         address: answer?.address?.formattedAddress,
  //                         dispatch: message?.message?.dispatch,
  //                         requested_by: [...message?.message?.requested_by],
  //                       })
  //                     );
  //                   },
  //                 };
  //                 searchManager.reverseGeocode(reverseGeocodeRequestOptions);
  //               });
  //             });
  //           });
  //         }

  //         break;

  //       default:
  //         return null;
  //     }
  //   };
  // }

  const [notificationResponce, setNotificationResponce] = useState([]);
  const { logoutUser } = useAuth();
  const mapRef = useRef();

  useEffect(() => {
    AxiosApi.get('notifications/unread/').then((res) => {
      setNotificationResponce(res);
    });
  }, []);

  return (
    <div className={styles.parent_nav_div}>
      {/* Search Bar */}
      <div className={styles.topnav__search}>
        {/* <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i> */}
      </div>
      <div className={styles.right_nav_div}>
        <div className={styles.right_nav_div_userinfo}>
          {' '}
          {renderUserToggle(curr_user)}
        </div>
        <PowerSettingsNewIcon
          onClick={logoutUser}
          style={{ cursor: 'pointer', width: '35px' }}
        />
        <div className={styles.right_nav_div_bellnotification}>
          <BellNotification data={notificationResponce} />
        </div>
        <div
          ref={mapRef}
          style={{
            display: 'none',
            zIndex: '10',
          }}
        />

        <div className={styles.right_nav_div_thememenu}>
          {' '}
          <ThemeMenu />{' '}
        </div>
      </div>
    </div>
  );
}

export { renderUserToggle };
export default Navbar;
