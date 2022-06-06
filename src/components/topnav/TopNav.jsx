import React, { useState } from 'react';

import './topnav.css';

import { Link } from 'react-router-dom';

import Dropdown from '../dropdown/Dropdown';

import ThemeMenu from '../ThemeMenu/ThemeMenu';

import notifications from '../../assets/JsonData/notification.json';

import user_image from '../../assets/images/tuat.png';

import user_menu from '../../assets/JsonData/user_menus.json';

import useAuth from '../../hooks/useAuth';
import Notifications from 'react-notifications-menu';

const curr_user = {
  display_name: 'Kalpit Jangid',
  image: user_image,
};

const DEFAULT_NOTIFICATION = {
  image:
    'https://cutshort-data.s3.amazonaws.com/cloudfront/public/companies/5809d1d8af3059ed5b346ed1/logo-1615367026425-logo-v6.png',
  message: 'Notification one.',
  detailPage: '/events',
  receivedTime: '12h ago',
};

const renderNotificationItem = (item, index) => (
  <div className="notification-item" key={index}>
    <i className={item.icon}></i>
    <span>{item.content}</span>
  </div>
);

const renderUserToggle = (user) => (
  <div className="topnav__right-user">
    <div className="topnav__right-user__image">
      {/* <img src={user.image} alt="" /> */}
    </div>
    <h2 className="topnav__right-user__name">{user.display_name}</h2>
  </div>
);

const renderUserMenu = (item, index, logoutUser) => (
  <Link to="/login" key={index}>
    <div onClick={() => logoutUser()} className="notification-item">
      <i className={item.icon}></i>
      <span>{item.content}</span>
    </div>
  </Link>
);
const userDiv = (logoutUser) => {
  return (
    <div className="topnav__right-item">
      {/* dropdown here */}
      <Dropdown
        customToggle={() => renderUserToggle(curr_user)}
        contentData={user_menu}
        renderItems={(item, index) => renderUserMenu(item, index, logoutUser)}
      />
    </div>
  );
};

const Topnav = () => {
  const { logoutUser } = useAuth();
  const [data, setData] = useState([DEFAULT_NOTIFICATION]);

  return (
    <div className="topnav">
      <div className="topnav__search">
        <input type="text" placeholder="Search here..." />
        <i className="bx bx-search"></i>
      </div>

      <div className="topnav__right">
        {/* <button onClick={()=>{localStorage.removeItem("token");const log=document.createElement('a'); log.href="/login"; log.click();}}>kalpit</button> */}
        <div className="mobile_user_image">{userDiv(logoutUser)}</div>
        <div className="topnav__right-item">
          {/* <Dropdown
            icon="bx bx-bell"
            badge="25"
            contentData={notifications}
            renderItems={(item, index) => renderNotificationItem(item, index)}
            renderFooter={() => <Link to="/">View All</Link>}
          /> */}

          {/* dropdown here */}
        </div>
        <div className="topnav__right-item">
          <ThemeMenu />
        </div>
      </div>
    </div>
  );
};

export { userDiv };
export default Topnav;
