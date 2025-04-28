import React from "react";
import './UserandSeller.css';
import { useNavigate } from "react-router-dom";

const UserandSeller=()=>{
    const navigate=useNavigate();

    return(
        <div className="rolesection">
            <p>Select Role:</p>
            <div className="user" onClick={()=>{navigate('/afterdashboard')}}><p>USER</p></div>
            
            <div className="seller" onClick={()=>{navigate('/seller')}}><p>SELLER</p></div>
        </div>
    );
}

export default UserandSeller;