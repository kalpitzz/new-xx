import React, { useRef, useState } from 'react';
import OtpInput from 'react-otp-input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import styles from './index.module.css';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';
import { toast } from 'react-toastify';

const RESET_URL = 'accounts/confirm_forgot_password/';

function ResetForm(props) {
  const navigate = useNavigate();
  const axiosapi = useAxios();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState('');
  const [otp, setOtp] = useState(null);
  const handleOtpChange = (otp) => setOtp(otp);

  const initialValues = {
    password: '',
  };

  const onSubmit = async (values) => {
    if (!otp || otp.length < 6) {
      alert('Check the One-Time Password');
    } else {
      await axiosapi
        .post(RESET_URL, {
          username: props.username,
          confirmation_code: otp,
          new_password: values.password,
        })
        .then((response) => {
          setTimeout(() => {
            navigate('/reset_sent_success');
          }, 3000);
        })
        .catch((err) => {
          if (err.response?.status === 400) {
            toast.error('Wrong OTP');
          } else {
            toast.error('Reset passwor Failed...Try Again');
          }
          errRef.current.focus();
        });
    }
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .required('Password is required')
      .matches(/[0-9a-zA-Z@_!$#]{8,}/, 'Use Proper format'),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit,
  });

  return (
    <>
      <div className={styles.section_content_div}>
        <div
          style={{
            fontSize: 'x-large',
            marginTop: '15%',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <h1>Enter the One-Time Password </h1>
        </div>
        <div
          style={{
            marginTop: '10%',
            display: 'flex',
            justifyContent: 'space-evenly',
          }}
        >
          <OtpInput
            value={otp}
            onChange={handleOtpChange}
            numInputs={6}
            isInputNum={true}
            separator={<span>-</span>}
            inputStyle={{
              width: '3rem',
              height: '3rem',
              margin: '10px',
              fontSize: '2rem',
              borderRadius: 4,
              border: '1px solid rgba(0,0,0,0.3)',
            }}
          />
        </div>

        <form onSubmit={formik.handleSubmit} className={styles.form}>
          <br />
          <label className={styles.label} htmlFor="password">
            Enter your new Password:{' '}
          </label>

          <input
            type="password"
            name="password"
            id="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            values={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className={styles.errors}>{formik.errors.password} </div>
          ) : null}
          <br />

          <label className={styles.label} htmlFor="password">
            Confirm your new Password:{' '}
          </label>
          <input
            type="password"
            name="confirmpassword"
            id="confirmpassword"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            values={formik.values.confirmpassword}
          />
          {formik.touched.confirmpassword && formik.errors.confirmpassword ? (
            <div className={styles.errors}>
              {formik.errors.confirmpassword}{' '}
            </div>
          ) : null}

          {errMsg ? (
            <div ref={errRef} className={styles.errors} aria-live="assertive">
              {errMsg}
            </div>
          ) : null}

          <br />
          <br />
          <div>
            <button
              type="submit"
              className={styles.login_button}
              style={{ width: '100%' }}
            >
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default ResetForm;
