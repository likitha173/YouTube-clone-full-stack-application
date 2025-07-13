import VideoList from "../../components/videos/VideoList";
import "./home.css";
import { useState, useEffect } from "react";

const categories = [
  "All",
  "Music",
  "Gaming",
  "News",
  "Sports",
  "Learning",
  "Fashion",
  "Technology",
  "Entertainment",
  "Cooking",
  "Travel",
  "Science",
  "Comedy",
  "Fitness",
  "Podcast",
  "Film",
  "Animation",
  "Recently uploaded"
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [scrolled, setScrolled] = useState(false);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="home">
      <div className={`category-tabs ${scrolled ? 'scrolled' : ''}`}>
        <div className="category-chips-container">
          <div className="category-chips">
            {categories.map((category) => (
              <button
                key={category}
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="category-gradient-fade"></div>
        </div>
      </div>
      <main className="home-content">
        <VideoList selectedCategory={selectedCategory} />
      </main>
    </div>
  );
}
