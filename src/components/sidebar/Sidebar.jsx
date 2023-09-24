// Sidebar.js

import React, { useState } from "react";
import RssFeedIcon from "@mui/icons-material/RssFeed";
import ChatIcon from "@mui/icons-material/Chat";
import VideocamIcon from "@mui/icons-material/Videocam";
import GroupsIcon from "@mui/icons-material/Groups";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import EventIcon from "@mui/icons-material/Event";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";
import "./sidebar.scss";
import MenuLink from "../menuLink/MenuLink";
import Friends from "../friends/Friends";
import { Users } from "../../data";

import { signOut } from "firebase/auth";
import { auth } from "../../firebase";

const Sidebar = () => {
  const [showFeed, setShowFeed] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const handleFeedButtonClick = () => {
    setShowFeed(true);
  };

  const handleShowMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <MenuLink Icon={<RssFeedIcon />} text="Feed" />
        <MenuLink Icon={<ChatIcon />} text="Chats" />
        
        {/* Show Videos, Friends, and Bookmarks based on showMore state */}
        {showMore && (
          <>
            <MenuLink Icon={<VideocamIcon />} text="Videos" to={"https://www.youtube.com/"} target="_blank" />
            <MenuLink Icon={<GroupsIcon />} text="Friends" />
            <MenuLink Icon={<BookmarkIcon />} text="Bookmarks" />
          </>
        )}

        {/* Show/Hide button based on showMore state */}
        <button className="sidebarButton" onClick={handleShowMoreClick}>
          {showMore ? "Show Less" : "Show More"}
        </button>

        <hr className="sidebarHr" />

        <ul className="sidebarFriendList">
          {Users.map((u) => (
            <Friends key={u.id} user={u} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
