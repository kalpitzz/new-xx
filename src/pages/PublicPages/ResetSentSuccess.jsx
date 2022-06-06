// Your Password has been successfully reset!

import React from 'react';
import { Link } from "react-router-dom";
import styles from './index.module.css'
import image from './../../assets/images/check-circle.png'



function ResetSentSuccess() {

    return (
        <div className={styles.section_content_div}>
            <br />
            <div><Link to='/login'> ⬅ Return to Login</Link></div>
            <br /><br />
            <div style={{ display: "flex", justifyContent: "center", marginTop: "10%" }}>
                <img src={image} alt='check-Circle'></img>

            </div>

            <div style={{ display: "flex", justifyContent: "center", }}>
                <h1 style={{ fontSize: "x-large", margin: "10% 0 10% 10%" }}>Your Password has been successfully reset!</h1>
            </div>



        </div>
    )
}

export default ResetSentSuccess;
