import axios from "axios";
import DefaultBanner from "../assets/banner.png";
import DefaultProfile from "../assets/default.png";
import DefaultCover from "../assets/listcover.png";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const request = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000
});

request.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

request.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      error.message = 'Request timeout. Please check your internet connection.';
    } else if (!error.response) {
      error.message = 'Network error. Please check if the server is running.';
    } else if (error.response.status === 401) {
      error.message = 'Authentication failed. Please log in again.';
      localStorage.removeItem('auth');
      window.location.href = '/login';
    } else if (error.response.status === 403) {
      error.message = 'Access forbidden. You do not have permission.';
    } else if (error.response.status === 404) {
      error.message = 'Resource not found.';
    } else if (error.response.status >= 500) {
      error.message = 'Server error. Please try again later.';
    } else if (error.response.data?.message) {
      error.message = error.response.data.message;
    }

    return Promise.reject(error);
  }
);

// auth services
export const loginAsync = (creds) => request.post("/auth/login", creds);
export const registerAsync = (creds) => request.post("/auth/register", creds);

// channel services
export const getChannelAsync = (channelId) =>
  request.get(`/channels/${channelId}`);

export const updateChannelAsync = (channelId, data) =>
  request.put(`/channels/${channelId}`, data);

export const subscribeChannelAsync = (channelId) =>
  request.put(`/channels/subscribe/${channelId}`, { channelId });

export const unsubscribeChannelAsync = (channelId) =>
  request.put(`/channels/unsubscribe/${channelId}`, { channelId });

// videos services

export const getVideosAsync = (search = "") => request.get(`/videos${search}`);

export const getVideosByChannelIdAsync = (channelId) =>
  request.get(`/videos/channel/${channelId}`);

export const getVideoAsync = (videoId) => request.get(`/videos/${videoId}`);

export const createVideoAsync = (data) => request.post(`/videos`, data);

export const updateVideoAsync = (videoId, data) =>
  request.put(`/videos/${videoId}`, data);

export const deleteVideoAsync = (videoId) =>
  request.delete(`/videos/${videoId}`);

export const likeVideoAsync = (videoId) =>
  request.put(`/videos/like/${videoId}`, { videoId });

export const dislikeVideoAsync = (videoId) =>
  request.put(`/videos/dislike/${videoId}`, { videoId });

// upload services
export const uploadCoverAsync = (cover) =>
  request.post("/uploads/covers", cover);

export const uploadProfileAsync = (profile) =>
  request.post("/uploads/profiles", profile);

export const uploadVideoAsync = (video) =>
  request.post("/uploads/videos", video);

export const uploadBannerAsync = (banner) =>
  request.post("/uploads/banners", banner);

// comment services
export const getCommentsAsync = (videoId) =>
  request.get(`/comments/${videoId}`);

export const createCommentAsync = (videoId, data) =>
  request.post(`/comments/${videoId}`, data);

export const updateCommentAsync = (commentId, data) =>
  request.put(`/comments/${commentId}`, data);

export const deleteCommentAsync = (commentId) =>
  request.delete(`/comments/${commentId}`);

export const likeCommentAsync = (commentId) =>
  request.put(`/comments/like/${commentId}`);

export const dislikeCommentAsync = (commentId) =>
  request.put(`/comments/dislike/${commentId}`);

export const getVideoCategoriesAsync = () => request.get(`/videos/categories`);

// helps
export const getProfileUrl = (profile) => {
  if (!profile) return DefaultProfile;
  return `${baseURL}/medias/profiles/${profile}`;
};

export const getBannerUrl = (banner) => {
  if (!banner) return DefaultBanner;
  return `${baseURL}/medias/banners/${banner}`;
};

export const getCoverUrl = (cover) => {
  if (!cover) return DefaultCover;
  return `${baseURL}/medias/covers/${cover}`;
};

export const getVideoUrl = (video) => {
  return `${baseURL}/medias/videos/${video}`;
};
