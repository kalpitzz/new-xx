import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import styles from "./index.module.css";
import Modal from "react-modal";
import useAxios from "../../hooks/useAxios";

function ContactUs() {
  let idToken = localStorage.getItem("idToken");
  const navigate = useNavigate();
  const axiosapi = useAxios();
  const errRef = useRef();
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (idToken) navigate("/", { replace: true });
  }, [idToken, navigate]);
  // modal

  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      width: "30%",
      height: "20%",
    },
  };

  Modal.setAppElement("#root");

  function openModal() {
    setIsOpen(true);
    // navigate("/login");
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "#f00";
  }

  function closeModal() {
    setIsOpen(false);
    // setTimeout(() => {
    //   navigate("/login");
    // }, 3000);
  }

  const initialValues = {
    fname: "",
    lname: "",
    email: "",
    companyName: "",
    phoneNumber: "",
    info: "",
  };

  const onSubmit = (values) => {
    axiosapi
      .post("company/contactus/", {
        first_name: values.fname,
        last_name: values.lname,
        email: values.email,
        company_name: values.email,
        phone: values.phoneNumber,
        addition_information: values.info,
      })
      .then((response) => {
        console.log("form data", values);

        openModal();
      })
      .catch((err) => {
        console.log("error : ", err);
        if (!err?.response) {
          setErrMsg("No Server Response");
        }
        errRef.current.focus();
      });
  };

  const validationSchema = Yup.object({
    fname: Yup.string().required("Required"),
    lname: Yup.string().required("Required"),
    companyName:Yup.string().required("Required"),
    info: Yup.string().required("Required"),
    email: Yup.string().email("Enter Valid Email").required("Required"),
    phoneNumber: Yup.string()
      .required("Required")
      .matches(/^[+1]{1}[1-9]{1}[0-9]{9}/, "Enter 10 digit number"),
  });

  return (
    <div className={styles.section_content_div} style={{ marginTop: "7%" }}>
      {/* <div><Link to='/login'> ⬅ Return to Login</Link></div> */}
      <div>
        <h1>Contact Us </h1>
      </div>
      <br/>
      <h3>Enter Contact Details.</h3>
      <br/>
      {/* error message displayed */}
      {errMsg ? (
        <div ref={errRef} className={styles.errors} aria-live="assertive">
          {errMsg}
        </div>
      ) : null}

      <div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          <Form className={styles.form}>
            <label htmlFor="fname">First Name*: </label>
            <br />
            <Field type="text" name="fname" id="fname" />
            <ErrorMessage name="fname">
              {(errorMsg) => <div className={styles.errors}>{errorMsg}</div>}
            </ErrorMessage>
            <br/>

            <label htmlFor="lname">Last Name*: </label>
            <br />
            <Field type="text" name="lname" id="lname" />
            <ErrorMessage name="lname">
              {(errorMsg) => <div className={styles.errors}>{errorMsg}</div>}
            </ErrorMessage>
            <br/>
            
            <label htmlFor="email">Email Address*: </label>
            <br />
            <Field type="email" name="email" id="email" />
            <ErrorMessage name="email">
              {(errorMsg) => <div className={styles.errors}>{errorMsg}</div>}
            </ErrorMessage>
            <br/>

            <label htmlFor="companyName">Company Name*: </label>
            <br />
            <Field type="text" name="companyName" id="companyName" />
            <ErrorMessage name="companyName">
              {(errorMsg) => <div className={styles.errors}>{errorMsg}</div>}
            </ErrorMessage>
            <br/>

            <label htmlFor="phoneNumber">Phone Number*: </label>
            <br />
            <Field type="text" name="phoneNumber" id="phoneNumber" />
            <ErrorMessage name="phoneNumber">
              {(errorMsg) => <div className={styles.errors}>{errorMsg}</div>}
            </ErrorMessage>
            <br/>

            <label htmlFor="info">Additional Information*: </label>
            <br />
            <ErrorMessage name="info">
              {(errorMsg) => <div className={styles.errors}>{errorMsg}</div>}
            </ErrorMessage>
            
            <Field
              as="textarea"
              name="info"
              id="info"
              rows="4"
              style={{ resize: "none" }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-evenly",
                marginTop: "40px",
              }}
            >
              <button
                type="btn"
                className={styles.contactUs_button}
                onClick={() => navigate("/login")}
              >
                Back
              </button>
              <button type="reset" className={styles.contactUs_button}>
                Reset{" "}
              </button>

              <button type="submit" className={styles.contactUs_button}>
                Submit
              </button>
            </div>
          </Form>
        </Formik>
        <div>
          <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <p>
              Your details have been submitted successfully!! Our team will
              reach out to you soon
            </p>
            <br />
            <br />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "40%",
              }}
            >
              <button
                onClick={closeModal}
                style={{ width: "100%", height: "100%" }}
              >
                Got it
              </button>
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
