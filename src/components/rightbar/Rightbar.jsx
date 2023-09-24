import React from "react";
import "./rightbar.scss";
import ProfileRightBar from "./../profileRightBar/ProfileRightBar";

const Rightbar = ({ profile }) => {
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {profile ? <ProfileRightBar /> : ""}
      </div>
    </div>
  );
};

export default Rightbar;
