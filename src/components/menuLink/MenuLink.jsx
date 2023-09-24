import React, { useContext } from "react";
import "./menuLink.scss";
import { AuthContext } from "./../../context/AuthContext";
import { Link } from "react-router-dom";


const MenuLink = ({ Icon, text, to }) => {
  const { currentUser } = useContext(AuthContext);

  // If a "to" prop is provided, use it for navigation; otherwise, render regular text
  const linkElement = to ? (
    <Link to={to} className="menuLinkText link-no-underline"> {/* Add the link-no-underline class */}
      {text}
    </Link>
  ) : (
    <span className="menuLinkText">{text}</span>
  );

  return (
    <div className="menuLink">
      {Icon}
      {linkElement}
      <span className="menuLinkTextName">
        {text === "Logout" && `(${currentUser.displayName})`}
      </span>
    </div>
  );
};

export default MenuLink;
