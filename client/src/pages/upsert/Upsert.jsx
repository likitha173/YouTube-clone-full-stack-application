import { useState, useEffect, useContext } from "react";
import DragDropFiles from "./DragDropFiles";
import "./upsert.css";
import { FaArrowLeft, FaImage } from "react-icons/fa";
import * as services from "../../services/services";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

export default function Upsert({ selectedVideo, setSelectedVideo, onClose }) {
  const { state } = useContext(AppContext);
  const [video, setVideo] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState(selectedVideo ? selectedVideo.title : "");
  const [desc, setDesc] = useState(selectedVideo ? selectedVideo.desc : "");
  const [category, setCategory] = useState(selectedVideo ? selectedVideo.category : "General");
  const [tags, setTags] = useState(selectedVideo ? selectedVideo.tags?.join(", ") : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // Debug: Log component mount
  useEffect(() => {
    console.log("Upsert component mounted");
    console.log("Selected video:", selectedVideo);
    console.log("Props:", { selectedVideo, setSelectedVideo, onClose });
    console.log("Auth state:", state?.auth);
    console.log("Channel state:", state?.channel);
  }, []);

  // Check authentication
  useEffect(() => {
    if (!state?.auth) {
      setError("You must be logged in to upload videos.");
      return;
    }
  }, [state?.auth]);

  // Add error boundary
  useEffect(() => {
    const handleError = (event) => {
      console.error("Global error caught:", event.error);
      setError("An unexpected error occurred. Please try again.");
    };

    const handleUnhandledRejection = (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      setError("Network error occurred. Please check your connection and try again.");
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const clearInputs = () => {
    setVideo(null);
    setCover(null);
    setTitle("");
    setDesc("");
    setCategory("General");
    setTags("");
    setError(null);
  };

  const handleCover = (e) => {
    e.preventDefault();
    setCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate inputs
      if (!title.trim()) {
        setError("Title is required");
        setLoading(false);
        return;
      }

      if (!selectedVideo && !video) {
        setError("Please select a video file");
        setLoading(false);
        return;
      }

      console.log("Starting upload process...");
      const videoName = await uploadVideo();
      const coverName = await uploadCover();

      if (selectedVideo) {
        // update video
        const data = {
          ...selectedVideo,
          videoUrl: videoName ? videoName : selectedVideo.videoUrl,
          cover: coverName ? coverName : selectedVideo.cover,
          title,
          desc,
          category,
          tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag)
        };

        const res = await services.updateVideoAsync(selectedVideo._id, data);
        if (res.status == 200) {
          clearInputs();
          setSelectedVideo(res.data);
          setLoading(false);
          onClose(false);
        }
      } else {
        // create new video
        const data = {
          videoUrl: videoName,
          cover: coverName,
          title,
          desc,
          category,
          tags: tags.split(",").map(tag => tag.trim()).filter(tag => tag)
        };

        console.log("Creating video with data:", data);
        const res = await services.createVideoAsync(data);
        console.log("Create video response:", res);
        if (res.status == 200) {
          clearInputs();
          setLoading(false);
          console.log("Navigating to video:", res.data._id);
          navigate(`/videos/${res.data._id}`);
        } else {
          setError("Failed to create video. Please try again.");
          setLoading(false);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      setError(error.response?.data || error.message || "An error occurred during upload");
      setLoading(false);
    }
  };

  const uploadVideo = async () => {
    if (!video) return null;
    try {
      console.log("Uploading video:", video.name, "Size:", video.size);

      // Check file size (limit to 100MB for example)
      if (video.size > 100 * 1024 * 1024) {
        throw new Error("Video file is too large. Please select a file smaller than 100MB.");
      }

      const formData = new FormData();
      const filename = new Date().getTime() + "-" + video.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      formData.append("filename", filename);
      formData.append("file", video);

      console.log("FormData created, making request...");
      const res = await services.uploadVideoAsync(formData);
      console.log("Video upload response:", res);

      if (res.status === 200) {
        return filename;
      } else {
        throw new Error("Video upload failed");
      }
    } catch (error) {
      console.error("Video upload error:", error);
      throw new Error(`Video upload failed: ${error.message}`);
    }
  };

  const uploadCover = async () => {
    if (!cover) return null;
    try {
      console.log("Uploading cover:", cover.name, "Size:", cover.size);

      // Check file size (limit to 5MB for covers)
      if (cover.size > 5 * 1024 * 1024) {
        throw new Error("Cover image is too large. Please select a file smaller than 5MB.");
      }

      const formData = new FormData();
      const filename = new Date().getTime() + "-" + cover.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      formData.append("filename", filename);
      formData.append("file", cover);

      const res = await services.uploadCoverAsync(formData);
      console.log("Cover upload response:", res);

      if (res.status === 200) {
        return filename;
      } else {
        throw new Error("Cover upload failed");
      }
    } catch (error) {
      console.error("Cover upload error:", error);
      throw new Error(`Cover upload failed: ${error.message}`);
    }
  };

  return (
    <div className={`upsert ${state?.theme === 'dark' ? 'dark' : ''} ${state?.onMenu ? 'sidebar-active' : ''}`}>
      <div className="upload-container">
        {/* Header */}
        <div className="upload-header">
          {selectedVideo && (
            <button
              className="btn btn-secondary"
              onClick={() => onClose(false)}
              style={{ marginRight: '16px' }}
            >
              <FaArrowLeft />
            </button>
          )}
          <h1>{selectedVideo ? "Edit video" : "Upload videos"}</h1>
        </div>

        {/* Upload Progress Steps */}
        <div className="upload-stepper">
          <div className="stepper-item active">
            <div className="stepper-number">1</div>
            <span>Upload</span>
          </div>
          <div className="stepper-divider"></div>
          <div className="stepper-item">
            <div className="stepper-number">2</div>
            <span>Details</span>
          </div>
          <div className="stepper-divider"></div>
          <div className="stepper-item">
            <div className="stepper-number">3</div>
            <span>Visibility</span>
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="upload-content">
          {/* Main Upload Area */}
          <div className="upload-main">
            {/* Upload Section - Always show */}
            <div className="upload-section">
              <div className="section-title">
                {video || selectedVideo ? "Selected video" : "Select files to upload"}
              </div>
              <DragDropFiles
                file={video}
                setFile={setVideo}
                selectedVideo={selectedVideo}
              />
              {(video || selectedVideo) && (
                <button
                  type="button"
                  onClick={() => {
                    setVideo(null);
                    // Reset file input
                    const fileInput = document.getElementById('upload-video');
                    if (fileInput) fileInput.value = '';
                  }}
                  style={{
                    marginTop: '12px',
                    padding: '8px 16px',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px',
                    background: 'var(--bg-color)',
                    color: 'var(--text-color)',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Change video
                </button>
              )}
            </div>

            {/* Details Form */}
            <form onSubmit={handleSubmit} className="upload-form">
              {/* Title */}
              <div className="form-group">
                <label className="form-label">Title (required)</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Add a title that describes your video"
                  className="form-input"
                  required
                />
                <div className={`character-count ${title.length > 100 ? 'over-limit' : ''}`}>
                  {title.length}/100
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Tell viewers about your video"
                  className="form-textarea"
                  rows="4"
                />
                <div className={`character-count ${desc.length > 5000 ? 'over-limit' : ''}`}>
                  {desc.length}/5000
                </div>
              </div>

              {/* Category */}
              <div className="form-group">
                <label className="form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="form-select"
                >
                  <option value="General">General</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Music">Music</option>
                  <option value="News">News</option>
                  <option value="Sports">Sports</option>
                  <option value="Technology">Technology</option>
                  <option value="Travel">Travel</option>
                  <option value="Cooking">Cooking</option>
                </select>
              </div>

              {/* Tags */}
              <div className="form-group">
                <label className="form-label">Tags</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="Add tags separated by commas"
                  className="form-input"
                />
              </div>

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => onClose ? onClose(false) : navigate('/')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading
                    ? "Publishing..."
                    : selectedVideo
                      ? "Save"
                      : "Publish"
                  }
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="upload-sidebar">
            {/* Thumbnail Section */}
            <div className="thumbnail-section">
              <div className="section-title">Thumbnail</div>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Select or upload a picture that shows what's in your video.
              </p>
              <label htmlFor="upload-cover" className="upload-thumbnail">
                <input
                  type="file"
                  id="upload-cover"
                  accept="image/png, image/jpg, image/jpeg"
                  className="file-input"
                  onChange={handleCover}
                />
                <FaImage />
                <span>
                  {cover ? cover.name : selectedVideo?.cover ? "Current thumbnail" : "Upload thumbnail"}
                </span>
              </label>
            </div>

            {/* Visibility Section */}
            <div className="visibility-section">
              <div className="section-title">Visibility</div>
              <div className="visibility-options">
                <div className="visibility-option selected">
                  <input type="radio" className="visibility-radio" id="public" name="visibility" defaultChecked />
                  <div className="visibility-content">
                    <div className="visibility-title">Public</div>
                    <div className="visibility-description">Anyone can search for and view</div>
                  </div>
                </div>
                <div className="visibility-option">
                  <input type="radio" className="visibility-radio" id="unlisted" name="visibility" />
                  <div className="visibility-content">
                    <div className="visibility-title">Unlisted</div>
                    <div className="visibility-description">Anyone with the link can view</div>
                  </div>
                </div>
                <div className="visibility-option">
                  <input type="radio" className="visibility-radio" id="private" name="visibility" />
                  <div className="visibility-content">
                    <div className="visibility-title">Private</div>
                    <div className="visibility-description">Only you can view</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
