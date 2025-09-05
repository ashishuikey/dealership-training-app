import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductList.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const categories = ['all', ...new Set(products.map(p => p.category))];

  if (loading) {
    return <div className="loading">Loading collection...</div>;
  }

  return (
    <div className="product-list">
      <div className="collection-header">
        <h1 className="page-title">Luxury Hybrid Collection</h1>
        <p className="page-subtitle">Explore our curated selection of premium hybrid vehicles</p>
      </div>
      
      <div className="filter-section">
        <span className="filter-label">Filter by Category:</span>
        <div className="filter-buttons">
          {categories.map(cat => (
            <button
              key={cat}
              className={selectedCategory === cat ? 'filter-btn active' : 'filter-btn'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat === 'all' ? 'All Vehicles' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="collection-stats">
        <p>Showing {filteredProducts.length} of {products.length} vehicles</p>
      </div>

      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-badge-corner">
              {product.inStock > 0 ? (
                <span className="badge-stock">{product.inStock} Available</span>
              ) : (
                <span className="badge-out">Out of Stock</span>
              )}
            </div>
            
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }} />
              ) : null}
              <div className="placeholder-image" style={product.image ? {display: 'none'} : {}}>
                <span className="placeholder-text">{product.name}</span>
              </div>
            </div>
            
            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <h3 className="product-name">{product.name}</h3>
              <p className="product-year">{product.year} Model</p>
              
              <div className="price-section">
                <p className="product-price">{formatPrice(product.price)}</p>
                <p className="product-msrp">MSRP: {formatPrice(product.msrp)}</p>
              </div>
              
              <div className="product-specs-mini">
                <span className="spec-mini">
                  ⚡ {product.specs.performance?.horsepower}
                </span>
                <span className="spec-mini">
                  ⛽ {product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} 
                  {product.specs.efficiency?.combinedMPGe ? ' MPGe' : ' MPG'}
                </span>
              </div>
              
              <p className="product-description">{product.description}</p>
              
              <div className="product-actions">
                <Link to={`/products/${product.id}`} className="btn-view-details">
                  View Details
                </Link>
                <Link to={`/quiz?product=${product.id}`} className="btn-take-quiz">
                  Take Quiz
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductList;