import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { getVideosAsync } from "../../services/services";
import VideoCard from "../../components/videos/VideoCard";
import Filters from "../../components/filters/Filters";
import "../../components/videos/videolist.css";

export default function Search() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search');

  useEffect(() => {
    searchVideos();
  }, [location.search, selectedCategory]);

  const searchVideos = async () => {
    try {
      setLoading(true);
      let query = "";
      if (searchQuery) {
        query += `?search=${searchQuery}`;
      }
      if (selectedCategory && selectedCategory !== "All") {
        query += searchQuery ? `&category=${selectedCategory}` : `?category=${selectedCategory}`;
      }

      const res = await getVideosAsync(query);
      if (res.status == 200) {
        setVideos(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  return (
    <div className="home">
      <div className="search-results-container">
        <div className="search-results-header">
          <h2>Search Results{searchQuery && ` for "${searchQuery}"`}</h2>
        </div>
        <Filters
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
        />

        {loading && (
          <div className="loading">
            <p>Searching videos...</p>
          </div>
        )}

        {!loading && videos.length === 0 && (
          <div className="no-videos">
            <p>No videos found. Try adjusting your search or filters.</p>
          </div>
        )}

        <div className="video-list-container">
          <div className="video-grid">
            {!loading && videos.map((item, index) => (
              <VideoCard key={index} video={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
