import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./index.module.css";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";

function ForgotPassword(props) {
  let idToken = localStorage.getItem("idToken");
  const navigate = useNavigate();
  const axiosapi = useAxios();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (idToken) navigate("/", { replace: true });
  }, [idToken, navigate]);

  const initialValues = {
    email: "",
  };

  const onSubmit = async (values) => {
    props.setUsername(values.email);
    await axiosapi
      .post("accounts/forgot_password/", {
        username: values.email,
      })
      .then((response) => {
        console.log("form data", values);
        setTimeout(() => {
          navigate("/reset_sent");
        }, 3000);
      })
      .catch((err) => {
        if (err.response?.status === 400) {
          toast.error("User Does Not Exist..");
        } else {
          setErrMsg("Something went wrong ..");
        }
        errRef.current.focus();
      });
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Enter Valid Email").required("Required"),
  });

  return (
    <div className={styles.section_content_div} style={{ marginTop: "7%" }}>
      <br />
      <div>
        <Link to="/login"> ⬅ Return to Login</Link>
      </div>

      <div style={{ fontSize: "xx-large", margin: "10% 0 10%" }}>
        <h1>Forgot Password? </h1>
      </div>
      <div style={{ marginBottom: "10%" }}>
        <p>
          Enter the email address you used when you joined and we'll send you
          instruction to reset your password.
        </p>
      </div>
      {/* error message displayed */}
      {errMsg ? (
        <div ref={errRef} className={styles.errors} aria-live="assertive">
          {errMsg}
        </div>
      ) : null}
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        <Form className={styles.form} style={{ marginTop: "-5%" }}>
          <label htmlFor="email">Email Address*: </label>
          <br />
          <Field type="email" name="email" id="email" />
          <ErrorMessage name="email">
            {(errorMsg) => <div className={styles.errors}>{errorMsg}</div>}
          </ErrorMessage>

          <div className={styles.div_btn} style={{ marginTop: "7%" }}>
            <button type="submit" className={styles.login_button}>
              Submit
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
}

export default ForgotPassword;
