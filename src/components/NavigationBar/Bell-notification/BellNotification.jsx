import React from 'react';
import Notifications from 'react-notifications-menu';
import { useNavigate } from 'react-router-dom';
import '../../css/bellnotification.css';

function BellNotification(props) {
  const navigate = useNavigate();
  let notificationArray = props.data.map((item) => ({
    image: 'https://img.icons8.com/color/344/filled-message.png',
    message: item.body,
    detailPage: '#',
    receivedTime: item.timesince,
  }));

  return (
    <Notifications
      data={notificationArray}
      header={{
        title: 'Notifications',
        option: {
          text: 'View All',
          onClick: () => navigate('/notificationTab'),
        },
      }}
    />
  );
}

export default BellNotification;
