import React, { useState } from "react";
import Avatar from "../custom/Avatar";
import { FaEdit, FaTrashAlt, FaCheck, FaTimes } from "react-icons/fa";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { FaShare } from "react-icons/fa6";
import { HiDotsHorizontal } from "react-icons/hi";
import { format } from "timeago.js";
import * as services from "../../services/services";

export default function Comment({ comment, onUpdate, onDelete, currentUserId }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment?.desc || "");
  const [showActions, setShowActions] = useState(false);
  const [liked, setLiked] = useState(comment?.likes?.includes(currentUserId));

  const isOwner = currentUserId === comment?.channelId;

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(comment.desc);
    setShowActions(false);
  };

  const handleSaveEdit = () => {
    if (editText.trim() && editText !== comment.desc) {
      onUpdate(comment._id, editText.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditText(comment.desc);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      onDelete(comment._id);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        await services.dislikeCommentAsync(comment._id);
      } else {
        await services.likeCommentAsync(comment._id);
      }
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="comment-item">
      <div className="user-infos">
        <a href={`/channel/${comment?.channelId}`} className="channel-avatar">
          <Avatar
            src={services.getProfileUrl(comment?.profile)}
            size={26}
          />
        </a>

        <div className="info-wrapper">
          <a href={`/channel/${comment?.channelId}`} className="channel-name">
            {comment?.name || "Anonymous"}
          </a>
          <span className="timeline">{format(comment?.createdAt)}</span>
        </div>
      </div>

      <div className="comment-body">
        {isEditing ? (
          <div className="edit-comment">
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              className="edit-textarea"
            />
            <div className="edit-actions">
              <button onClick={handleSaveEdit} className="save-btn">
                <FaCheck />
              </button>
              <button onClick={handleCancelEdit} className="cancel-btn">
                <FaTimes />
              </button>
            </div>
          </div>
        ) : (
          <p>{comment?.desc}</p>
        )}
      </div>

      <div className="comments-actions">
        {currentUserId && (
          <div className="action-item like" onClick={handleLike}>
            {liked ? <FaHeart style={{ color: 'red' }} /> : <FaRegHeart />}
            <span>{comment?.likes?.length || 0}</span>
          </div>
        )}

        <div className="action-item">
          <FaShare />
        </div>

        {isOwner && (
          <div className="action-item owner-actions">
            <div
              className="dots"
              onClick={() => setShowActions(!showActions)}
            >
              <HiDotsHorizontal />
            </div>
            {showActions && (
              <div className="action-menu">
                <button onClick={handleEdit}>
                  <FaEdit /> Edit
                </button>
                <button onClick={handleDelete}>
                  <FaTrashAlt /> Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
