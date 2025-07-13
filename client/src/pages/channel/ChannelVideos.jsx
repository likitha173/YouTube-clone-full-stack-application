import React, { useEffect, useState, useContext } from "react";
import VideoCard from "../../components/videos/VideoCard";
import { getVideosByChannelIdAsync } from "../../services/services";
import { AppContext } from "../../context/AppContext";
import ManageableVideoCard from "./ManageableVideoCard";

export default function ChannelVideos({ channelId }) {
  const { state } = useContext(AppContext);
  const [videos, setVideos] = useState([]);
  const authUser = state?.channel;
  const isOwnChannel = authUser?._id === channelId;

  useEffect(() => {
    loadVideoByChannelId();
  }, [channelId]);

  const loadVideoByChannelId = async () => {
    if (!channelId) return;
    try {
      const res = await getVideosByChannelIdAsync(channelId);
      if (res.status == 200) {
        setVideos(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleVideoUpdate = (updatedVideo, deletedVideoId) => {
    if (deletedVideoId) {
      // Handle deletion
      setVideos(videos.filter(video => video._id !== deletedVideoId));
    } else if (updatedVideo) {
      // Handle update
      setVideos(videos.map(video =>
        video._id === updatedVideo._id ? updatedVideo : video
      ));
    }
  };

  return (
    <div className="list-items">
      {videos.length === 0 && (
        <p style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          No videos uploaded yet.
        </p>
      )}
      {videos.map((item, index) => (
        <VideoCard
          key={index}
          video={item}
          showEditOption={isOwnChannel}
          onVideoUpdate={handleVideoUpdate}
        />
      ))}
    </div>
  );
}
