import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './ProductCatalog.css';

function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [showComparison, setShowComparison] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [minMPG, setMinMPG] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('name-asc');
  const [viewMode, setViewMode] = useState('grid');
  
  // Available categories
  const [categories, setCategories] = useState([]);
  const [priceMinMax, setPriceMinMax] = useState({ min: 0, max: 100000 });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchTerm, selectedCategory, priceRange, minMPG, inStockOnly, sortBy]);

  const fetchInitialData = async () => {
    try {
      const [productsRes, categoriesRes, priceRangeRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/products/categories'),
        axios.get('/api/products/price-range')
      ]);
      
      setProducts(productsRes.data);
      setFilteredProducts(productsRes.data);
      setCategories(['all', ...categoriesRes.data]);
      setPriceMinMax(priceRangeRes.data);
      setPriceRange(priceRangeRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (priceRange.min > priceMinMax.min) params.append('minPrice', priceRange.min);
      if (priceRange.max < priceMinMax.max) params.append('maxPrice', priceRange.max);
      if (minMPG > 0) params.append('minMPG', minMPG);
      if (inStockOnly) params.append('inStock', 'true');
      params.append('sort', sortBy);
      
      const response = await axios.get(`/api/products?${params.toString()}`);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error applying filters:', error);
    }
  };

  const toggleCompare = (productId) => {
    if (compareList.includes(productId)) {
      setCompareList(compareList.filter(id => id !== productId));
    } else if (compareList.length < 3) {
      setCompareList([...compareList, productId]);
    } else {
      alert('You can compare up to 3 products at a time');
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setPriceRange(priceMinMax);
    setMinMPG(0);
    setInStockOnly(false);
    setSortBy('name-asc');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getMPG = (product) => {
    return product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe || 'N/A';
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h1>Virtual Showroom</h1>
        <p className="catalog-subtitle">Experience our premium hybrid vehicles with advanced filtering and comparison tools</p>
      </div>

      <div className="catalog-controls">
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search luxury hybrids by name, brand, or features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button className="search-button">🔍</button>
        </div>

        <div className="view-controls">
          <button
            className={viewMode === 'grid' ? 'view-btn active' : 'view-btn'}
            onClick={() => setViewMode('grid')}
          >
            Grid View
          </button>
          <button
            className={viewMode === 'list' ? 'view-btn active' : 'view-btn'}
            onClick={() => setViewMode('list')}
          >
            List View
          </button>
          {compareList.length > 0 && (
            <button
              className="compare-btn"
              onClick={() => setShowComparison(true)}
            >
              Compare ({compareList.length})
            </button>
          )}
        </div>
      </div>

      <div className="catalog-layout">
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            <button onClick={clearFilters} className="clear-filters">Clear All</button>
          </div>

          <div className="filter-group">
            <label>Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-inputs">
              <input
                type="number"
                placeholder="Min"
                min={priceMinMax.min}
                max={priceMinMax.max}
                value={priceRange.min}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || 0;
                  setPriceRange({...priceRange, min: Math.max(priceMinMax.min, Math.min(value, priceRange.max))});
                }}
                className="price-input"
              />
              <span>-</span>
              <input
                type="number"
                placeholder="Max"
                min={priceMinMax.min}
                max={priceMinMax.max}
                value={priceRange.max}
                onChange={(e) => {
                  const value = parseInt(e.target.value) || priceMinMax.max;
                  setPriceRange({...priceRange, max: Math.max(priceRange.min, Math.min(value, priceMinMax.max))});
                }}
                className="price-input"
              />
            </div>
            <div className="price-display">
              {formatPrice(priceRange.min)} - {formatPrice(priceRange.max)}
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum MPG</label>
            <input
              type="range"
              min="0"
              max="50"
              value={minMPG}
              onChange={(e) => setMinMPG(parseInt(e.target.value))}
              className="mpg-slider"
            />
            <div className="mpg-display">{minMPG > 0 ? `${minMPG}+ MPG` : 'Any'}</div>
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
              />
              In Stock Only
            </label>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
              <option value="mpg-desc">MPG (Best First)</option>
              <option value="stock-desc">Availability</option>
            </select>
          </div>

          <div className="filter-stats">
            <p>{filteredProducts.length} vehicles found</p>
          </div>
        </aside>

        <main className="products-section">
          <div className={`products-${viewMode}`}>
            {filteredProducts.map(product => (
              <div key={product.id} className={`product-card ${viewMode}`}>
                <div className="compare-checkbox">
                  <input
                    type="checkbox"
                    checked={compareList.includes(product.id)}
                    onChange={() => toggleCompare(product.id)}
                    id={`compare-${product.id}`}
                  />
                  <label htmlFor={`compare-${product.id}`}>Compare</label>
                </div>
                
                <div className="product-image-section">
                  <div className="product-badge">{product.category}</div>
                  <div className="stock-badge">
                    {product.inStock > 0 ? `${product.inStock} in stock` : 'Out of stock'}
                  </div>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="product-image"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className="product-image-placeholder" style={product.image ? {display: 'none'} : {}}>
                    <span>{product.name}</span>
                  </div>
                </div>

                <div className="product-details">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-year">{product.year} Model</p>
                  
                  <div className="price-section">
                    <div className="main-price">
                      <span className="price-label">Starting at</span>
                      <span className="price-value">{formatPrice(product.price)}</span>
                    </div>
                    <div className="price-details">
                      <span className="msrp">MSRP: {formatPrice(product.msrp)}</span>
                      {product.financing && (
                        <span className="financing">From {formatPrice(product.price * product.financing.apr / 100 / 12)}/mo</span>
                      )}
                    </div>
                  </div>

                  <div className="specs-preview">
                    <div className="spec-item">
                      <span className="spec-icon">⚡</span>
                      <span>{product.specs.performance?.horsepower || 'N/A'}</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">⛽</span>
                      <span>{getMPG(product)} MPG</span>
                    </div>
                    <div className="spec-item">
                      <span className="spec-icon">👥</span>
                      <span>{product.features.standard?.[0] || 'Multiple configurations'}</span>
                    </div>
                  </div>

                  <div className="features-preview">
                    <p className="features-title">Key Features:</p>
                    <ul className="features-list">
                      {product.features.standard?.slice(0, 3).map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="product-actions">
                    <Link to={`/products/${product.id}`} className="btn-details">
                      View Details
                    </Link>
                    <Link to={`/products/${product.id}?tab=features`} className="btn-configure">
                      Build & Price
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {showComparison && (
        <ComparisonModal
          compareList={compareList}
          products={products}
          onClose={() => setShowComparison(false)}
          formatPrice={formatPrice}
        />
      )}
    </div>
  );
}

function ComparisonModal({ compareList, products, onClose, formatPrice }) {
  const [activeTab, setActiveTab] = React.useState('overview');
  const compareProducts = products.filter(p => compareList.includes(p.id));

  const ComparisonTabs = () => (
    <div className="comparison-tabs">
      <button 
        className={activeTab === 'overview' ? 'tab-btn active' : 'tab-btn'}
        onClick={() => setActiveTab('overview')}
      >
        Overview
      </button>
      <button 
        className={activeTab === 'performance' ? 'tab-btn active' : 'tab-btn'}
        onClick={() => setActiveTab('performance')}
      >
        Performance
      </button>
      <button 
        className={activeTab === 'efficiency' ? 'tab-btn active' : 'tab-btn'}
        onClick={() => setActiveTab('efficiency')}
      >
        Hybrid Efficiency
      </button>
      <button 
        className={activeTab === 'luxury' ? 'tab-btn active' : 'tab-btn'}
        onClick={() => setActiveTab('luxury')}
      >
        Luxury Features
      </button>
      <button 
        className={activeTab === 'competitors' ? 'tab-btn active' : 'tab-btn'}
        onClick={() => setActiveTab('competitors')}
      >
        vs Competitors
      </button>
    </div>
  );

  const renderOverview = () => (
    <table className="comparison-table-content">
      <thead>
        <tr>
          <th className="feature-column">Feature</th>
          {compareProducts.map(p => (
            <th key={p.id} className="product-column">
              <div className="product-header">
                <h4>{p.name}</h4>
                <span className="product-category">{p.category}</span>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr className="price-row">
          <td className="feature-name">Price</td>
          {compareProducts.map(p => (
            <td key={p.id} className="highlight-value">
              <div className="price-info">
                <span className="main-price">{formatPrice(p.price)}</span>
                <span className="msrp">MSRP: {formatPrice(p.msrp)}</span>
              </div>
            </td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Year</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.year}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">In Stock</td>
          {compareProducts.map(p => (
            <td key={p.id}>
              <span className={p.inStock > 0 ? 'stock-available' : 'stock-out'}>
                {p.inStock > 0 ? `${p.inStock} available` : 'Out of stock'}
              </span>
            </td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Warranty (Basic)</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.warranty?.basic}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Hybrid Warranty</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.warranty?.hybrid}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  const renderPerformance = () => (
    <table className="comparison-table-content">
      <thead>
        <tr>
          <th className="feature-column">Performance</th>
          {compareProducts.map(p => <th key={p.id}>{p.name}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="feature-name">Hybrid System</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.performance?.engine}</td>
          ))}
        </tr>
        <tr className="highlight-row">
          <td className="feature-name">Total System Power</td>
          {compareProducts.map(p => (
            <td key={p.id} className="highlight-value">{p.specs.performance?.horsepower}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Torque</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.performance?.torque}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Transmission</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.performance?.transmission}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Drivetrain</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.performance?.drivetrain}</td>
          ))}
        </tr>
        <tr className="highlight-row">
          <td className="feature-name">0-60 mph</td>
          {compareProducts.map(p => (
            <td key={p.id} className="highlight-value">{p.specs.performance?.acceleration}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Top Speed</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.performance?.topSpeed}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  const renderEfficiency = () => (
    <table className="comparison-table-content">
      <thead>
        <tr>
          <th className="feature-column">Hybrid Efficiency</th>
          {compareProducts.map(p => <th key={p.id}>{p.name}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr className="highlight-row">
          <td className="feature-name">Combined MPG/MPGe</td>
          {compareProducts.map(p => (
            <td key={p.id} className="highlight-value">
              {p.specs.efficiency?.combinedMPG || p.specs.efficiency?.combinedMPGe} 
              {p.specs.efficiency?.combinedMPGe ? ' MPGe' : ' MPG'}
            </td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">City MPG/MPGe</td>
          {compareProducts.map(p => (
            <td key={p.id}>
              {p.specs.efficiency?.cityMPG || p.specs.efficiency?.cityMPGe}
              {p.specs.efficiency?.cityMPGe ? ' MPGe' : ' MPG'}
            </td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Highway MPG/MPGe</td>
          {compareProducts.map(p => (
            <td key={p.id}>
              {p.specs.efficiency?.highwayMPG || p.specs.efficiency?.highwayMPGe}
              {p.specs.efficiency?.highwayMPGe ? ' MPGe' : ' MPG'}
            </td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">EV Range</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.efficiency?.evRange || 'N/A'}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Battery Type</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.battery?.type}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Battery Capacity</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.battery?.capacity}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Charging Time</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.battery?.chargingTime || 'N/A'}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Total Range</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.efficiency?.range}</td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  const renderLuxury = () => (
    <table className="comparison-table-content">
      <thead>
        <tr>
          <th className="feature-column">Luxury Features</th>
          {compareProducts.map(p => <th key={p.id}>{p.name}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="feature-name">Interior Material</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.luxury?.interiorMaterial}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Wood Trim</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.luxury?.woodTrim}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Ambient Lighting</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.luxury?.ambientLighting}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Climate Zones</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.luxury?.climateZones}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Seat Adjustments</td>
          {compareProducts.map(p => (
            <td key={p.id}>{p.specs.luxury?.seats}</td>
          ))}
        </tr>
        <tr>
          <td className="feature-name">Standard Features</td>
          {compareProducts.map(p => (
            <td key={p.id}>
              <div className="feature-list">
                {p.features.standard?.slice(0, 4).map((feature, idx) => (
                  <div key={idx} className="feature-item">• {feature}</div>
                ))}
              </div>
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );

  const renderCompetitors = () => (
    <div className="competitors-analysis">
      <h3>Competitive Analysis</h3>
      {compareProducts.map(p => (
        <div key={p.id} className="competitor-section">
          <h4>{p.name} vs Competition</h4>
          <div className="competitors-grid">
            <div className="our-vehicle">
              <h5>Our Vehicle</h5>
              <div className="vehicle-summary">
                <p><strong>{p.name}</strong></p>
                <p>Price: {formatPrice(p.price)}</p>
                <p>MPG: {p.specs.efficiency?.combinedMPG || p.specs.efficiency?.combinedMPGe}</p>
                <p>Power: {p.specs.performance?.horsepower}</p>
                <p>Warranty: {p.warranty?.hybrid}</p>
              </div>
            </div>
            <div className="competitive-vehicles">
              <h5>Key Competitors</h5>
              <div className="competitors-list">
                {p.competitors?.map((competitor, idx) => (
                  <div key={idx} className="competitor-item">
                    <span className="competitor-name">{competitor}</span>
                    <div className="competitive-advantages">
                      <p>✓ Better hybrid warranty coverage</p>
                      <p>✓ Superior luxury appointments</p>
                      <p>✓ More comprehensive safety features</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="sales-advantages">
            <h5>Key Selling Advantages</h5>
            <ul>
              <li>Extended hybrid battery warranty ({p.warranty?.hybrid})</li>
              <li>Superior fuel efficiency for the luxury segment</li>
              <li>Premium materials and craftsmanship</li>
              <li>Advanced hybrid technology</li>
              <li>Comprehensive safety suite standard</li>
            </ul>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="comparison-modal">
      <div className="comparison-content">
        <div className="comparison-header">
          <h2>Luxury Hybrid Comparison</h2>
          <div className="comparison-summary">
            Comparing {compareProducts.length} premium hybrid vehicles
          </div>
          <button onClick={onClose} className="close-btn">×</button>
        </div>
        
        <ComparisonTabs />
        
        <div className="comparison-body">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'performance' && renderPerformance()}
          {activeTab === 'efficiency' && renderEfficiency()}
          {activeTab === 'luxury' && renderLuxury()}
          {activeTab === 'competitors' && renderCompetitors()}
        </div>
        
        <div className="comparison-footer">
          <button className="btn-secondary" onClick={onClose}>Close Comparison</button>
          <button className="btn-primary">Print Comparison</button>
          <button className="btn-primary">Email to Customer</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCatalog;