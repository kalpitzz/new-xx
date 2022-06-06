import { Button } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components";
import useAuth from "../../hooks/useAuth";
import styles from "../css/public-pages.module.css";
import * as Yup from "yup";
import useAxios from "../../hooks/useAxios";
import Modal from "react-modal";
import { TextField } from "@material-ui/core";

function Challenges() {
  const { auth } = useAuth();
  const navigate = useNavigate();
  const axiosapi = useAxios();
  const [modalOpen, setModalOpen] = useState(false);

  console.log("challenge auth : ", auth);

  useEffect(() => {
    !auth.challenge && navigate("/login", { replace: true });
  }, []);

  const handleSubmit = (values) => {
    axiosapi
      .post("/accounts/challenge/new_password_required/", {
        challenge: auth.challenge,
        username: auth.username,
        new_password: values.password,
        session: auth.session,
      })
      .then(() => setModalOpen(true));
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .required("Required")
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%!^&-+=()_]).{8,}$/,
        "Enter atleast 1 capital, 1 numeric, 1 special character"
      ),
    confirmpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Required"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: handleSubmit,
  });

  const setNewPassword = () => {
    return (
      <div className={styles.section_content_div} style={{ marginTop: "15vh" }}>
        <h1>Welcome To MetroTMS</h1>
        <br />
        <br />
        <h4>Reset Your Password To Continue</h4>
        <br />

        <form onSubmit={formik.handleSubmit}>
          <TextField
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
          <TextField
            id="confirmpassword"
            name="confirmpassword"
            type="password"
            value={formik.values.confirmpassword}
            onChange={formik.handleChange}
            error={
              formik.touched.confirmpassword &&
              Boolean(formik.errors.confirmpassword)
            }
            helperText={
              formik.touched.confirmpassword && formik.errors.confirmpassword
            }
          />

          <br />
          <Button type="submit">Reset Password</Button>
        </form>
      </div>
    );
  };

  const challengeSelector = () => {
    switch (auth.challenge) {
      case "NEW_PASSWORD_REQUIRED":
        return setNewPassword();
      default:
        return <div> No challenge Matched</div>;
    }
  };

  return (
    <>
      {challengeSelector()}
      <Modal className="modal" isOpen={modalOpen}>
        <h2>Password Reset Successfully</h2>
        <button onClick={() => navigate("/login", { replace: true })}>
          OK
        </button>
      </Modal>
    </>
  );
}

export default Challenges;
