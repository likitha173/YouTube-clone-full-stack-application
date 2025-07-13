import "./comments.css";
import Avatar from "../custom/Avatar";
import Comment from "./Comment";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import * as services from "../../services/services";

export default function Comments({ videoId }) {
  const { state } = useContext(AppContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (videoId) {
      loadComments();
    }
  }, [videoId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const res = await services.getCommentsAsync(videoId);
      if (res.status === 200) {
        setComments(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !state?.auth) return;

    try {
      setSubmitting(true);
      const res = await services.createCommentAsync(videoId, { desc: newComment });
      if (res.status === 200) {
        setComments([res.data, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId, newDesc) => {
    try {
      const res = await services.updateCommentAsync(commentId, { desc: newDesc });
      if (res.status === 200) {
        setComments(comments.map(comment =>
          comment._id === commentId ? res.data : comment
        ));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await services.deleteCommentAsync(commentId);
      setComments(comments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleClear = () => {
    setNewComment("");
  };

  return (
    <div className={`comments ${state?.theme}`}>
      <div className="comments-wrapper">
        <h4>{comments.length} Comments</h4>

        {state?.auth && (
          <form onSubmit={handleSubmit} className="comment-form">
            <div className="inputs-wrapper">
              <Avatar
                src={services.getProfileUrl(state.channel?.profile)}
                size={35}
              />
              <textarea
                required
                placeholder="Enter your comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                disabled={submitting}
              />
            </div>
            <div className="inputs-actions">
              <button type="button" onClick={handleClear} disabled={submitting}>
                Clear
              </button>
              <button type="submit" disabled={submitting || !newComment.trim()}>
                {submitting ? "Posting..." : "Comment"}
              </button>
            </div>
          </form>
        )}

        {!state?.auth && (
          <div className="login-prompt">
            <p>Please <a href="/login">sign in</a> to leave a comment.</p>
          </div>
        )}

        <div className="comment-list">
          {loading && <p>Loading comments...</p>}
          {!loading && comments.length === 0 && (
            <p>No comments yet. Be the first to comment!</p>
          )}
          {!loading && comments.map((comment) => (
            <Comment
              key={comment._id}
              comment={comment}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
              currentUserId={state?.channel?._id}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
