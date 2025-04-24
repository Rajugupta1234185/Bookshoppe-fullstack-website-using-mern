import React from "react";
import './allRole.css';

const Allrole=()=>{

    return(
        <div className="rolesection">
            <p>Select Role:</p>
            <div className="user"><p>USER</p></div>
            <div className="admin"><p>ADMIN</p></div>
            <div className="seller"><p>SELLER</p></div>
        </div>
    );
}
export default Allrole;