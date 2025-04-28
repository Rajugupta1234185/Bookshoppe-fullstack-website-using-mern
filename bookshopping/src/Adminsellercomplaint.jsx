import React, { useState, useEffect } from "react";
import './Adminsellercomplaint.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";


const Reviewdemoseller = () => {
    const navigate = useNavigate();

    const [togglevalue, settogglevalue] = useState(false);
    const [complaints, setComplaints] = useState([]);
    const [selectedComplaint, setSelectedComplaint] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

    const toggle = () => settogglevalue((prev) => !prev);

    const getComplaints = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/demosellerinfo/getcomplaints');
            setComplaints(response.data);
        } catch (err) {
            console.error("Error fetching complaints", err);
        }
    };

    useEffect(() => {
        getComplaints();
    }, []);

    const openPopup = (complaint) => {
        setSelectedComplaint(complaint);
        setShowPopup(true);
    };

    const closePopup = () => {
        setShowPopup(false);
        setSelectedComplaint(null);
    };

    const markAsReviewed = () => {
        alert('Complaint marked as reviewed');
        closePopup();
    };


    //return to dashboard
     const admindashboard=()=>{
          navigate('/admin');
     }
    //end of this line of code

      //handle logout
    
      const handleLogout = () => {
        Cookies.remove('token'); // Remove the auth token
        window.location.href = '/login'; // Redirect to login page or home
      };
      //end

    return (
        <div className="admin-main">
            <div className={`admin-navbar ${togglevalue ? "show" : "hide"}`}>
                <div className="togglebar" onClick={toggle}>☰</div>
                <div className="navbar-content">
                    <div className="admin-dashboard" onClick={admindashboard}>Dashboard</div>
                    <div className="admin-seller">Seller</div>
                    <div className="admin-user">User</div>
                    <div className="product">Product</div>
                    <div className="admin-profile">Profile</div>
                    <div className="admin-logout" onClick={handleLogout}><p>LOG OUT</p></div>
                </div>
            </div>

            <div className="display-box">
                <h2>Seller Complaints</h2>
                <div className="complaints-grid">
                    {complaints.map((item, index) => (
                        <div className="complaint-card" key={index} onClick={() => openPopup(item)}>
                            
                            <p><strong>Gmail:</strong> {item.email}</p>
                        </div>
                    ))}
                </div>
            </div>

            {showPopup && selectedComplaint && (
                <div className="popup-overlay" onClick={closePopup}>
                    <div className="popup-box" onClick={e => e.stopPropagation()}>
                        <h3>Complaint Details</h3>
                        <p><strong>By:</strong> {selectedComplaint.fname + ' '+selectedComplaint.lname}</p>
                        <p><strong>Gmail:</strong> {selectedComplaint.email}</p>
                        <p><strong>Message:</strong> {selectedComplaint.text}</p>
                        <button onClick={markAsReviewed}>Reviewed</button>
                        <button onClick={closePopup}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reviewdemoseller;
