import "./manageablevideocard.css";
import Avatar from "../../components/custom/Avatar";
import ImageWithFallback from "../../components/custom/ImageWithFallback";
import { format } from "timeago.js";
import * as services from "../../services/services";
import { FaEdit, FaTrashAlt, FaEye, FaPlay, FaClock, FaLock, FaGlobe } from "react-icons/fa";
import { useState } from "react";
import Upsert from "../upsert/Upsert";
import DefaultCover from "../../assets/listcover.png";

export default function ManageableVideoCard({ video, onUpdate, onDelete }) {
    const [showEdit, setShowEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const profileUrl = services.getProfileUrl(video?.profile);
    const coverUrl = services.getCoverUrl(video?.cover);

    const handleDelete = async () => {
        try {
            setLoading(true);
            const res = await services.deleteVideoAsync(video._id);
            if (res.status === 200) {
                onDelete(video._id);
                setShowDeleteModal(false);
            }
        } catch (error) {
            console.log(error);
            alert("Failed to delete video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = (updatedVideo) => {
        onUpdate(updatedVideo);
        setShowEdit(false);
    };

    const getStatusIcon = () => {
        switch (video?.visibility) {
            case 'public':
                return <FaGlobe />;
            case 'private':
                return <FaLock />;
            case 'unlisted':
                return <FaClock />;
            default:
                return <FaGlobe />;
        }
    };

    const getStatusColor = () => {
        switch (video?.visibility) {
            case 'public':
                return 'published';
            case 'private':
                return 'private';
            case 'unlisted':
                return 'draft';
            default:
                return 'published';
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

    if (showEdit) {
        return (
            <Upsert
                selectedVideo={video}
                setSelectedVideo={handleUpdate}
                onClose={setShowEdit}
            />
        );
    }

    return (
        <>
            <div className="manageable-video-card">
                <div className="video-card">
                    <a href={`/videos/${video?._id}`} className="card-cover">
                        <ImageWithFallback
                            src={coverUrl}
                            fallback={DefaultCover}
                            alt="video thumbnail"
                        />
                        <div className={`status-indicator ${getStatusColor()}`}>
                            {getStatusIcon()}
                            <span style={{ marginLeft: '4px' }}>{video?.visibility || 'public'}</span>
                        </div>
                        {video?.category && (
                            <span className="category-badge">{video.category}</span>
                        )}
                    </a>
                    <div className="card-details">
                        <a href={`/videos/${video?._id}`} className="card-title" title={video?.title}>
                            {video?.title}
                        </a>

                        <div className="card-meta">
                            <div className="card-infos">
                                <div className="card-profile">
                                    <Avatar src={profileUrl} size={28} />
                                </div>
                                <span className="card-channel">{video?.name}</span>
                                <div className="video-stats">
                                    <span className="card-views">{formatViews(video?.views)} views</span>
                                    <span className="timeline">{format(video?.createdAt)}</span>
                                </div>
                            </div>

                            {video?.desc && (
                                <div className="video-description">
                                    <p>{video.desc.length > 120 ? `${video.desc.substring(0, 120)}...` : video.desc}</p>
                                </div>
                            )}

                            {video?.tags && video.tags.length > 0 && (
                                <div className="card-tags">
                                    {video.tags.slice(0, 3).map((tag, index) => (
                                        <span key={index} className="tag">#{tag}</span>
                                    ))}
                                    {video.tags.length > 3 && (
                                        <span className="tag tag-more">+{video.tags.length - 3} more</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="management-actions">
                    <button
                        className="action-btn view-btn"
                        onClick={() => window.open(`/videos/${video._id}`, '_blank')}
                        title="View video"
                    >
                        <FaPlay />
                        <span>Watch</span>
                    </button>
                    <button
                        className="action-btn edit-btn"
                        onClick={() => setShowEdit(true)}
                        title="Edit video details"
                    >
                        <FaEdit />
                        <span>Edit</span>
                    </button>
                    <button
                        className={`action-btn delete-btn ${loading ? 'loading' : ''}`}
                        onClick={() => setShowDeleteModal(true)}
                        disabled={loading}
                        title="Delete video permanently"
                    >
                        <FaTrashAlt />
                        <span>{loading ? "Deleting..." : "Delete"}</span>
                    </button>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => !loading && setShowDeleteModal(false)}>
                    <div className="delete-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Delete Video</h3>
                        </div>
                        <div className="modal-content">
                            <p>Are you sure you want to delete <strong>"{video?.title}"</strong>?</p>
                            <p className="warning-text">This action cannot be undone.</p>
                        </div>
                        <div className="modal-actions">
                            <button
                                className="cancel-btn"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                className={`confirm-delete-btn ${loading ? 'loading' : ''}`}
                                onClick={handleDelete}
                                disabled={loading}
                            >
                                {loading ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
