import "./videocard.css";
import Avatar from "../custom/Avatar";
import ImageWithFallback from "../custom/ImageWithFallback";
import EditVideoModal from "../modals/EditVideoModal";
import { format } from "timeago.js";
import { useState, useContext, useEffect, useRef } from "react";
import { AppContext } from "../../context/AppContext";
import * as services from "../../services/services";
import DefaultCover from "../../assets/listcover.png";

export default function VideoCard({ video, showEditOption = false, onVideoUpdate }) {
  const { state } = useContext(AppContext);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const profileUrl = services.getProfileUrl(video?.profile);
  const coverUrl = services.getCoverUrl(video?.cover);
  const authUser = state?.channel;
  const isOwner = authUser?._id === video?.channelId;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views?.toString() || '0';
  };

  const formatDuration = (duration) => {
    if (!duration) return '';

    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleEditVideo = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsEditModalOpen(true);
    setShowDropdown(false);
  };

  const handleSaveVideo = async (videoId, updateData) => {
    try {
      const response = await services.updateVideoAsync(videoId, updateData);
      if (response.status === 200 && onVideoUpdate) {
        onVideoUpdate(response.data);
      }
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteVideo = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (window.confirm('Are you sure you want to delete this video? This action cannot be undone.')) {
      try {
        await services.deleteVideoAsync(video._id);
        if (onVideoUpdate) {
          onVideoUpdate(null, video._id);
        }
      } catch (error) {
        alert('Failed to delete video. Please try again.');
      }
    }
    setShowDropdown(false);
  };

  const toggleDropdown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDropdown(prev => !prev);
  };

  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <a href={`/videos/${video?._id}`}>
          <ImageWithFallback
            src={coverUrl}
            fallback={DefaultCover}
            alt={video?.title}
          />
          {video?.duration && (
            <span className="duration-badge">{formatDuration(video.duration)}</span>
          )}
        </a>
      </div>

      <div className="video-details">
        <div className="channel-avatar">
          <a href={`/channel/${video?.channelId}`}>
            <Avatar src={profileUrl} size={36} />
          </a>
        </div>

        <div className="video-meta">
          <h3 className="video-title">
            <a href={`/videos/${video?._id}`} title={video?.title}>
              {video?.title}
            </a>
          </h3>

          <div className="video-info">
            <a href={`/channel/${video?.channelId}`} className="channel-name" title={video?.name}>
              {video?.name}
            </a>
            <div className="view-count-date">
              <span className="view-count">{formatViews(video?.views)} views</span>
              <span className="upload-date">{format(video?.createdAt)}</span>
            </div>
          </div>
        </div>

        <div className={`video-options ${(isOwner || showEditOption) ? 'owner-video' : ''}`}>
          {(isOwner || showEditOption) && (
            <div className="dropdown-container" ref={dropdownRef}>
              <button
                className="options-button"
                title="More options"
                onClick={toggleDropdown}
              >
                <svg height="24" width="24" viewBox="0 0 24 24">
                  <path d="M12 16.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5-1.5-.67-1.5-1.5.67-1.5 1.5-1.5zM10.5 12c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5zm0-6c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5-1.5.67-1.5 1.5z" />
                </svg>
              </button>

              {showDropdown && (
                <div className="dropdown-menu" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="dropdown-item"
                    onClick={handleEditVideo}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                    </svg>
                    Edit Video
                  </button>
                  <button
                    className="dropdown-item delete"
                    onClick={handleDeleteVideo}
                    type="button"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24">
                      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                    </svg>
                    Delete Video
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <EditVideoModal
        video={video}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveVideo}
      />
    </div>
  );
}
