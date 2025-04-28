import React, { useState, useEffect } from "react";
import { useSpring, animated } from "@react-spring/web";
import { RequiredValidate } from "./errorhandling";
import axios from "axios";
import { useFormData } from "./FormDataContext"; // Correctly import the hook
import { useNavigate } from "react-router-dom";

const OTPVerification = ({ backtoregistration, backtologin }) => {
  const navigate= useNavigate();
  const { formData, setFormData } = useFormData(); // Access formData and setFormData from context
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });

  const messageAnim = useSpring({
    opacity: message.text ? 1 : 0,
    transform: message.text ? "scale(1)" : "scale(0.5)",
    config: { tension: 200, friction: 15 },
  });

  useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => setMessage({ text: "", type: "" }), 1500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async () => {
    // if (!formData || !formData.gmail) {
    //   setMessage({ text: "Please provide a valid Gmail address.", type: "error" });
    //   return;
    // }
    alert(`${formData.gmail}`);

    const validationMsg = RequiredValidate(otp, "OTP");

    if (validationMsg) {
      setMessage({ text: validationMsg, type: "error" });
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/verifyotp/verify-otp", {
        gmail: formData.gmail,
        otp: otp,
      });

      setMessage({ text: res.data.message, type: "success" });
      navigate('/login');

      
        const response = await axios.post("http://localhost:5000/api/registration/registration", {
          fname: formData.fname,
          lname: formData.lname,
          gmail: formData.gmail,
          phone: formData.phone,
          password: formData.password,
        });

    

        if (response.status === 400) {
          backtoregistration();
        }
         else if (response.status === 200) {
          navigate('/login');
        }

        setStep(2);
        setTimeout(() => setStep(3), 3000);
      }
     catch (error) {
      
      const errorMsg = error.response?.data?.message || "An unexpected error occurred";
      setMessage({ text: errorMsg, type: "error" });
    }
  };

  return (
    <div style={styles.fullContainer}>
      {message.text && (
        <animated.div
          style={{
            ...styles.messageBox,
            ...messageAnim,
            backgroundColor: message.type === "error" ? "#ffcccc" : "#ccffcc",
          }}
        >
          <p style={{ color: message.type === "error" ? "#ff0000" : "#008000" }}>
            {message.text}
          </p>
        </animated.div>
      )}

      <div style={styles.container}>
        {step === 1 && (
          <div style={styles.box}>
            <label style={styles.label}>Enter OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={styles.input}
            />
            <button onClick={handleSubmit} style={styles.button}>
              Submit
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={styles.box}>
            <button style={styles.processingButton}>Processing...</button>
          </div>
        )}

        {step === 3 && (
          <div style={styles.box}>
            <p style={styles.successMessage}>User Registered successfully</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  fullContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#4A0072",
    flexDirection: "column",
  },
  messageBox: {
    padding: "10px",
    borderRadius: "5px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "bold",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
  },
  container: {
    display: "flex",
    alignItems: "center",
    padding: "20px",
    backgroundColor: "#4A0072",
    borderRadius: "12px",
  },
  box: {
    minWidth: "200px",
    padding: "30px",
    backgroundColor: "#4B4892",
    borderRadius: "20px",
    textAlign: "center",
  },
  label: { display: "block", color: "#fff", marginBottom: "10px" },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "5px",
    border: "none",
    outline: "none",
    backgroundColor: "#ff40a0",
    color: "#fff",
    fontSize: "16px",
    marginBottom: "10px",
  },
  button: {
    backgroundColor: "#ff40a0",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  processingButton: {
    backgroundColor: "#ff40a0",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "5px",
    fontSize: "16px",
  },
  successMessage: {
    backgroundColor: "#D9D9D9",
    color: "#000",
    padding: "10px",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
  },
};

export default OTPVerification;
