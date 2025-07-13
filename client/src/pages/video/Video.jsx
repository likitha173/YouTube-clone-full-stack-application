import { useContext, useEffect, useState } from "react";
import Comments from "../../components/comments/Comments";
import Avatar from "../../components/custom/Avatar";
import VideoPlayer from "../../components/custom/VideoPlayer";
import "./video.css";
import { FaEdit, FaTrashAlt, FaThumbsUp, FaThumbsDown, FaShare, FaDownload, FaFlag } from "react-icons/fa";
import { HiDotsHorizontal } from "react-icons/hi";
import { MdPlaylistAdd, MdMoreHoriz } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import * as services from "../../services/services";
import { format } from "timeago.js";
import { AppContext } from "../../context/AppContext";
import OtherVideos from "./OtherVideos";
import Upsert from "../upsert/Upsert";

export default function Video() {
  const { state } = useContext(AppContext);
  const [more, setMore] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [subStatus, setSubStatus] = useState(false);
  const [videoDetails, setVideoDetails] = useState(null);

  const authUser = state?.channel;

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    loadCurrentVideo();
  }, [id, authUser]);

  const loadCurrentVideo = async () => {
    if (!id) return;
    try {
      const res = await services.getVideoAsync(id);
      if (res.status == 200) {
        setVideoDetails(res.data);
        if (authUser && res.data.subscribers.includes(authUser._id)) {
          setSubStatus(true);
        } else {
          setSubStatus(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleLikes = async () => {
    if (!videoDetails || !authUser) return;

    try {
      let res = null;
      if (videoDetails.likes.includes(authUser._id)) {
        res = await services.dislikeVideoAsync(videoDetails._id);
      } else {
        res = await services.likeVideoAsync(videoDetails._id);
      }

      if (res?.status == 200) {
        // reload current video
        loadCurrentVideo();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    if (!videoDetails) return;

    try {
      if (window.confirm("Are you sure you want to delete this?")) {
        const res = await services.deleteVideoAsync(videoDetails._id);
        if (res.status == 200) {
          navigate("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubscribe = async () => {
    if (!videoDetails || !authUser) return;

    try {
      if (!authUser.subscriptions.includes(videoDetails.channelId)) {
        // subscribe to channel
        const res = await services.subscribeChannelAsync(
          videoDetails.channelId
        );
        if (res.status == 200) {
          setSubStatus(true);
        }
      } else {
        // unsubscribe to channel
        const res = await services.unsubscribeChannelAsync(
          videoDetails.channelId
        );
        if (res.status == 200) {
          setSubStatus(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views?.toString() || '0';
  };

  if (onEdit && videoDetails)
    return (
      <Upsert
        selectedVideo={videoDetails}
        setSelectedVideo={setVideoDetails}
        onClose={setOnEdit}
      />
    );

  return (
    <div className={`watch-page ${state?.onMenu ? 'sidebar-active' : ''}`}>
      <div className="watch-container">
        <div className="primary-inner">
          <div className="video-container">
            {videoDetails && <VideoPlayer video={videoDetails} />}
          </div>

          <div className="video-primary-info">
            <h1 className="video-title">{videoDetails?.title}</h1>

            <div className="video-info-container">
              <div className="video-info">
                <span className="view-count">{formatViews(videoDetails?.views)} views</span>
                <span className="upload-date">{format(videoDetails?.createdAt)}</span>
              </div>

              <div className="video-actions">
                <div className="action-buttons">
                  <button className="action-button like-button">
                    <FaThumbsUp />
                    <span>{videoDetails?.likes?.length || 0}</span>
                  </button>
                  <button className="action-button dislike-button">
                    <FaThumbsDown />
                  </button>
                  <button className="action-button share-button">
                    <FaShare />
                    <span>Share</span>
                  </button>
                  <button className="action-button download-button">
                    <FaDownload />
                    <span>Download</span>
                  </button>
                  <button className="action-button save-button">
                    <MdPlaylistAdd />
                    <span>Save</span>
                  </button>
                  <button className="action-button more-button">
                    <MdMoreHoriz />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="video-secondary-info">
            <div className="owner-info">
              <div className="owner-details">
                <a href={`/channel/${videoDetails?.channelId}`} className="channel-link">
                  <Avatar
                    size={40}
                    src={services.getProfileUrl(videoDetails?.profile)}
                  />
                </a>
                <div className="channel-info">
                  <a href={`/channel/${videoDetails?.channelId}`} className="channel-name">
                    {videoDetails?.name}
                  </a>
                  <div className="subscriber-count">2.5K subscribers</div>
                </div>
              </div>

              <div className="subscribe-button-container">
                {videoDetails?.channelId === authUser?._id ? (
                  <button className="manage-button">
                    <FaEdit style={{ marginRight: '8px' }} />
                    Manage
                  </button>
                ) : (
                  <button
                    className={`subscribe-button ${subStatus ? 'subscribed' : ''}`}
                    onClick={handleSubscribe}
                  >
                    {subStatus ? 'Subscribed' : 'Subscribe'}
                  </button>
                )}
              </div>
            </div>

            <div className={`video-description ${more ? 'expanded' : ''}`}>
              <div className="description-content">
                <p>{videoDetails?.desc}</p>
              </div>
              <button
                className="show-more-button"
                onClick={() => setMore((prev) => !prev)}
              >
                {more ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>

          <div className="comments-section">
            <Comments videoId={id} />
          </div>
        </div>

        <div className="secondary-inner">
          <OtherVideos />
        </div>
      </div>
    </div>
  );
}
