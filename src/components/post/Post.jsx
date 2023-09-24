import React, { useContext, useEffect, useState, useRef } from "react";
import "./post.scss";
import { IconButton } from "@mui/material";
import {
  ChatBubbleOutline,
  MoreVert,
  Favorite,
  ThumbUp,
  ThumbUpAltOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import TimeAgo from "react-timeago";
import { Link } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Post = ({ post }) => {
  const [likes, setLikes] = useState([]);
  const [liked, setLiked] = useState(false);
  const [input, setInput] = useState("");
  const [comments, setComments] = useState([]);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentBoxVisible, setCommentBoxVisible] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const [shareCount, setShareCount] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.data.input);
  const [editedImage, setEditedImage] = useState(post.data.img);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // Use a ref to store a reference to the dropdown container
  const dropdownRef = useRef(null);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "posts", post.id, "likes"),
      (snapshot) => setLikes(snapshot.docs)
    );
    return () => {
      unSub();
    };
  }, [post.id]);

  useEffect(() => {
    setLiked(likes.findIndex((like) => like.id === currentUser?.uid) !== -1);
  }, [likes, currentUser.uid]);

  useEffect(() => {
    const unSub = onSnapshot(
      collection(db, "posts", post.id, "comments"),
      (snapshot) => {
        setComments(
          snapshot.docs.map((snapshot) => ({
            id: snapshot.id,
            data: snapshot.data(),
          }))
        );
      }
    );
    return () => {
      unSub();
    };
  }, [post.id]);

  const handleComment = async (e) => {
    e.preventDefault();

    await addDoc(collection(db, "posts", post.id, "comments"), {
      comment: input,
      displayName: currentUser.displayName,
      photoURL: currentUser.photoURL,
      uid: currentUser.uid,
      timestamp: serverTimestamp(),
    });
    setCommentBoxVisible(false);
    setInput("");
  };

  const likePost = async () => {
    if (liked) {
      await deleteDoc(doc(db, "posts", post.id, "likes", currentUser.uid));
    } else {
      await setDoc(doc(db, "posts", post.id, "likes", currentUser.uid), {
        userId: currentUser.uid,
      });
    }
  };
  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(post.data.input);
    setEditedImage(post.data.img);
  };

  const handleSaveEdit = async () => {
    try {
      // Update the post document in Firestore with editedText and editedImage
      await updateDoc(doc(db, "posts", post.id), {
        input: editedText,
        img: editedImage,
      });
      setIsEditing(false);
      console.log("Post updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };
  const handleShareClick = async () => {
    try {
      await navigator.share({
        title: post.data.title,
        text: post.data.description,
        url: window.location.href,
      });
      console.log("Post shared successfully!");
      // Increment the share count
      setShareCount(shareCount + 1);
    } catch (error) {
      console.error("Share failed:", error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    // Close the dropdown
    setIsDropdownOpen(false);
  };

  const handleDeleteClick = async () => {
    try {
      // Delete the post document from Firestore
      await deleteDoc(doc(db, "posts", post.id));
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Delete failed:", error);
    }
    // Close the dropdown
    setIsDropdownOpen(false);
  };

  // Add an event listener to the document body to close the dropdown
  useEffect(() => {
    const handleDocumentClick = (e) => {
      // Check if the click occurred outside of the dropdown container
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.body.addEventListener("click", handleDocumentClick);

    return () => {
      // Remove the event listener when the component unmounts
      document.body.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to="/profile/userId">
              <img
                src={post.data.photoURL}
                alt=""
                className="postProfileImg"
              />
            </Link>
            <span className="postUsername">
              @{post.data.displayName.replace(/\s+/g, "").toLowerCase()}
            </span>
            <span className="postDate">
              <TimeAgo
                date={new Date(
                  post.data?.timestamp?.toDate()
                ).toLocaleString()}
              />
            </span>
          </div>
          <div className="postTopRight">
            <div className="button-container" ref={dropdownRef}>
              <IconButton onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                <MoreVert className="postVertButton" />
              </IconButton>
              {isDropdownOpen && (
                <div className="moreDropdown">
                  <EditIcon
                    color="secondary"
                    onClick={handleEditClick}
                    className="dropdown-icon"
                  />
                  <DeleteIcon
                    color="warning"
                    onClick={handleDeleteClick}
                    className="dropdown-icon"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="postCenter">
          {isEditing ? (
            <div className="editForm">
              <textarea
                type="text"
                placeholder="Edit your post..."
                className="editInput"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <input
                type="text"
                placeholder="Edit image URL..."
                className="editInput"
                value={editedImage}
                onChange={(e) => setEditedImage(e.target.value)}
              />
              <button onClick={handleCancelEdit}>Cancel</button>
              <button onClick={handleSaveEdit}>Save</button>
            </div>
          ) : (
            <div className="postCenter">
              <span className="postText">{post.data.input}</span>
              <img src={post.data.img} alt="" className="postImg" />
            </div>
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <Favorite className="bottomLeftIcon" style={{ color: "red" }} />
            <ThumbUp
              onClick={(e) => {
                likePost();
              }}
              className="bottomLeftIcon"
              style={{ color: "#011631" }}
            />
            {likes.length > 0 && (
              <span className="postLikeCounter">{likes.length}</span>
            )}
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => setCommentOpen(!commentOpen)}
            >
              {comments.length} · comments · {shareCount} · shares
            </span>
          </div>
        </div>
        <hr className="footerHr" />
        <div className="postBottomFooter">
          <div
            className="postBottomFooterItem"
            onClick={(e) => {
              likePost();
            }}
          >
            {liked ? (
              <ThumbUp style={{ color: "#011631" }} className="footerIcon" />
            ) : (
              <ThumbUpAltOutlined className="footerIcon" />
            )}
            <span className="footerText">Like</span>
          </div>
          <div
            className="postBottomFooterItem"
            onClick={() => setCommentBoxVisible(!commentBoxVisible)}
          >
            <ChatBubbleOutline className="footerIcon" />
            <span className="footerText">Comment</span>
          </div>
          <div className="postBottomFooterItem">
            <ShareOutlined className="footerIcon" />
            <span className="footerText" onClick={handleShareClick}>
              Share
            </span>
          </div>
        </div>
      </div>
      {commentBoxVisible && (
        <form onSubmit={handleComment} className="commentBox">
          <textarea
            type="text"
            placeholder="Write a comment ..."
            className="commentInput"
            rows={1}
            style={{ resize: "none" }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit" disabled={!input} className="commentPost">
            Comment
          </button>
        </form>
      )}

      {commentOpen > 0 && (
        <div className="comment">
          {comments
            .sort((a, b) => b.data.timestamp - a.data.timestamp)
            .map((c) => (
              <div>
                <div className="commentWrapper">
                  <img
                    className="commentProfileImg"
                    src={c.data.photoURL}
                    alt=""
                  />
                  <div className="commentInfo">
                    <span className="commentUsername">
                      @{c.data.displayName.replace(/\s+/g, "").toLowerCase()}
                    </span>
                    <p className="commentText">{c.data.comment}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default Post;
