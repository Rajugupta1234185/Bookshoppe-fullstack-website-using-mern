import React, { useEffect, useState } from "react";
import "./adminmain.css";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const Admin = () => {
    const navigate=useNavigate();
    const [togglevalue, settogglevalue] = useState(false);
    const [pendingcount, setPendingCount] = useState(0);

    const toggle = () => {
        settogglevalue((prev) => !prev);
    };

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
      


    const reviewdemoseller=()=>{
          navigate('/reviewdemoseller');
    }


    const [complaintCount, setComplaintCount] = useState(0);
    useEffect(() => {
        const fetchComplaintCount = async () => {
          try {
            const response = await axios.post('http://localhost:5000/api/demosellerinfo/sellercomplaintcount');
            setComplaintCount(response.data.data);
            console.log("hi");
          } catch (err) {
            console.error('Failed to fetch seller complaint count:', err.message);
          }
        };
        fetchComplaintCount();
      }, []);

      const sellercomplaint=()=>{
        navigate('/adminsellercomplaint')
      }
      
    return (
        <div className="admin-main">
            <div className={`admin-navbar ${togglevalue ? "show" : "hide"}`}>
                <div className="togglebar" onClick={toggle}>☰</div>
                <div className="navbar-content">
                    <div className="admin-dashboard">Dashboard</div>
                    <div className="admin-seller">Seller</div>
                    <div className="admin-user">User</div>
                    <div className="product">Product</div>
                    <div className="admin-profile">Profile</div>
                    <div className="admin-logout"><p>LOG OUT</p></div>
                </div>
            </div>

            <div className="display-box">
                <div className="display-box11">
                    <div className={`adminbox1 ${pendingcount > 0 ? "pending-highlight" : ""}`}  onClick={reviewdemoseller}>
                        <p>New seller</p>
                        {pendingcount > 0 && <span className="pending-count">{pendingcount}</span>}
                    </div>
                    <div className="adminbox2"><p>New Books</p></div>
                    <div className={`adminbox3 ${complaintCount > 0 ? "pending-highlight" : ""}`} onClick={sellercomplaint}>
  <p>Seller`s complaints</p>
  {complaintCount > 0 && <span className="pending-count">{complaintCount}</span>}
</div>

                    <div className="adminbox4"><p>Users complaints</p></div>
                    <div className="adminbox5"><p>Msg to seller</p></div>
                    <div className="adminbox6"><p>Msg to user</p></div>
                </div>
            </div>
        </div>
    );
};

export default Admin;
