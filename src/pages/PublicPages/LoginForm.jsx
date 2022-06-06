// ------------------------------------------------------------
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import styles from '../css/public-pages.module.css';
import myStyles from './index.module.css';

import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useDispatch } from 'react-redux';
import DispatchAction from '../../redux/actions/DispatchAction';
import { useEffect } from 'react';
// import { WindowSharp } from '@mui/icons-material';

const LOGIN_URL = '/accounts/login/';

const LoginForm = () => {
  const { auth, setAuth } = useAuth();
  let axiosapi = useAxios();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let accessToken = localStorage.getItem('accessToken');
  let userDetail = localStorage.getItem('user');
  let idToken = localStorage.getItem('idToken');
  let refreshToken = null;
  let session = null;
  let challenge = null;
  let username = null;
  let role = null;

  useEffect(() => {
    if (auth.user_carrier_email) setAuth({});
  }, []);

  const handleSubmit = (values) => {
    axiosapi
      .post(LOGIN_URL, {
        username: values.email.trim(),
        password: values.password,
      })
      .then((data) => {
        console.log('login Data : ', data);
        if (data.challenge) {
          console.log('challenge entered');
          session = data.session;
          challenge = data.challenge;
          username = data.username;
          setAuth({
            session,
            challenge,
            username,
          });
          navigate('/challenges', { replace: true });
        } else if (data.onboarding_required) {
          setAuth({
            accessToken: data.AccessToken,
            idToken: data.IdToken,
            refreshToken: data.RefreshToken,
            user_carrier_email: data.user.email,
            onboarding_required: data.onboarding_required,
          });
          window.location.href = '/OwnerForm';
        } else {
          console.log('normal entered', data);
          accessToken = data.AccessToken;
          userDetail = data.user;
          idToken = data.IdToken;
          refreshToken = data.RefreshToken;
          role = data.roles;

          localStorage.setItem('idToken', idToken);
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          localStorage.setItem('user', JSON.stringify(userDetail));
          localStorage.setItem('role', data.roles[0]);

          setAuth({
            accessToken,
            idToken,
            refreshToken,
            user: userDetail,
            role: data.roles[0],
          });

          let socket = new WebSocket(process.env.REACT_APP_API_WS);
          socket.onopen = function (e) {
            let data = { IdToken: idToken };
            socket.send(JSON.stringify(data));
            dispatch(DispatchAction.setSocket(socket));
          };

          socket.onmessage = function (event) {
            let message = JSON.parse(event.data);
            console.log('message', message);
          };
          socket.onclose = function (event) {
            let id = localStorage.getItem('idToken');
            if (id) {
              let socket = new WebSocket(process.env.REACT_APP_API_WS);
              socket.onopen = function (e) {
                let data = { IdToken: idToken };
                socket.send(JSON.stringify(data));
                dispatch(DispatchAction.setSocket(socket));
              };
            }
          };

          localStorage.removeItem('startTime');
          navigate('/', { replace: true });
        }
      })
      .catch((error) => {
        toast.error(error?.response?.data?.message.username[0]);
        toast.error(error?.response?.data?.message.password[0]);
      });
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#!$%^&-+=()_]).{8,}$/,
        'Enter atleast 1 capital, 1 numeric, 1 special character'
      )
      .required('Required'),
    email: Yup.string().email('Enter Valid Email').required('Required'),
  });

  const initial_values = {
    password: '',
    email: '',
  };

  return (
    <div className={styles.section_content_div} style={{ marginTop: '15vh' }}>
      <h4>Welcome!</h4>
      <br />
      <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
        Sign into MetroTMS
      </h1>

      <Formik
        initialValues={initial_values}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        validateOnChange={false}
      >
        <Form className={myStyles.formStyle}>
          <label className={myStyles.label} htmlFor="username">
            Enter email address:
          </label>

          <Field type="email" name="email" placeholder="Enter Email" />
          <ErrorMessage name="email">
            {(errorMsg) => <div className={myStyles.errors}>{errorMsg}</div>}
          </ErrorMessage>
          <label className={myStyles.label} htmlFor="username">
            Enter Password:
          </label>

          <Field type="password" name="password" placeholder="Enter Password" />
          <ErrorMessage name="password">
            {(errorMsg) => <div className={myStyles.errors}>{errorMsg}</div>}
          </ErrorMessage>

          <br />
          <button type="submit" className={myStyles.login_button}>
            Login
          </button>

          <br />
          <div>
            <Link to="/forgotpassword"> Forgot Password ?</Link>
          </div>

          <br />
          <div className={myStyles.div_signUp}>
            <span>
              Haven't joined the family yet?{' '}
              <Link to="/contactUs">Contact Us</Link>{' '}
            </span>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default LoginForm;
