import myStyles from './index.module.css';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo_trail.png';
import React from 'react';
import LoginForm from './LoginForm';
import ResetForm from './ResetForm';
import ForgotPassword from './ForgotPassword';
import ResetSent from './ResetSent';
import ResetSentSuccess from './ResetSentSuccess';

import  ContactUs from './ContactUs'
import Challenges from "./Challenges";
import { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import OwnerForm from '../Owner_Form/ownerForm';

function Authentication(props) {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const locationTrack = useLocation();

  const [username, setUsername] = useState('');

  useEffect(() => {
    if (auth.idToken) navigate('/', { replace: true });
  }, [auth.idToken, navigate]);

  return (
    <>
      <div className="container">
        <div className={myStyles.authentication_left_div}>
          <img src="images/truck.png" alt="" />
        </div>
        <div className={myStyles.authentication_right_div}>
          <img src={logo} className={myStyles.right_div_logo} alt="daw" />

          <section className={myStyles.section_area}>
            {locationTrack.pathname === '/login' ? (
              <LoginForm />
            ) : locationTrack.pathname === '/reset' ? (
              <ResetForm username={username} />
            ) : locationTrack.pathname === '/forgotpassword' ? (
              <ForgotPassword setUsername={setUsername} />
            ) : locationTrack.pathname === '/contactUs' ? (
              <ContactUs/>
            ) : locationTrack.pathname === '/reset_sent' ? (
              <ResetSent />
            ) : locationTrack.pathname === '/reset_sent_success' ? (
              <ResetSentSuccess />
            ) : locationTrack.pathname === "/challenges" ? (
              <Challenges />
            ):     (
              'Something Went Wrong .. !!'
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Authentication;
