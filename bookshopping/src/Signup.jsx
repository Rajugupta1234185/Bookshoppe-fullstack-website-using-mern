import React, { useState } from 'react';
import './Signup.css';
import { RequiredValidate, GmailValidate, PhoneValidate, PasswordValidate, rePasswordValidate } from './errorhandling';
import axios from 'axios';
import OTPVerification from './OTPVerification';
import { useFormData } from './FormDataContext'; // Import the useFormData hook

import { useNavigate } from 'react-router-dom';

const Signup = ({  }) => {
  const navigate =useNavigate();
  const { formData, updateFormData } = useFormData(); // Access formData and updateFormData from context

  // State for error/success message
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'error' or 'success'

  // State to track if OTP is successfully sent
  const [isOtpSent, setIsOtpSent] = useState(false);

  // Handle form data change
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateFormData({ [name]: value }); // Use updateFormData instead of setFormData
  };

  // Handle form submission on clicking the "Create Account" div
  const handleSubmit = async () => {
    const { fname, lname, gmail, phone, password, rePassword } = formData;

    // Validate form fields
    const fnameError = RequiredValidate(fname, 'First Name');
    const lnameError = RequiredValidate(lname, 'Last Name');
    const gmailError = GmailValidate(gmail);
    const phoneError = PhoneValidate(phone);
    const passwordError = PasswordValidate(password);
    const rePasswordError = rePasswordValidate(password, rePassword);

    // Check if there are any validation errors
    if (fnameError || lnameError || gmailError || phoneError || passwordError || rePasswordError) {
      setMessage(`
                ${fnameError || ''} 
                ${lnameError || ''} 
                ${gmailError || ''} 
                ${phoneError || ''} 
                ${passwordError || ''} 
                ${rePasswordError || ''}`);
      setMessageType('error'); // Set the message type to error
    } else {
      try {
        const resforotp = await axios.post('http://localhost:5000/api/sendotp/send-otp', { gmail: formData.gmail });

        // Check if response is valid and contains 'data'
        if (resforotp && resforotp.data) {
          setMessage(resforotp.data.message);
          setMessageType('success'); // Set the message type to success
          setIsOtpSent(true); // Mark OTP as sent
          alert(formData.gmail);
          navigate('/otpverify'); // Call the OTP verification function
        } else {
          setMessage('Error: No data received from server');
          setMessageType('error');
        }
      } catch (error) {
        console.error('Error during OTP request:', error);
        setMessage('Error: Failed to send OTP');
        setMessageType('error');
      }
    }
  };

  return (
    <>
      <div className="main-content">
        <div className="flex4"></div>
        <div className="flex5"></div>
      </div>

      <div className="signup-content">
        <form>
          <div className="fname">
            <label htmlFor="fname">Enter First Name</label>
          </div>
          <div className="enterfname">
            <input type="text" id="fname" name="fname" value={formData.fname} onChange={handleChange} />
          </div>

          <div className="lname">
            <label htmlFor="lname">Enter Last Name</label>
          </div>
          <div className="enterlname">
            <input type="text" id="lname" name="lname" value={formData.lname} onChange={handleChange} />
          </div>

          <div className="gmail">
            <label htmlFor="gmail">Enter Gmail</label>
          </div>
          <div className="entergmail">
            <input type="email" id="gmail" name="gmail" placeholder="You@gmail.com" value={formData.gmail} onChange={handleChange} />
          </div>

          <div className="phone">
            <label htmlFor="phone">Phone no.</label>
          </div>
          <div className="enterphone">
            <input type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="password">
            <label htmlFor="password">Create A strong Password</label>
          </div>
          <div className="enterpass">
            <input type="password" id="pwd" name="password" value={formData.password} onChange={handleChange} />
          </div>

          <div className="repass">
            <label htmlFor="rePassword">Re-enter Your password</label>
          </div>
          <div className="reenterpass">
            <input type="password" id="rePassword" name="rePassword" value={formData.rePassword} onChange={handleChange} />
          </div>

          <div className="submit" onClick={handleSubmit}>
            <p>Create Account</p>
          </div>
        </form>
      </div>

      <div className="msg">
        {message && (
          <div className={`message-box ${messageType}`}>
            <p>{message}</p>
          </div>
        )}
      </div>

      {isOtpSent && <OTPVerification formData={formData} />}
    </>
  );
};

export default Signup;
