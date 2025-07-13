import { useEffect, useState, useCallback, useMemo } from "react";
import VideoCard from "./VideoCard";
import "./videolist.css";
import * as services from "../../services/services";

export default function VideoList({ selectedCategory = "All" }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  const loadVideosAsync = useCallback(async (isLoadMore = false) => {
    try {
      setLoading(true);
      setError(null);

      const query = selectedCategory && selectedCategory !== "All"
        ? `?category=${selectedCategory}&page=${isLoadMore ? page : 1}&limit=12`
        : `?page=${isLoadMore ? page : 1}&limit=12`;

      const res = await services.getVideosAsync(query);

      if (res?.data) {
        if (isLoadMore) {
          setVideos(prev => [...prev, ...res.data]);
        } else {
          setVideos(res.data);
        }

        // Check if there are more videos to load
        setHasMore(res.data.length === 12);
      }
    } catch (error) {
      console.error("Failed to load videos:", error);
      setError(error.message || "Failed to load videos. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, page]);

  useEffect(() => {
    setPage(1);
    setVideos([]);
    loadVideosAsync(false);
  }, [selectedCategory]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLoadMore = useCallback(() => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
      loadVideosAsync(true);
    }
  }, [loading, hasMore, loadVideosAsync]);

  const handleRetry = useCallback(() => {
    setError(null);
    loadVideosAsync(false);
  }, [loadVideosAsync]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  const memoizedVideos = useMemo(() => videos, [videos]);

  if (error) {
    return (
      <div className="video-list-container">
        <div className="error-state">
          <div className="error-icon">⚠️</div>
          <h3>Oops! Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={handleRetry}>
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  if (loading && videos.length === 0) {
    return (
      <div className="video-list-container">
        <div className="loading-grid">
          {Array.from({ length: 12 }, (_, index) => (
            <div key={index} className="video-skeleton">
              <div className="skeleton-thumbnail"></div>
              <div className="skeleton-details">
                <div className="skeleton-avatar"></div>
                <div className="skeleton-text">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-channel"></div>
                  <div className="skeleton-views"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!loading && videos.length === 0) {
    return (
      <div className="video-list-container">
        <div className="empty-state">
          <div className="empty-icon">📺</div>
          <h3>No videos found</h3>
          <p>
            {selectedCategory === "All"
              ? "There are no videos available right now. Check back later!"
              : `No videos found in the "${selectedCategory}" category. Try a different category.`
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="video-list-container">
      <div className="video-grid">
        {memoizedVideos.map((video, index) => (
          <VideoCard key={`${video._id}-${index}`} video={video} />
        ))}
      </div>

      {hasMore && !loading && (
        <div className="load-more-container">
          <button
            className="load-more-button"
            onClick={handleLoadMore}
            disabled={loading}
          >
            📄 Load More Videos
          </button>
        </div>
      )}

      {loading && videos.length > 0 && (
        <div className="load-more-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      <button
        className={`scroll-to-top ${showScrollToTop ? 'visible' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        ↑
      </button>
    </div>
  );
}
