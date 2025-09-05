import React, { useState, useEffect } from 'react';
import './Categories.css';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading categories
    setTimeout(() => {
      setCategories([
        { id: 1, name: 'Sedans', icon: '🚗', count: 12, description: 'Luxury and comfort combined' },
        { id: 2, name: 'SUVs', icon: '🚙', count: 8, description: 'Power and versatility' },
        { id: 3, name: 'Electric', icon: '⚡', count: 6, description: 'Future of mobility' },
        { id: 4, name: 'Hybrids', icon: '🔋', count: 10, description: 'Best of both worlds' },
        { id: 5, name: 'Sports', icon: '🏎️', count: 5, description: 'Performance and style' },
        { id: 6, name: 'Trucks', icon: '🚚', count: 7, description: 'Built for work' }
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  if (loading) {
    return (
      <div className="categories-container">
        <div className="loading">Loading categories...</div>
      </div>
    );
  }

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h1>Vehicle Categories</h1>
        <p>Browse our diverse range of vehicle categories</p>
      </div>

      <div className="categories-grid">
        {categories.map((category) => (
          <div
            key={category.id}
            className={`category-card ${selectedCategory?.id === category.id ? 'selected' : ''}`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="category-icon">{category.icon}</div>
            <h3 className="category-name">{category.name}</h3>
            <p className="category-description">{category.description}</p>
            <div className="category-count">{category.count} Models</div>
          </div>
        ))}
      </div>

      {selectedCategory && (
        <div className="category-details">
          <h2>Selected: {selectedCategory.name}</h2>
          <p>{selectedCategory.description}</p>
          <button className="view-models-btn">
            View All {selectedCategory.name} Models →
          </button>
        </div>
      )}
    </div>
  );
}

export default Categories;