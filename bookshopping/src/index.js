import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import Router and Routes
import { FormDataProvider } from './FormDataContext'; // Import the provider

import Login from './Login';
import Signup from './Signup';
import Forgetpassword from './forgetpassword';
import Dashboard from './Dashboard';
import Profile from './Profile';
import AfterDashboard from './afterlogin';

import Allrole from './allRole';
import UserandAdmin from './UserandAdmin';
import UserandSeller from './UserandSeller';
import AdminandSeller from './AdminandSeller';
import Admin from './admin/adminmain';
import Seller from './Seller';
import Reviewseller from './reviewdemoseller';
import Adminsellercomplaint from './Adminsellercomplaint';
import Adminusercomplaint from './adminusercomplaint';
import Otpverify from './OTPVerification';
import Cart from './Cart';


function App() {
  return (
    <Router>
      <div className="auth-container">
        <Routes>
          {/* Define Routes for each page */}
          <Route path="/" element={<Dashboard />} /> {/* Default route to login */}
          <Route path="/createnewaccount" element={<Signup />}/>
          <Route path="/forgetpassword" element={<Forgetpassword/>}/>
          <Route path="/backtohome" element={<Login/>}/>
          <Route path="/afterdashboard" element={<AfterDashboard/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/allRole" element={<Allrole/>}/>
          <Route path="/UserandAdmin" element={<UserandAdmin/>}/>
          <Route path="/UserandSeller" element={<UserandSeller/>}/>
          <Route path="/AdminandSeller" element={<AdminandSeller/>}/>
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/seller" element={<Seller/>}/>
          <Route path="/reviewdemoseller" element={<Reviewseller/>}/>
          <Route path="/adminsellercomplaint" element={<Adminsellercomplaint/>}/>
          <Route path="/adminusercomplaint" element={<Adminusercomplaint/>}/>
          <Route path="/otpverify" element={<Otpverify/>}/>
          <Route path="/cart" element={<Cart/>}/>
        </Routes>
      </div>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FormDataProvider>  {/* Wrap the App with the provider */}
      <App />
    </FormDataProvider>
  </React.StrictMode>
);
