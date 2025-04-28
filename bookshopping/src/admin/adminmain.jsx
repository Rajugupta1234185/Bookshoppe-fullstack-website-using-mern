import React, { useEffect, useState } from "react";
import "./adminmain.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Admin = () => {
  const navigate = useNavigate();
  const [togglevalue, settogglevalue] = useState(false);
  const [pendingcount, setPendingCount] = useState(0);
  const [complaintCount, setComplaintCount] = useState(0);
  const [usercomplaintcount, setusercomplaintcount] = useState(0);

  const [userEmail, setUserEmail] = useState('');
  const [userSubject, setUserSubject] = useState('');
  const [userMessage, setUserMessage] = useState('');

  const [usernotification, setusernotification] = useState(false);
  const [sellernotification, setsellernotification] = useState(false);

  const [showUserGrid, setShowUserGrid] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const toggle = () => settogglevalue(prev => !prev);

  useEffect(() => {
    const fetchDemoSellers = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/demoseller/pending");
        setPendingCount(response.data.count);
      } catch (error) {
        console.error("Error fetching pending seller count:", error);
      }
    };
    fetchDemoSellers();
  }, []);

  useEffect(() => {
    const fetchComplaintCount = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/demosellerinfo/sellercomplaintcount');
        setComplaintCount(response.data.data);
      } catch (err) {
        console.error('Failed to fetch seller complaint count:', err.message);
      }
    };
    fetchComplaintCount();
  }, []);

  useEffect(() => {
    const fetchusercomplaint = async () => {
      try {
        const response = await axios.post('http://localhost:5000/api/sent/getusercomplaintcount');
        setusercomplaintcount(response.data.count);
      } catch (err) {
        console.error('Failed to fetch user complaint count:', err.message);
      }
    };
    fetchusercomplaint();
  }, []);

  const reviewdemoseller = () => navigate('/reviewdemoseller');
  const sellercomplaint = () => navigate('/adminsellercomplaint');
  const reviewusercomplaint = () => navigate('/adminusercomplaint');

  const Usermsgbox = () => setusernotification(!usernotification);
  const sellermsgbox = () => setsellernotification(!sellernotification);

  const sendUserNotification = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/sent/usernotification", {
        email: userEmail,
        title: userSubject,
        message: userMessage,
      });
      alert(response.data.message);
      setUserEmail('');
      setUserSubject('');
      setUserMessage('');
      setusernotification(false);
    } catch (error) {
      console.error("Failed to send user notification:", error);
      alert("Failed to send notification ❌");
    }
  };

  const sendSellerNotification = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/sent/sellernotification", {
        email: userEmail,
        title: userSubject,
        message: userMessage,
      });
      alert(response.data.message);
      setUserEmail('');
      setUserSubject('');
      setUserMessage('');
      setsellernotification(false);
    } catch (error) {
      console.error("Failed to send seller notification:", error);
      alert("Failed to send notification ❌");
    }
  };

  const handleLogout = () => {
    Cookies.remove('token');
    window.location.href = '/login';
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/fetch/userinfo");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleUserClick = () => {
    setShowUserGrid(true);
    fetchUsers();
  };

  const handleRemoveUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/fetch/users/${userId}`);
      alert("User removed successfully!");
      setUsers(users.filter(user => user._id !== userId));
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to remove user:", error);
      alert("Failed to remove user ❌");
    }
  };

  return (
    <div className="admin-main">
      {/* Sidebar Navbar */}
      <div className={`admin-navbar ${togglevalue ? "show" : "hide"}`}>
        <div className="togglebar" onClick={toggle}>☰</div>
        <div className="navbar-content">
          <div className="admin-dashboard" style={{ color: 'chartreuse' }} onClick={()=>{setShowUserGrid(false)}}>Dashboard</div>
          <div className="admin-seller">Seller</div>
          <div className="admin-user" onClick={handleUserClick} >User</div>
          <div className="product">Product</div>
          <div className="admin-profile">Profile</div>
          <div className="admin-logout" onClick={handleLogout}><p>LOG OUT</p></div>
        </div>
      </div>

      {!showUserGrid && (
  <div className="display-box">
    {/* Dashboard Boxes */}
    <div className="display-box11">
      <div className={`adminbox1 ${pendingcount > 0 ? "pending-highlight" : ""}`} onClick={reviewdemoseller}>
        <p>New seller</p>
        {pendingcount > 0 && <span className="pending-count">{pendingcount}</span>}
      </div>
      <div className="adminbox2"><p>New Books</p></div>
      <div className={`adminbox3 ${complaintCount > 0 ? "pending-highlight" : ""}`} onClick={sellercomplaint}>
        <p>Seller’s Complaints</p>
        {complaintCount > 0 && <span className="pending-count">{complaintCount}</span>}
      </div>
      <div className={`adminbox4 ${usercomplaintcount > 0 ? "pending-highlight" : ""}`} onClick={reviewusercomplaint}>
        <p>User's Complaints</p>
        {usercomplaintcount > 0 && <span className="pending-count">{usercomplaintcount}</span>}
      </div>
      <div className="adminbox5" onClick={sellermsgbox}><p>Msg to Seller</p></div>
      <div className="adminbox6" onClick={Usermsgbox}><p>Msg to User</p></div>
    </div>
  </div>
)}


      {/* User Notification Form */}
      {usernotification && (
        <div className="compose-box">
          <div className="compose-header">
            <span>New Message</span>
            <button className="close-btn" onClick={Usermsgbox}>×</button>
          </div>
          <div className="compose-body">
            <input type="email" placeholder="To" className="compose-input" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
            <input type="text" placeholder="Subject" className="compose-input" value={userSubject} onChange={(e) => setUserSubject(e.target.value)} />
            <textarea placeholder="Message" className="compose-textarea" value={userMessage} onChange={(e) => setUserMessage(e.target.value)}></textarea>
          </div>
          <div className="compose-footer">
            <button className="send-btn" onClick={sendUserNotification}>Send</button>
          </div>
        </div>
      )}

      {/* Seller Notification Form */}
      {sellernotification && (
        <div className="compose-box">
          <div className="compose-header">
            <span>New Message</span>
            <button className="close-btn" onClick={sellermsgbox}>×</button>
          </div>
          <div className="compose-body">
            <input type="email" placeholder="To" className="compose-input" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
            <input type="text" placeholder="Subject" className="compose-input" value={userSubject} onChange={(e) => setUserSubject(e.target.value)} />
            <textarea placeholder="Message" className="compose-textarea" value={userMessage} onChange={(e) => setUserMessage(e.target.value)}></textarea>
          </div>
          <div className="compose-footer">
            <button className="send-btn" onClick={sendSellerNotification}>Send</button>
          </div>
        </div>
      )}

      {/* User List Grid */}
      {showUserGrid && (
        <div className="user-grid">
          {users.map((user, index) => (
            <div key={index} className="user-card" onClick={() => setSelectedUser(user)}>
              <p>{user.gmail}</p>
            </div>
          ))}
        </div>
      )}

      {/* Selected User Info */}
      {selectedUser && (
        <div className="user-details">
          <h3>User Info</h3>
          <p>Email: {selectedUser.gmail}</p>
          <p>Name: {selectedUser.fname}  {selectedUser.lname}</p>
          <p>Phone: {selectedUser.phone}</p>
          <p>Created At: {selectedUser.createdAt}</p>

          <button onClick={() => handleRemoveUser(selectedUser._id)}>Remove</button>
          <button onClick={()=>setSelectedUser(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Admin;
