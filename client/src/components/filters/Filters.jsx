import { useState, useEffect } from "react";
import "./filters.css";
import * as services from "../../services/services";

export default function Filters({ selectedCategory, onCategoryChange }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const res = await services.getVideoCategoriesAsync();
            if (res.status === 200) {
                setCategories(res.data);
            }
        } catch (error) {
            console.log(error);
            // Fallback categories
            setCategories([
                "All",
                "General",
                "Education",
                "Entertainment",
                "Gaming",
                "Music",
                "News",
                "Sports",
                "Technology",
                "Travel",
                "Cooking"
            ]);
        }
    };

    return (
        <div className="filters">
            <div className="filters-wrapper">
                {categories.map((category, index) => (
                    <button
                        key={index}
                        className={`filter-btn ${selectedCategory === category ? "active" : ""}`}
                        onClick={() => onCategoryChange(category)}
                    >
                        {category}
                    </button>
                ))}
            </div>
        </div>
    );
}
