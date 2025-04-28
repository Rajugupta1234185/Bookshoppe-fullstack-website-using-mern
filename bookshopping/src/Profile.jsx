import React, { useState, useEffect } from "react";
import './Profile.css';
import axios from "axios";
import Cookies from 'js-cookie';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('profile');
  const [otpverify,setotpverify]= useState(false);
  const [otp,setotp]=useState("");

  //seller----------------------
  const [seller, setSeller] = useState({
    fname: '',
    lname: '',
    gender: '',
    phone: '',
    email: '',
    password: '',
    store: '',
    address: '',
    gstin: '',
    bankname:'',
    account: '',
    ifsc: ''
  });

  const [sellerError, setSellerError] = useState('');

  //functionto clear form
  const clearSellerForm = () => {
    setSeller({
      fname: '',
      lname: '',
      gender: '',
      phone: '',
      email: '',
      password: '',
      store: '',
      address: '',
      gstin: '',
      bankname: '',
      account: '',
      ifsc: ''
    });
    setotp("");        // Clear the OTP input as well
    setSellerError(""); // Clear error messages
  };
  
  //

  const updateSeller = (field, value) => {
    setSeller(prev => ({ ...prev, [field]: value }));
  };

  const validateAndRegister = async () => {
    const {
      fname, lname, gender, phone, email, password,
      store, address,bankname, account, ifsc
    } = seller;

    if (!fname || !lname || !gender || !store || !address || !bankname || !account || !ifsc) {
      setSellerError("All fields except GSTIN are required.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      setSellerError("Email must end with @gmail.com.");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setSellerError("Phone number must be exactly 10 digits.");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      setSellerError("Password must be 8+ characters with upper, lower, number & special char.");
      return;
    }

    if (isNaN(account)) {
      setSellerError("Account number must be numeric.");
      return;
    }

    // ✅ All validations passed – create aobj
    const aobj = {
      fname: fname,
      lname: lname,
      gender,
      phone,
      email,
      password,
      store:store,
      address,
      gstin: seller.gstin,
      bank: seller.bankname,
      account: account,
      ifscCode: ifsc
    };

    console.log("✅ Validated Seller Object (aobj):", aobj);

    try{
   setotpverify(!otpverify);
   //otpverification section
   const server_response = await axios.post('http://localhost:5000/api/sendotp/send-otp', {
    gmail: email, // Ensure this is sent as an object
  });

  alert(server_response.data.message);


}
 catch (error) {
  console.error("Error:", error); // Debugging
  alert(error.response?.data?.message || "An error occurred while sending OTP.");
}





    // TODO: send `aobj` to backend using axios or save to local storage here
  };

  const cancelotp=()=>{
    setotpverify(false);
  }

  const proceedotp= async()=>{
    const res = await axios.post('http://localhost:5000/api/verifyotp/verify-otp', { 
      gmail: seller.email, 
      otp: otp, // Pass the OTP as a string
    });
    
    alert(res.data.message);  // Show success message from the server
    if (res.status === 200) {
       console.log("above post");
       console.log("Seller object being sent:", seller);

       const response=await axios.post('http://localhost:5000/api/demosellerroute/registerdemoseller',seller);
       console.log("below poast");
        alert(response.data.message);

        setotpverify(false);
        clearSellerForm();
    }
  }

  

 

  // Fetch Profile with token validation
  const fetchProfile = async () => {
    const token = Cookies.get('token');
    console.log("Token from cookie:", token);

    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/getprofile', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // If success, store profile
      const user = response.data;
      if (user && user.gmail) {
        const userInfo = {
          email: user.gmail,
          fname: user.fname,
          lname: user.lname,
          phone: user.phone
        };
        setProfile(userInfo);
      } else {
        setError("Invalid user data received.");
      }

      setLoading(false);
    } catch (err) {
      setError("Invalid or expired token. Please log in again.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);



  //Notification view setup
  const [allnotification, setallnotification] = useState([]);
 
  
  const setnotificationview = async () => {
    setView('notification');
  
    try {
      const response = await axios.post(
        'http://localhost:5000/api/sent/getusernotification',
        { email: profile.email } // ✅ Properly formatted body
      );
  
      setallnotification(response.data.allNotifications);
      
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  

  //end of this block  of code

  // usercomplaint box
       const[usercomplaintmsg,setusercomplaintmsg]=useState('');
       const handleSendComplaint = async () => {
        const token = Cookies.get('token');
      
        if (!token) {
          alert("You must be logged in to submit a complaint.");
          return;
        }
      
        try {
          const response = await axios.post(
            'http://localhost:5000/api/sent/sendusercomplaint',
            {
              token,
              text: usercomplaintmsg,
            },
            {
              withCredentials: true // ✅ moved to config object
            }
          );
      
          alert(response.data.message);
        } catch (error) {
          console.error("Axios error:", error);
          alert(error.response?.data?.message || "Failed to send complaint.");
        }
      };
      
  //end of this block of code


  //handle logout

  const handleLogout = () => {
    Cookies.remove('token'); // Remove the auth token
    window.location.href = '/login'; // Redirect to login page or home
  };
  //end

  return (
    <div className="home-maincontent">
      {/* Top Bar */}
      <div className="firstdiv">
        <div className="home-logo">
          <img src="/logo.gif.gif" alt="Logo Animation" className="logo-gif" />
        </div>

        <div className="home-searchbar">
          <input type="text" placeholder="What do you want to Read?" id="search" />
        </div>

        <div style={{ display: "flex" }}>
          <div className="cart"><p>Cart</p></div>
          <div className="signin"><p>Profile</p></div>
        </div>
      </div>

      {/* Sidebar Navigation */}
      <div className="profilesection">
        <div className="Yourprofile" onClick={() => setView('profile')}><p>Your Profile</p></div>
        <div className="Orderhistory" onClick={() => setView('history')}><p>Order History</p></div>
        <div className="Updatedetails" onClick={() => setView('update')}><p>Update Personal Details</p></div>
        <div className="createselleraccount" onClick={() => setView('seller')}><p>Create Seller Account</p></div>
        <div className="Complaintbox" onClick={() => setView('complaint')}><p>Complaint Box</p></div>
        <div className="Notificationbar" onClick={setnotificationview}><p>Notification</p></div>
        <div className="Logout" onClick={handleLogout}><p>Log out</p></div>
      </div>

      {/* Dynamic Main Content */}
      <div className="Maincontentarea">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            {view === 'profile' && profile && (
              <div>
                <h3>Profile Information</h3>
                <p><strong>Email:</strong> {profile.email}</p>
                <p><strong>First Name:</strong> {profile.fname}</p>
                <p><strong>Last Name:</strong> {profile.lname}</p>
                <p><strong>Phone:</strong> {profile.phone}</p>
              </div>
            )}

            {view === 'history' && (
              <div>
                <h3>Your Order History</h3>
                <p>No orders yet.</p>
              </div>
            )}

            {view === 'update' && (
              <div>
                <h3>Update Personal Details</h3>
                <input type="text" placeholder="Update First Name" />
                <input type="text" placeholder="Update Last Name" />
                <input type="text" placeholder="Update Phone" />
              </div>
            )}

            {view === 'seller' && (
               <div className="seller-form-container">
               <h2>Seller Registration</h2>
     
               <div style={{ display: "flex", gap: "10%" }}>
                 <div>
                   <label>First Name</label>
                   <input type="text" value={seller.fname} onChange={e => updateSeller('fname', e.target.value)} placeholder="First Name" />
                 </div>
                 <div>
                   <label>Last Name</label>
                   <input type="text" value={seller.lname} onChange={e => updateSeller('lname', e.target.value)} placeholder="Last Name" />
                 </div>
               </div>
     
               <div style={{ display: "flex", gap: "13%", marginTop: "10px" }}>
                 <div>
                   <label>Gender</label>
                   <input type="text" value={seller.gender} onChange={e => updateSeller('gender', e.target.value)} placeholder="Gender" />
                 </div>
                 <div>
                   <label>Phone</label>
                   <input type="text" value={seller.phone} onChange={e => updateSeller('phone', e.target.value)} placeholder="Phone Number" />
                 </div>
               </div>
     
               <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
                 <label>Email</label>
                 <input type="email" value={seller.email} onChange={e => updateSeller('email', e.target.value)} placeholder="Email Address" />
     
                 <label>Password</label>
                 <input type="password" value={seller.password} onChange={e => updateSeller('password', e.target.value)} placeholder="Secure Password" />
     
                 <label>Store Name</label>
                 <input type="text" value={seller.store} onChange={e => updateSeller('store', e.target.value)} placeholder="Your Store Name" />
     
                 <label>Business Address</label>
                 <input type="text" value={seller.address} onChange={e => updateSeller('address', e.target.value)} placeholder="Full Address" />
     
                 <label>GSTIN / VAT Number</label>
                 <input type="text" value={seller.gstin} onChange={e => updateSeller('gstin', e.target.value)} placeholder="Optional" />
                  
                 <label>Bank Name</label>
                 <input type="text" value={seller.bankname} onChange={e => updateSeller('bankname', e.target.value)} placeholder="Bank Name" />
                 <label>Bank Account Number</label>
                 <input type="text" value={seller.account} onChange={e => updateSeller('account', e.target.value)} placeholder="Account Number" />
     
                 <label>IFSC Code</label>
                 <input type="text" value={seller.ifsc} onChange={e => updateSeller('ifsc', e.target.value)} placeholder="IFSC Code" />
               </div>
     
               <button style={{ marginTop: "20px" }} onClick={validateAndRegister}>Register</button>
     
               {sellerError && (
                 <p style={{ marginTop: "10px", color: sellerError.startsWith("✅") ? "green" : "red" }}>
                   {sellerError}
                 </p>
               )}
             </div>
           )}
            

            {view === 'complaint' && (
        <div>
          <h3>Complaint Box</h3>
          <textarea
            placeholder="Write your complaint here..."
            value={usercomplaintmsg}
            onChange={(e) => setusercomplaintmsg(e.target.value)}
          />
          <br />
          <button onClick={handleSendComplaint}>Send</button>
        </div>
      )}

{view === 'notification' && (
  <div className="notification-view">
    <h2>🔔 All Notifications</h2>

    {allnotification.length === 0 ? (
      <p>No notifications available.</p>
    ) : (
      <ul>
        {[...allnotification]
          .sort(
            (a, b) =>
              new Date(b.createdAt || b.timestamp) -
              new Date(a.createdAt || a.timestamp)
          )
          .map((note, index) => (
            <li
              key={index}
              className={note.isSeen ? "true" : "false"}
              style={{
                marginBottom: "12px",
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "8px",
                backgroundColor: note.isSeen ? "#f9f9f9" : "#e6f7ff"
              }}
            >
              <strong>{note.title || "No Title"}</strong>
              <p>{note.message}</p>
              <small>{new Date(note.createdAt || note.timestamp).toLocaleString()}</small>
            </li>
          ))}
      </ul>
    )}
  </div>
)}




            {view === 'logout' && (
              <div>
                <h3>You have been logged out.</h3>
                <p>Redirecting to homepage...</p>
                {Cookies.remove('token')}
                {/* You can redirect here using useNavigate or window.location */}
              </div>
            )}
          </>
        )}
      </div>
   {otpverify &&
    <div class="otpverify">
      <div className="enterotp"><p>Enter OTP</p></div>
      <div className="inputotp"><input type="text"   value={otp}
        onChange={(e) => setotp(e.target.value)} className="inputotpbox"/></div>
      <div className="otp">
        <div className="cancelotp" onClick={cancelotp}><p>Cancel</p></div>
        <div className="proceedotp" onClick={proceedotp}><p>Proceed</p></div>
        </div>

    </div>
}
    </div>
  );
};

export default Profile;
