import React, { useState,useEffect } from 'react';
import './forgetpassword.css';
import { GmailValidate } from './errorhandling';
import { useSpring, animated } from '@react-spring/web';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

import { PasswordValidate } from './errorhandling';

const Forgetpassword = ({  otpVerifysuccess }) => {
  const navigate=useNavigate();
  const [finalgmail, setgmail] = useState({ gmail: '' });
  const [otpSent, setOtpSent] = useState(false); // State to track if OTP is sent
  const [otpExpireTime, setOtpExpireTime] = useState(0); // State for OTP expiry time
  const [otp, setOtp] = useState(''); // State to store OTP entered by the user
  const [password, setPassword] = useState(''); // State to store the new password
  const [passwordReset, setPasswordReset] = useState(false); // State for showing password reset form
  const [firstPhaseDone, setFirstPhaseDone] = useState(false); 

  const handleChange = (e) => {
    setgmail({ ...finalgmail, [e.target.name]: e.target.value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value); // Directly set OTP as a string
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // Handle password input
  };

  const forget_checkvalidation = async () => {
    try {
      // Validate email
      const response = await GmailValidate(finalgmail.gmail);
      if (response) {
        alert(response);
      }

      // Send OTP request
      const server_response = await axios.post('http://localhost:5000/api/sendotp/send-otp', {
        gmail: finalgmail.gmail, // Ensure this is sent as an object
      });

      alert(server_response.data.message);

      if (server_response.status === 200) {
        setOtpSent(true);
        startOtpTimer(); // Start OTP expiration timer
      }
    } catch (error) {
      console.error("Error:", error); // Debugging
      alert(error.response?.data?.message || "An error occurred while sending OTP.");
    }
  };

  const startOtpTimer = () => {
    const expiryTime = 5 * 60; // 5 minutes in seconds
    setOtpExpireTime(expiryTime);

    const timer = setInterval(() => {
      setOtpExpireTime((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  // Spring animation code for initial and OTP screen
  const div1 = useSpring({
    opacity: 1,
    transform: 'rotate(0deg)',
    from: {
      opacity: 0,
      transform: 'rotate(180deg)',
    },
    config: { tension: 200, friction: 15 },
  });

  const div2 = useSpring({
    opacity: 1,
    transform: 'translateX(0%)',
    from: {
      opacity: 0,
      transform: 'translateX(-100%)',
    },
    config: { tension: 70, friction: 15 },
  });

  const div3 = useSpring({
    opacity: otpSent ? 1 : 0,
    transform: otpSent ? 'translateX(0%)' : 'translateX(100%)',
    config: { tension: 70, friction: 15 },
  });

  const div4 = useSpring({
    opacity: passwordReset ? 1 : (firstPhaseDone ? 0.5 : 0), // Apply opacity based on phases
    transform: passwordReset
      ? 'rotate(0deg)' // Apply rotation after the transition phase
      : firstPhaseDone
      ? 'rotate(0deg)' // Transition to no rotation after first phase
      : 'translateY(100%)', // Initial phase: starting position off-screen
    config: { tension: 200, friction: 15 },
    from: {
      opacity: 0, // Initial opacity
      transform: 'translateY(100%)', // Initial transform (off-screen)
    },
    onRest: () => {
      if (!firstPhaseDone) {
        setFirstPhaseDone(true); // After first phase animation, proceed to second phase
      }
    },
  });
  
    

  const checkOtp = async () => {
    try {
      if (!otp) {
        alert("Enter the OTP");
        return; // Exit early if OTP is missing
      }

      const res = await axios.post('http://localhost:5000/api/verifyotp/verify-otp', { 
        gmail: finalgmail.gmail, 
        otp: otp, // Pass the OTP as a string
      });

      alert(res.data.message);  // Show success message from the server
      if (res.status === 200) {
        setPasswordReset(true); // After successful OTP verification, show password reset form
      }
    } catch (error) {
      // Handle errors properly
      if (error.response) {
        alert(error.response.data.message); // Server errors
      } else {
        alert("An error occurred. Please try again.");
      }
    }
  };

  const resetPassword = async () => { 
    if (!password) {
      alert("Please enter a new password.");
      return;
    }else{
      const msg=PasswordValidate(password);
      if(msg){
        alert(msg);
      }
      else{

    try {
      const res = await axios.post('http://localhost:5000/api/updatepassword/updateUserinfo', { 
        gmail: finalgmail.gmail, 
        newpassword: password, // Pass the new password
      });

      alert(res.data.message);  // Show success message from the server
      if (res.status === 200) {
        // Redirect or take further actions after password reset
        backtohome(); // You can navigate the user back to the home page after resetting password
      }
    } catch (error) {
      alert(error.response?.data?.message || "An error occurred while resetting the password.");
    }
  };
}
  }

  const backtohome=()=>{
    navigate('/backtohome');
  }

  return (
    <div className="forget-maincontent">
      <animated.div className="forgetdiv1" style={div1}>
        <p onClick={backtohome}>
          >>>> GO BACK TO HOME PAGE
        </p>
      </animated.div>

      {!passwordReset && !otpSent && (
        <animated.div className="forgetdiv2" style={div2}>
          <div className="forgetemail">
            <label>Enter Your Registered Email</label>
          </div>
          <div className="inputemail">
            <input
              type="email"
              name="gmail"
              value={finalgmail.gmail}
              onChange={handleChange}
              id="inpemail"
            />
          </div>

          <div className="forget-submit" onClick={forget_checkvalidation}>
            <p>Submit</p>
          </div>
        </animated.div>
      )}

      {otpSent && !passwordReset && (
        <animated.div className="forgetdiv2" style={div3}>
          <div className="forgetemail">
            <label>Enter OTP</label>
          </div>
          <div className="inputemail">
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleOtpChange} // Handle OTP change directly
              id="inpemail"
            />
          </div>

          <div className="otp-expiry">
            <p>OTP expires in: {Math.floor(otpExpireTime / 60)}:{otpExpireTime % 60}</p>
          </div>

          <div className="forget-submit" onClick={checkOtp}>
            <p>Submit OTP</p>
          </div>
        </animated.div>
      )}

      {passwordReset && (
        <animated.div className="forgetdiv2" style={div4}>
          <div className="forgetemail">
          
            <label>Enter New Password</label>
            </div>
            <div className='inputemail'>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="New Password"
              id="inpemail"
            />
          </div>
          <div className="forget-submit" onClick={resetPassword}>
            <p>Reset Password</p>
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default Forgetpassword;
