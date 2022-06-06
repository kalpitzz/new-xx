import React, { useState } from "react";

import { Formik, Form, ErrorMessage } from "formik";

import TextField from "./TextField";
import * as Yup from "yup";
// import InputMask from "react-input-mask";

// const MaskedInput = (props) => (
//   <InputMask {...props}>
//     {(inputProps) => <TextField {...inputProps} />}
//   </InputMask>
// );

const handleChange = (e) => {
  return e
    .replace(/\)/g, "")
    .replace(/\(/g, "")
    .replace(/-/g, "")
    .replace(/ /g, "");
};

const Signup = () => {
  const [state, setstate] = useState("");

  const masked = (e) => {
    if (e.length == 1) {
      e = "(" + e;
    }
    if (e.length == 4) {
      e = e + ")" + " ";
    }
    if (e.length == 9) {
      e = e + "-";
    }

    setstate(e);
  };
  const date = new Date();
  const today = "" + date.getDate();
  const month = "" + date.getMonth() + 1;
  const year = date.getFullYear();
  const maxYear = date.getFullYear() + 1;

  const validation = Yup.object({
    firstName: Yup.string()
      .max(15, "must be 15 character or less")
      .min(4, "must be 15 character or less")
      .required("Required"),
    lastName: Yup.string()
      .max(20, "must be 20 character or less")
      .min(4, "must be 15 character or less")
      .required("Required"),
    email: Yup.string().email("email is invalid").required("email is Required"),
    phoneNumber: Yup.string()
      .required("phone number is required")
      .min(10, "min phone number value is  10")
      .max(14, "max phone Number value is 10"),

    password: Yup.string()
      .min(6, "password must be at least 6 charaters")
      .required("Password is Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "password must match")
      .required("Confirm password Required"),
    date: Yup.date().required("date is Required"),
  });
  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={{
          firstName: "",
          lastName: "",
          email: "",
          phoneNumber: "",
          password: "",
          confirmPassword: "",
          date: "",
        }}
        validationSchema={validation}
        onSubmit={(values) => {
          console.log(values);
        }}
      >
        {(formik) => (
          <div>
            <h1 className="my-4 font-weigth-bold-display-4">signup</h1>
            {/* {console.log(formik)} */}

            <Form>
              <TextField label="First Name" name="firstName" type="text" />
              <TextField label="Last Name" name="lastName" type="text" />
              <TextField label="Email" name="email" type="email" />

              {/* <MaskedInput
                mask="(999) 999-9999"
                name="phoneNumber"
                label="phone Number"
                onChange={formik.handleChange}
                value={formik.values.phoneNumber}
                // onBlur={formik.touched.phoneNumber && formik.errors.phoneNumber}
              /> */}

              <TextField
                label="Phone Number"
                name="phoneNumber"
                type="text"
                onChange={(e) => {
                  masked(e.target.value);
                  console.log(e.target.value);
                  formik.setFieldValue("phoneNumber", e.target.value);
                }}
                value={state}
              />

              <TextField label="Password" name="password" type="password" />
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
              />
              <TextField
                label="Date"
                name="date"
                type="date"
                min={`${year}-${month}-${today}`}
                max={`${maxYear}-${month}-${today}`}
              />

              <button
                className="btn btn-dark m-3"
                type="submit"
                onClick={() => {
                  const value = state;
                  const final = handleChange(value);
                  formik.setFieldValue("phoneNumber", final);
                }}
              >
                submit
              </button>
              <button
                className="btn btn-danger  m-3"
                type="reset"
                onClick={() => {
                  setstate("");
                }}
              >
                reset
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default Signup;
