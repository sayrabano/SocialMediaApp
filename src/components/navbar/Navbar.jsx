import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import ChatBubbleIcon from "@mui/icons-material/ChatBubble";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link } from "react-router-dom";
import "./navbar.scss";
import { useContext } from "react";
import { AuthContext } from "./../../context/AuthContext";

const Navbar = () => {
  
  const { currentUser } = useContext(AuthContext);
  return (
    <div className="navbarContainer">
      <div className="navbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Social Media App</span>
        </Link>
      </div>
      
      <div className="navbarRight">
       
        <Link to={`/profile/${currentUser.displayName}`}>
          <img src={currentUser.photoURL} alt="" className="navbarImg" />
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
