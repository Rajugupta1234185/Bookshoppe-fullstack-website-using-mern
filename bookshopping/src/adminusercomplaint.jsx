import React, { useState, useEffect } from "react";
import './reviewdemoseller.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
const Adminusercomplaint = () => {
    const navigate=useNavigate();
    const [togglevalue, settogglevalue] = useState(false);
    const toggle = () => settogglevalue((prev) => !prev);
    
    const [usercomplaint, setusercomplaint] = useState([]);
    const [selectedcomplaint, setSelectedUser] = useState(null);

    const Usercomplaint = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/sent/getusercomplaint');
            setusercomplaint(response.data.enrichedComplaints || []);
            console.log("usercomplaint",usercomplaint);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        }
    };

    useEffect(() => {
        Usercomplaint();
    }, []);


    ///handle complaint status

    const handlecomplaintstatus = async () => {
        try {
            const response = await axios.post('http://localhost:5000/api/sent/updatestatus', {
                _id: selectedcomplaint.id
            });
    
            alert(response.data.message);
            setSelectedUser(null); // Close popup
            Usercomplaint(); // Refresh list
        } catch (error) {
            console.error("Error updating status:", error);
            alert("Failed to update complaint status");
        }
    };


    /// end of this block of code


    const admindashboard=()=>{
        navigate('/admin');
    }


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
                <h2>Pending User's Complaints</h2>

                <div className="seller-grid">
                    {usercomplaint.length > 0 ? (
                        usercomplaint.map((complaint, idx) => (
                            <div key={idx} className="seller-card" onClick={() => setSelectedUser(complaint)}>
                                <h3>{complaint.fname} {complaint.lname}</h3>
                                <p>Status: {complaint.status}</p>
                            </div>
                        ))
                    ) : (
                        <p>No Pending Complaints</p>
                    )}
                </div>

                {selectedcomplaint && (
                    <div className="review-popup">
                        <h3>Complaint details</h3>
                        <p><strong>Name:</strong> {selectedcomplaint.fname} {selectedcomplaint.lname}</p>
                        <p><strong>Email:</strong> {selectedcomplaint.email}</p>
                        <p><strong>Text:</strong> {selectedcomplaint.text}</p>
                        <div className="buttons">
                            <button onClick={handlecomplaintstatus}>Reviewed</button>
                            <button onClick={() => setSelectedUser(null)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Adminusercomplaint;
