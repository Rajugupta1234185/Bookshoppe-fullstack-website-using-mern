import React, { useState, useEffect } from "react";
import './reviewdemoseller.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Reviewdemoseller = () => {
    const navigate=useNavigate();
    const [togglevalue, settogglevalue] = useState(false);
    const [sellers, setSellers] = useState([]);
    const [selectedSeller, setSelectedSeller] = useState(null);
    const [loading, setLoading] = useState(false); // To manage loading state

    const toggle = () => settogglevalue((prev) => !prev);

    const extractdemosellerinfo = async () => {
        setLoading(true); // Start loading
        try {
            const response = await axios.get('http://localhost:5000/api/demosellerinfo/demosellerfullinfo');
            setSellers(response.data.data);
        } catch (error) {
            console.error("Error fetching sellers:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    const handleStatusUpdate = async (id, status) => {
        setLoading(true);
        console.log("above fetch");
        try {
            // Use PUT instead of PATCH for updating the status
            const response = await axios.put(`http://localhost:5000/api/demosellerinfo/update-status/${id}`, { status });
            console.log("below fetch");  // Log the response to see if the backend returns a success message
            setSelectedSeller(null); // Close modal/form
            extractdemosellerinfo(); // Refresh list of sellers
        } catch (error) {
            console.error("Error updating seller status:", error);  // Log any errors from the backend
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        extractdemosellerinfo();
    }, []);


    //admin dashboard
        const admindashboard=()=>{
            navigate('/admin');
        }
    //end of admin dashboard


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
                <h2>Pending Sellers</h2>
                {loading ? <p>Loading...</p> : null}  {/* Display loading message */}
                <div className="seller-grid">
                    {sellers.length > 0 ? (
                        sellers.map((seller, idx) => (
                            <div key={idx} className="seller-card" onClick={() => setSelectedSeller(seller)}>
                                <h3>{seller.fname} {seller.lname}</h3>
                                <p>Status: {seller.status}</p>
                            </div>
                        ))
                    ) : (
                        <p>No sellers available</p> // Show message if no sellers
                    )}
                </div>

                {selectedSeller && (
                    <div className="review-popup">
                        <h3>Seller Details</h3>
                        <p><strong>Name:</strong> {selectedSeller.fname} {selectedSeller.lname}</p>
                        <p><strong>Email:</strong> {selectedSeller.email}</p>
                        <p><strong>Phone:</strong> {selectedSeller.phone}</p>
                        <p><strong>Store:</strong> {selectedSeller.store}</p>
                        <p><strong>Address:</strong> {selectedSeller.address}</p>
                        <div className="buttons">
                            <button onClick={() => handleStatusUpdate(selectedSeller._id, "Approved")}>Approve</button>
                            <button onClick={() => handleStatusUpdate(selectedSeller._id, "Rejected")}>Reject</button>
                            <button onClick={() => setSelectedSeller(null)}>Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviewdemoseller;
