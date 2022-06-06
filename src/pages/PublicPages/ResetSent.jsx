// Reset Instruction Sent

import React from 'react';
import { Link } from "react-router-dom";
import styles from './index.module.css'
import image from './../../assets/images/check-circle.png'

function ResetSent() {
  
  return (
    <div className={styles.section_content_div}>
      <br/>
      <div><Link to='/login'> ⬅ Return to Login</Link></div>
      <div style={{display:"flex", justifyContent: "center", marginTop:"10%" }}>
          <img src={image} alt='circle'></img>
      </div>

      <div  style={{display:"flex", justifyContent: "center", }}>
      <h1 style={ {fontSize: "xxx-large",margin: "10% 0 10% 10%"}}>Reset Instruction Sent</h1>
      </div>
      <div style={{marginBottom: "10%"}}>
      
      Enter the email address you used when you joined and we’ll send you instructions to reset your password.
       
      </div>
      <div  style={{display:"flex", justifyContent: "center", fontSize: "x-large"}}>
       <Link to='/reset' >Click Here to Reset Password</Link>
      </div>
    </div>
  )
}

export default ResetSent;
