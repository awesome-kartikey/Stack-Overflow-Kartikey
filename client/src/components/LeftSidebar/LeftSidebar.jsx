import React from "react";

import "./LeftSidebar.css";
import { NavLink } from "react-router-dom";
import Globe from "../../Assets/Globe.svg";

const leftSidebar = () => {
  return (
    <div className="left-side-bar">
      <nav className="side-nav">
        <NavLink to="/" className={({ isActive }) => "side-nav-links" + (isActive ? " active" : "")} >
          <p>Home</p>
        </NavLink>
          <div className="side-nav-div">
          <div>
            <p>Public</p>
          </div>
          <NavLink to="/Questions" className="side-nav-links">
            <img src={Globe} alt="Globe" />
            <p style={{ paddingLeft: "10px" }}>Questions</p>
          </NavLink>

          <NavLink to='/Tags' className={({ isActive }) => "side-nav-links" + (isActive ? " active" : "")} style={{ paddingLeft: "40px" }} >
            <p>Tags</p>
          </NavLink>
          <NavLink to='/Users' className={({ isActive }) => "side-nav-links" + (isActive ? " active" : "")} style={{ paddingLeft: "40px" }} >
            <p>Users</p>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default leftSidebar;
