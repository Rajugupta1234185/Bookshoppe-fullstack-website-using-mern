// AuthPage.jsx
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';
import Gmailverification from './OTPVerification';
import Forgetpassword from './forgetpassword';

const AuthPage = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <Routes>
        <Route
          path="/"
          element={<Login onCreateAccount={() => navigate('/signup')} onforgetfunction={() => navigate('/forget')} />}
        />
        <Route
          path="/signup"
          element={<Signup gotootp={() => navigate('/otpverification')} />}
        />
        <Route
          path="/forget"
          element={<Forgetpassword backtohome={() => navigate('/')} />}
        />
        <Route
          path="/otpverification"
          element={<Gmailverification backtologin={() => navigate('/')} backtoregistration={() => navigate('/signup')} />}
        />
      </Routes>
    </div>
  );
};

export default AuthPage;
