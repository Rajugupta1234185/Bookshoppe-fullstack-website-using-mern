import React, { useState } from 'react';
import { useSpring, animated } from '@react-spring/web';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import axios from 'axios';



const Login = () => {
  const navigate =useNavigate();
  const [logindata, setdata] = useState({
    gmail: '',
    password: '',
  });

  const [showForget, setShowForget] = useState(false); // State to show "Forget Password?" message

//navigation
const onCreateAccount=()=>{
  navigate('/createnewaccount');
}

const onforgetfunction=()=>{
  navigate('/forgetpassword');
}
//close navigation function

  // Handle input changes
  const handleChange = (e) => {
    setdata({ ...logindata, [e.target.name]: e.target.value });
  };

  // Define animations for existing elements
  const text1 = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-20px)' },
    delay: 500,
  });

  const text2 = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-20px)' },
    delay: 1500,
  });

  const text3 = useSpring({
    opacity: 1,
    transform: 'translateY(0)',
    from: { opacity: 0, transform: 'translateY(-20px)' },
    delay: 2500,
  });

// Define animation for the "Forget Password?" element
const forgetAnimation = useSpring({
  width: showForget ? '50%' : '0',  // Expanding the width to 50% when showForget is true
  height: showForget ? '20%' : '0',  // Expanding the height to 20%
  opacity: showForget ? 1 : 0,        // Make it visible when expanded
  transform: showForget ? 'scale(1)' : 'scale(0.1)', // Scale effect for smooth expansion
  padding: showForget ? '5%' : '0',   // Add padding conditionally (5% when expanded, 0 when collapsed)
  display: 'flex',                    // Use flexbox for centering content
  justifyContent: 'center',           // Center horizontally
  alignItems: 'center',               // Center vertically
  config: { tension: 200, friction: 15 },  // Control the speed of the animation
});

  

  const checkCredentials = async () => {
    if (!logindata.gmail || !logindata.password) {
      alert('Enter both Gmail and password');
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/loginauthentification/loginauthentification",
        logindata,
        { withCredentials: true } // 👈 THIS is required for cookies!
      );
      console.log(response.data);  // Should log 'Cookie set!'
    
      alert(response.data.message);
      setShowForget(false);
      //----------my block of code------------------
          if(response.data.id ===1){
            navigate('/allRole');
          }
          if(response.data.id===2){
             navigate('/UserandAdmin');

          }
          if(response.data.id===3){
            navigate('/UserandSeller');
          }
          if(response.data.id===4){
            navigate('/AdminandSeller');
          }
          if(response.data.id===5){
            navigate('/afterdashboard');
          }
          if(response.data.id===6){
            navigate('/admin');
          }
          if(response.data.id===7){
            navigate('/seller');
          }
      //---------------------------------------
    
    } catch (error) {
    
      console.error('Login Error:', error);
      if (error.response?.data?.message === 'Invalid credentials') {
        setShowForget(true); // Show forget password message on incorrect password
      } else {
        alert(error.response?.data?.message || 'Login failed');
      }
    }
  };

  return (
    <div className="main-content1">
      <div className="flex-in-main">
        <div className="flex1">
          <animated.div className="line1" style={text1}>
            <h1>Welcome</h1>
          </animated.div>
          <animated.div className="line2" style={text2}>
            <h1>To</h1>
          </animated.div>
          <animated.div className="line3" style={text3}>
            <h1>BookShoppee</h1>
          </animated.div>

          <div className="login-message">
            <div className="line4">
              <h1>Please</h1>
            </div>
            <div className="line5">
              <h1>Login To</h1>
            </div>
            <div className="line6">
              <h1>Proceed</h1>
            </div>
          </div>
        </div>

        <div className="flex2">
          {/* Apply the forgetAnimation to make it animate */}
          <animated.div className="forget" style={forgetAnimation} onClick={onforgetfunction}>
            <p>Forget Password ?</p>
          </animated.div>
     
        </div>

        <div className="flex3">
          <div className="Login-content">
            <div className="uname">
              <label>Enter Gmail</label>
            </div>
            <div className="enteruname">
              <input type="text" name="gmail" value={logindata.gmail} onChange={handleChange} id="username" />
            </div>

            <div className="pass">
              <label>Enter Password</label>
            </div>
            <div className="enterpass">
              <input type="password" name="password" value={logindata.password} onChange={handleChange} id="password" />
            </div>

            <div className="login-button" onClick={checkCredentials}>
              <p>Login</p>
            </div>

            <div className="createnewaccount" onClick={onCreateAccount}>
              <p>Create A new Account</p>
            </div>
            <div className='forget-mob' onClick={onforgetfunction}><p>Forget Password?</p></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
