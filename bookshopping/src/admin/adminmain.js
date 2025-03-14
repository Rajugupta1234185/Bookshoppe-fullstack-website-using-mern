import React, { useState } from "react";
import "./adminmain.css";

const Admin = () => {
    // State to track sidebar visibility
    const [togglevalue, settogglevalue] = useState(false);

    // Function to toggle sidebar visibility
    const toggle = () => {
        settogglevalue((prev) => !prev);
    };

    return (
        <div className="admin-main">
            {/* Sidebar with dynamic class */}
            <div className={`admin-navbar ${togglevalue ? "show" : "hide"}`}>
                <div className="togglebar" onClick={toggle}>☰</div>
                {/* Navbar content that will be hidden when sidebar is hidden */}
                <div className="navbar-content">
                    <div className="admin-dashboard">Dashboard</div>
                    <div className="admin-seller">Seller</div>
                    <div className="admin-user">User</div>
                    <div className="product">Product</div>
                    <div className="admin-profile">Profile</div>
                    <div className="admin-logout"><p>LOG OUT</p></div>
                </div>
            </div>

            {/* Content box */}
            <div className="display-box">
                <div className="display-box11">
                 <div className="adminbox1">New seller</div>
                 <div className="adminbox2">New Books</div>
                 <div className="adminbox3">Seller`s complaints</div>
                 <div className="adminbox4">Users complaints</div>
                 <div className="adminbox5">Msg to seller</div>
                 <div className="adminbox6">Msg to user</div>
                    
                </div>

                <div className="dsiplay-box12">
                    <div className="adminfirstbox">Take command</div>
                </div>
                <div className="display-box2">
                   
                </div>
            </div>
        </div>
    );
};

export default Admin;
