import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import './ProductDetail.css';

// Enhanced ProductDetail Component - Fixed specifications and competitive analysis

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [financeCalculator, setFinanceCalculator] = useState({
    downPayment: 0,
    months: 60,
    showResults: false,
    results: null
  });

  useEffect(() => {
    fetchProduct();
    // Check if tab parameter is in URL
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [id, location.search]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      setSelectedColor(response.data.colors[0]);
      setFinanceCalculator(prev => ({
        ...prev,
        downPayment: Math.round(response.data.price * 0.1)
      }));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching product:', error);
      setLoading(false);
    }
  };

  const calculateFinancing = async () => {
    try {
      const response = await axios.post(`/api/products/${id}/calculate-finance`, {
        downPayment: financeCalculator.downPayment,
        months: financeCalculator.months
      });
      setFinanceCalculator(prev => ({
        ...prev,
        showResults: true,
        results: response.data
      }));
    } catch (error) {
      console.error('Error calculating financing:', error);
    }
  };

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    let total = product.price;
    
    if (selectedColor && selectedColor.price) {
      total += selectedColor.price;
    }
    
    selectedOptions.forEach(option => {
      const match = option.match(/₹([0-9,]+)\)/);
      if (match) {
        total += parseInt(match[1].replace(/,/g, ''));
      }
    });
    
    return total;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (!product) {
    return <div className="error">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="detail-navigation">
        <Link to="/products" className="back-link">← Back to Catalog</Link>
        <div className="breadcrumb">
          <Link to="/">Home</Link> / 
          <Link to="/products">Products</Link> / 
          <span>{product.name}</span>
        </div>
      </div>
      
      <div className="detail-hero">
        <div className="hero-image-section">
          <div className="hero-badges">
            <span className="category-badge">{product.category}</span>
            <span className="year-badge">{product.year}</span>
            {product.inStock > 0 && (
              <span className="stock-badge">{product.inStock} Available</span>
            )}
          </div>
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="hero-product-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="hero-image-placeholder" style={product.image ? {display: 'none'} : {}}>
            <h1>{product.name}</h1>
          </div>
          <div className="color-selector">
            <h4>Available Colors</h4>
            <div className="color-options">
              {product.colors.map((color, idx) => (
                <div
                  key={idx}
                  className={`color-option ${selectedColor?.name === color.name ? 'selected' : ''}`}
                  onClick={() => setSelectedColor(color)}
                  title={`${color.name} ${color.price > 0 ? `(+${formatPrice(color.price)})` : ''}`}
                >
                  <div className="color-swatch" style={{ backgroundColor: color.hex }}></div>
                  <span className="color-name">{color.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="hero-info-section">
          <div className="hero-header">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-tagline">{product.description}</p>
          </div>
          
          <div className="pricing-section">
            <div className="price-display">
              <div className="base-price">
                <span className="price-label">Starting MSRP</span>
                <span className="price-value">{formatPrice(product.msrp)}</span>
              </div>
              <div className="our-price">
                <span className="price-label">Our Price</span>
                <span className="price-value primary">{formatPrice(product.price)}</span>
              </div>
              <div className="configured-price">
                <span className="price-label">As Configured</span>
                <span className="price-value">{formatPrice(calculateTotalPrice())}</span>
              </div>
            </div>
            
            {product.incentives && (
              <div className="incentives-box">
                <h4>Available Incentives</h4>
                <ul>
                  {product.incentives.federal && (
                    <li>Federal Tax Credit: {formatPrice(product.incentives.federal)}</li>
                  )}
                  {product.incentives.state && (
                    <li>State Rebate: {formatPrice(product.incentives.state)}</li>
                  )}
                  {product.incentives.dealer && (
                    <li>Dealer Discount: {formatPrice(product.incentives.dealer)}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          
          <div className="quick-specs">
            <div className="quick-spec">
              <span className="spec-icon">⚡</span>
              <div>
                <span className="spec-label">Power</span>
                <span className="spec-value">{product.specs.performance?.horsepower}</span>
              </div>
            </div>
            <div className="quick-spec">
              <span className="spec-icon">⛽</span>
              <div>
                <span className="spec-label">Efficiency</span>
                <span className="spec-value">
                  {product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} 
                  {product.category === 'Electric' ? ' MPGe' : ' MPG'}
                </span>
              </div>
            </div>
            <div className="quick-spec">
              <span className="spec-icon">🚗</span>
              <div>
                <span className="spec-label">Drivetrain</span>
                <span className="spec-value">{product.specs.performance?.drivetrain}</span>
              </div>
            </div>
            <div className="quick-spec">
              <span className="spec-icon">⚙️</span>
              <div>
                <span className="spec-label">Transmission</span>
                <span className="spec-value">{product.specs.performance?.transmission}</span>
              </div>
            </div>
          </div>
          
          <div className="action-buttons">
            <button className="btn-primary" onClick={() => setActiveTab('finance')}>
              Calculate Payment
            </button>
            <button className="btn-secondary" onClick={() => {
              alert(`Test drive scheduled for ${product.name}!\n\nOur sales team will contact you within 24 hours to confirm your appointment.\n\nContact: 1800-HYBRID-1 (1800-492743-1)\nEmail: testdrive@luxuryhybrid.in`);
            }}>
              Schedule Test Drive
            </button>
            <button className="btn-outline" onClick={() => {
              // Generate PDF
              const doc = new jsPDF();
              const pageHeight = doc.internal.pageSize.height;
              let yPosition = 20;
              
              // Title
              doc.setFontSize(24);
              doc.setTextColor(102, 126, 234); // Purple color
              doc.text(product.name, 20, yPosition);
              yPosition += 10;
              
              doc.setFontSize(14);
              doc.setTextColor(100);
              doc.text(`${product.year} Model - ${product.category}`, 20, yPosition);
              yPosition += 15;
              
              // Price Section
              doc.setFontSize(16);
              doc.setTextColor(0);
              doc.text('Pricing Information', 20, yPosition);
              yPosition += 10;
              
              doc.setFontSize(12);
              doc.setTextColor(50);
              doc.text(`Our Price: ${formatPrice(product.price)}`, 20, yPosition);
              yPosition += 7;
              doc.text(`MSRP: ${formatPrice(product.msrp)}`, 20, yPosition);
              yPosition += 7;
              if (product.financing) {
                doc.text(`Financing Available: ${product.financing.apr}% APR`, 20, yPosition);
                yPosition += 10;
              }
              
              // Key Features
              yPosition += 5;
              doc.setFontSize(16);
              doc.setTextColor(0);
              doc.text('Key Features', 20, yPosition);
              yPosition += 10;
              
              doc.setFontSize(11);
              doc.setTextColor(50);
              product.features.standard.slice(0, 8).forEach(feature => {
                if (yPosition > pageHeight - 30) {
                  doc.addPage();
                  yPosition = 20;
                }
                doc.text(`• ${feature}`, 25, yPosition);
                yPosition += 7;
              });
              
              // Specifications
              yPosition += 5;
              doc.setFontSize(16);
              doc.setTextColor(0);
              doc.text('Specifications', 20, yPosition);
              yPosition += 10;
              
              doc.setFontSize(11);
              doc.setTextColor(50);
              
              // Performance
              doc.setFontSize(13);
              doc.setTextColor(102, 126, 234);
              doc.text('Performance', 25, yPosition);
              yPosition += 7;
              
              doc.setFontSize(11);
              doc.setTextColor(50);
              doc.text(`Engine: ${product.specs.performance.engine}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Power: ${product.specs.performance.horsepower}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Torque: ${product.specs.performance.torque}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Acceleration: ${product.specs.performance.acceleration}`, 30, yPosition);
              yPosition += 10;
              
              // Efficiency
              if (yPosition > pageHeight - 50) {
                doc.addPage();
                yPosition = 20;
              }
              
              doc.setFontSize(13);
              doc.setTextColor(102, 126, 234);
              doc.text('Fuel Efficiency', 25, yPosition);
              yPosition += 7;
              
              doc.setFontSize(11);
              doc.setTextColor(50);
              const mpgType = product.specs.efficiency?.combinedMPGe ? 'MPGe' : 'MPG';
              doc.text(`City: ${product.specs.efficiency?.cityMPG || product.specs.efficiency?.cityMPGe} ${mpgType}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Highway: ${product.specs.efficiency?.highwayMPG || product.specs.efficiency?.highwayMPGe} ${mpgType}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Combined: ${product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} ${mpgType}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Range: ${product.specs.efficiency?.range}`, 30, yPosition);
              yPosition += 10;
              
              // Warranty
              doc.setFontSize(13);
              doc.setTextColor(102, 126, 234);
              doc.text('Warranty Coverage', 25, yPosition);
              yPosition += 7;
              
              doc.setFontSize(11);
              doc.setTextColor(50);
              doc.text(`Basic: ${product.warranty.basic}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Powertrain: ${product.warranty.powertrain}`, 30, yPosition);
              yPosition += 6;
              doc.text(`Hybrid Components: ${product.warranty.hybrid}`, 30, yPosition);
              yPosition += 15;
              
              // Contact Information
              if (yPosition > pageHeight - 40) {
                doc.addPage();
                yPosition = 20;
              }
              
              doc.setFontSize(14);
              doc.setTextColor(0);
              doc.text('Contact Us', 20, yPosition);
              yPosition += 8;
              
              doc.setFontSize(11);
              doc.setTextColor(50);
              doc.text('Phone: 1800-HYBRID-1 (1800-492743-1)', 20, yPosition);
              yPosition += 6;
              doc.text('Email: info@luxuryhybrid.in', 20, yPosition);
              yPosition += 6;
              doc.text('Website: www.luxuryhybrid.in', 20, yPosition);
              yPosition += 10;
              
              // Footer
              doc.setFontSize(9);
              doc.setTextColor(150);
              doc.text('© 2024 Luxury Hybrid Dealership. All rights reserved.', 20, pageHeight - 10);
              
              // Save the PDF
              doc.save(`${product.name.replace(/\s+/g, '_')}_Brochure.pdf`);
            }}>
              Download Brochure
            </button>
          </div>
        </div>
      </div>

      <div className="detail-tabs">
        <div className="tab-navigation">
          <button 
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={activeTab === 'specs' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('specs')}
          >
            Specifications
          </button>
          <button 
            className={activeTab === 'features' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('features')}
          >
            Features & Options
          </button>
          <button 
            className={activeTab === 'finance' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('finance')}
          >
            Financing
          </button>
          <button 
            className={activeTab === 'warranty' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('warranty')}
          >
            Warranty
          </button>
          <button 
            className={activeTab === 'services' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('services')}
          >
            Services & Support
          </button>
          <button 
            className={activeTab === 'competitive' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('competitive')}
          >
            Competitive Analysis
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="overview-grid">
                <div className="overview-section">
                  <h3>Vehicle Highlights</h3>
                  <ul className="highlights-list">
                    {product.popularOptions?.map((option, idx) => (
                      <li key={idx}>{option}</li>
                    ))}
                    <li>{product.specs.performance?.engine}</li>
                    <li>{product.specs.performance?.acceleration}</li>
                    <li>{product.warranty?.basic} Basic Warranty</li>
                  </ul>
                </div>
                
                <div className="overview-section">
                  <h3>Key Competitors</h3>
                  <div className="competitors-list">
                    {product.competitors?.map((competitor, idx) => (
                      <div key={idx} className="competitor-item">
                        {competitor}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="overview-section">
                  <h3>Safety Rating</h3>
                  <div className="safety-info">
                    <div className="crash-test-rating">
                      {product.specs.safety?.crashTest}
                    </div>
                    <ul className="safety-features">
                      {product.specs.safety?.standardFeatures?.slice(0, 4).map((feature, idx) => (
                        <li key={idx}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="specs-content">
              <div className="specs-header">
                <h2>🔧 Complete Vehicle Specifications</h2>
                <p>Comprehensive technical details and features for {product.name}</p>
                <div className="quick-stats">
                  <span className="stat-badge">
                    🏎️ {product.specs?.performance?.horsepower || 'Power N/A'}
                  </span>
                  <span className="stat-badge">
                    ⛽ {product.specs?.efficiency?.combinedMPG || product.specs?.efficiency?.combinedMPGe || 'N/A'} {product.specs?.efficiency?.combinedMPGe ? 'MPGe' : 'MPG'}
                  </span>
                  <span className="stat-badge">
                    🔋 {product.specs?.battery?.type || 'Hybrid Type N/A'}
                  </span>
                </div>
              </div>
              
              <div className="specs-grid">
                {/* Performance Specifications */}
                <div className="spec-category highlight">
                  <h3>🚗 Performance & Powertrain</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">Engine Type</td>
                        <td className="spec-value">{product.specs?.performance?.engine || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Total System Power</td>
                        <td className="spec-value highlight">{product.specs?.performance?.horsepower || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Torque</td>
                        <td className="spec-value">{product.specs?.performance?.torque || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Transmission</td>
                        <td className="spec-value">{product.specs?.performance?.transmission || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Drivetrain</td>
                        <td className="spec-value">{product.specs?.performance?.drivetrain || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Acceleration (0-60 mph)</td>
                        <td className="spec-value highlight">{product.specs?.performance?.acceleration || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Top Speed</td>
                        <td className="spec-value">{product.specs?.performance?.topSpeed || 'Not Specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Hybrid Battery System */}
                <div className="spec-category highlight">
                  <h3>🔋 Hybrid Battery System</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">Battery Type</td>
                        <td className="spec-value highlight">{product.specs?.battery?.type || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Battery Capacity</td>
                        <td className="spec-value">{product.specs?.battery?.capacity || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Battery Location</td>
                        <td className="spec-value">{product.specs?.battery?.location || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Battery Warranty</td>
                        <td className="spec-value highlight">{product.specs?.battery?.warranty || 'Not Specified'}</td>
                      </tr>
                      {product.specs?.battery?.chargingTime && (
                        <tr>
                          <td className="spec-name">Charging Time (Level 2)</td>
                          <td className="spec-value">{product.specs.battery.chargingTime}</td>
                        </tr>
                      )}
                      {product.specs?.battery?.evRange && (
                        <tr>
                          <td className="spec-name">Electric-Only Range</td>
                          <td className="spec-value highlight">{product.specs.battery.evRange}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Fuel Economy & Efficiency */}
                <div className="spec-category highlight">
                  <h3>⛽ Fuel Economy & Efficiency</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">City MPG</td>
                        <td className="spec-value">{product.specs?.efficiency?.cityMPG || product.specs?.efficiency?.cityMPGe || 'Not Specified'} {product.specs?.efficiency?.cityMPGe ? 'MPGe' : 'MPG'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Highway MPG</td>
                        <td className="spec-value">{product.specs?.efficiency?.highwayMPG || product.specs?.efficiency?.highwayMPGe || 'Not Specified'} {product.specs?.efficiency?.highwayMPGe ? 'MPGe' : 'MPG'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Combined MPG</td>
                        <td className="spec-value highlight">{product.specs?.efficiency?.combinedMPG || product.specs?.efficiency?.combinedMPGe || 'Not Specified'} {product.specs?.efficiency?.combinedMPGe ? 'MPGe' : 'MPG'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Fuel Tank Capacity</td>
                        <td className="spec-value">{product.specs?.efficiency?.fuelCapacity || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Total Range</td>
                        <td className="spec-value highlight">{product.specs?.efficiency?.range || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Emissions Rating</td>
                        <td className="spec-value">{product.specs?.efficiency?.emissions || 'Not Specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Vehicle Dimensions */}
                <div className="spec-category">
                  <h3>📏 Vehicle Dimensions</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">Overall Length</td>
                        <td className="spec-value">{product.specs?.dimensions?.length || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Overall Width</td>
                        <td className="spec-value">{product.specs?.dimensions?.width || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Overall Height</td>
                        <td className="spec-value">{product.specs?.dimensions?.height || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Wheelbase</td>
                        <td className="spec-value">{product.specs?.dimensions?.wheelbase || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Ground Clearance</td>
                        <td className="spec-value">{product.specs?.dimensions?.groundClearance || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Curb Weight</td>
                        <td className="spec-value">{product.specs?.dimensions?.weight || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Cargo Capacity</td>
                        <td className="spec-value">{product.specs?.dimensions?.trunkCapacity || product.specs?.dimensions?.cargoCapacity || 'Not Specified'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Luxury Features */}
                <div className="spec-category">
                  <h3>✨ Luxury & Comfort</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">Interior Material</td>
                        <td className="spec-value highlight">{product.specs?.luxury?.interiorMaterial || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Wood Trim</td>
                        <td className="spec-value">{product.specs?.luxury?.woodTrim || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Ambient Lighting</td>
                        <td className="spec-value">{product.specs?.luxury?.ambientLighting || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Climate Control</td>
                        <td className="spec-value">{product.specs?.luxury?.climateZones || 'Not Specified'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Seat Adjustability</td>
                        <td className="spec-value">{product.specs?.luxury?.seats || 'Not Specified'}</td>
                      </tr>
                      {product.specs?.luxury?.craftsmanship && (
                        <tr>
                          <td className="spec-name">Craftsmanship</td>
                          <td className="spec-value highlight">{product.specs.luxury.craftsmanship}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Safety & Security */}
                <div className="spec-category">
                  <h3>🛡️ Safety & Security</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">Crash Test Rating</td>
                        <td className="spec-value highlight">{product.specs?.safety?.crashTest || 'Not Rated'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Standard Safety Features</td>
                        <td className="spec-value">
                          <ul className="safety-features-detailed">
                            {product.specs?.safety?.standardFeatures?.map((feature, idx) => (
                              <li key={idx}>{feature}</li>
                            )) || <li>No information available</li>}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Capability (for SUVs/Crossovers) */}
                {product.specs?.capability && (
                  <div className="spec-category">
                    <h3>🏔️ Capability & Performance</h3>
                    <table className="spec-table">
                      <tbody>
                        {Object.entries(product.specs.capability).map(([key, value]) => (
                          <tr key={key}>
                            <td className="spec-name">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </td>
                            <td className="spec-value">{value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Comprehensive Warranty Coverage */}
                <div className="spec-category highlight">
                  <h3>🛡️ Warranty Coverage</h3>
                  <table className="spec-table">
                    <tbody>
                      {Object.entries(product.warranty || {}).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-name">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Warranty
                          </td>
                          <td className="spec-value highlight">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pricing & Value */}
                <div className="spec-category highlight">
                  <h3>💰 Pricing & Incentives</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">Manufacturer's Suggested Retail Price (MSRP)</td>
                        <td className="spec-value">{formatPrice(product.msrp)}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Our Price</td>
                        <td className="spec-value highlight-price">{formatPrice(product.price)}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Your Savings</td>
                        <td className="spec-value savings">{formatPrice(product.msrp - product.price)}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Financing APR (Qualified Buyers)</td>
                        <td className="spec-value">{product.financing?.apr ? `${product.financing.apr}%` : 'Contact for rates'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Available Incentives</td>
                        <td className="spec-value">
                          <ul className="incentives-detailed">
                            {product.incentives && Object.entries(product.incentives).map(([type, amount]) => (
                              <li key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}: <strong>{formatPrice(amount)}</strong></li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Availability & Stock */}
                <div className="spec-category">
                  <h3>📦 Availability & Options</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">Current Inventory</td>
                        <td className="spec-value">
                          <span className={`stock-indicator ${product.inStock > 5 ? 'high' : product.inStock > 2 ? 'medium' : 'low'}`}>
                            {product.inStock} vehicles available
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="spec-name">Popular Options</td>
                        <td className="spec-value">
                          <ul className="popular-options-detailed">
                            {product.popularOptions?.map((option, idx) => (
                              <li key={idx}>{option}</li>
                            )) || <li>Standard configuration recommended</li>}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="spec-name">Key Competitors</td>
                        <td className="spec-value">
                          <ul className="competitors-detailed">
                            {product.competitors?.map((comp, idx) => (
                              <li key={idx}>{comp}</li>
                            )) || <li>Market leader in segment</li>}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
                
                {product.specs.capability && (
                  <div className="spec-category">
                    <h3>Capability</h3>
                    <table className="spec-table">
                      <tbody>
                        {Object.entries(product.specs.capability).map(([key, value]) => (
                          <tr key={key}>
                            <td className="spec-name">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </td>
                            <td className="spec-value">{value || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
                
                {product.specs.battery && (
                  <div className="spec-category">
                    <h3>Battery & Charging</h3>
                    <table className="spec-table">
                      <tbody>
                        {Object.entries(product.specs.battery).map(([key, value]) => (
                          <tr key={key}>
                            <td className="spec-name">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </td>
                            <td className="spec-value">{value || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {product.specs.luxury && (
                  <div className="spec-category">
                    <h3>Luxury & Comfort</h3>
                    <table className="spec-table">
                      <tbody>
                        {Object.entries(product.specs.luxury).map(([key, value]) => (
                          <tr key={key}>
                            <td className="spec-name">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </td>
                            <td className="spec-value">{value || 'N/A'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {product.specs.safety && (
                  <div className="spec-category">
                    <h3>Safety & Security</h3>
                    <table className="spec-table">
                      <tbody>
                        <tr>
                          <td className="spec-name">Crash Test Rating</td>
                          <td className="spec-value">{product.specs.safety.crashTest || 'N/A'}</td>
                        </tr>
                        <tr>
                          <td className="spec-name">Standard Safety Features</td>
                          <td className="spec-value">
                            <ul className="safety-features-list">
                              {product.specs.safety.standardFeatures?.map((feature, idx) => (
                                <li key={idx}>{feature}</li>
                              )) || <li>N/A</li>}
                            </ul>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="spec-category">
                  <h3>Warranty Coverage</h3>
                  <table className="spec-table">
                    <tbody>
                      {Object.entries(product.warranty || {}).map(([key, value]) => (
                        <tr key={key}>
                          <td className="spec-name">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Warranty
                          </td>
                          <td className="spec-value">{value || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="spec-category">
                  <h3>Pricing & Incentives</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">MSRP</td>
                        <td className="spec-value">{formatPrice(product.msrp)}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Our Price</td>
                        <td className="spec-value">{formatPrice(product.price)}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Dealer Cost</td>
                        <td className="spec-value">{formatPrice(product.dealerCost)}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Available Incentives</td>
                        <td className="spec-value">
                          <ul className="incentives-list">
                            {product.incentives && Object.entries(product.incentives).map(([type, amount]) => (
                              <li key={type}>{type.charAt(0).toUpperCase() + type.slice(1)}: {formatPrice(amount)}</li>
                            ))}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="spec-name">Financing APR</td>
                        <td className="spec-value">{product.financing?.apr ? `${product.financing.apr}%` : 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="spec-name">Available Terms</td>
                        <td className="spec-value">
                          {product.financing?.months ? 
                            product.financing.months.map(m => `${m} months`).join(', ') : 
                            'N/A'
                          }
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="spec-category">
                  <h3>Availability & Stock</h3>
                  <table className="spec-table">
                    <tbody>
                      <tr>
                        <td className="spec-name">In Stock</td>
                        <td className="spec-value">
                          <span className={`stock-indicator ${product.inStock > 5 ? 'high' : product.inStock > 2 ? 'medium' : 'low'}`}>
                            {product.inStock} Available
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="spec-name">Popular Options</td>
                        <td className="spec-value">
                          <ul className="popular-options-list">
                            {product.popularOptions?.map((option, idx) => (
                              <li key={idx}>{option}</li>
                            )) || <li>N/A</li>}
                          </ul>
                        </td>
                      </tr>
                      <tr>
                        <td className="spec-name">Competitor Models</td>
                        <td className="spec-value">
                          <ul className="competitors-list">
                            {product.competitors?.map((comp, idx) => (
                              <li key={idx}>{comp}</li>
                            )) || <li>N/A</li>}
                          </ul>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="features-content">
              <h2>🎯 Features & Options</h2>
              <div className="features-grid">
                <div className="features-section">
                  <h3>📋 Standard Features</h3>
                  <ul className="features-list">
                    {product.features?.standard?.map((feature, idx) => (
                      <li key={idx} className="feature-item">
                        <span className="feature-check">✅</span>
                        <span className="feature-text">{feature}</span>
                      </li>
                    )) || (
                      <li className="feature-item">
                        <span className="feature-check">ℹ️</span>
                        <span className="feature-text">Premium features included</span>
                      </li>
                    )}
                  </ul>
                </div>
                
                <div className="features-section">
                  <h3>🎯 Available Options</h3>
                  <div className="options-list">
                    {product.features?.available?.map((option, idx) => (
                      <div key={idx} className="option-item">
                        <label className="option-label">
                          <input
                            type="checkbox"
                            checked={selectedOptions.includes(option)}
                            onChange={() => toggleOption(option)}
                          />
                          <span className="option-text">{option}</span>
                        </label>
                      </div>
                    )) || (
                      <div className="no-options">
                        <p>Additional options available</p>
                      </div>
                    )}
                  </div>
                  {selectedOptions.length > 0 && (
                    <div className="selected-options-summary">
                      <h4>🛒 Selected Options ({selectedOptions.length})</h4>
                      <ul>
                        {selectedOptions.map((option, idx) => (
                          <li key={idx}>{option}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="features-section">
                  <h3>🎨 Available Colors</h3>
                  <div className="colors-grid">
                    {product.colors?.map((color, idx) => (
                      <div key={idx} className="color-option">
                        <div 
                          className="color-swatch" 
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        ></div>
                        <div className="color-info">
                          <span className="color-name">{color.name}</span>
                          <span className="color-price">
                            {color.price === 0 ? 'No Charge' : `+${formatPrice(color.price)}`}
                          </span>
                        </div>
                      </div>
                    )) || (
                      <div className="no-colors">
                        <p>Multiple color options available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'finance' && (
            <div className="finance-content">
              <div className="finance-calculator">
                <h3>Payment Calculator</h3>
                <div className="calculator-inputs">
                  <div className="input-group">
                    <label>Vehicle Price</label>
                    <input 
                      type="text" 
                      value={formatPrice(calculateTotalPrice())} 
                      disabled 
                    />
                  </div>
                  <div className="input-group">
                    <label>Down Payment</label>
                    <input 
                      type="number" 
                      value={financeCalculator.downPayment}
                      onChange={(e) => setFinanceCalculator(prev => ({
                        ...prev,
                        downPayment: parseInt(e.target.value) || 0
                      }))}
                    />
                  </div>
                  <div className="input-group">
                    <label>Loan Term</label>
                    <select 
                      value={financeCalculator.months}
                      onChange={(e) => setFinanceCalculator(prev => ({
                        ...prev,
                        months: parseInt(e.target.value)
                      }))}
                    >
                      {product.financing.months.map(month => (
                        <option key={month} value={month}>{month} months</option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group">
                    <label>APR</label>
                    <input 
                      type="text" 
                      value={`${product.financing.apr}%`} 
                      disabled 
                    />
                  </div>
                </div>
                
                <button className="calculate-btn" onClick={calculateFinancing}>
                  Calculate Payment
                </button>
                
                {financeCalculator.showResults && financeCalculator.results && (
                  <div className="finance-results">
                    <div className="result-item primary">
                      <span className="result-label">Monthly Payment</span>
                      <span className="result-value">{formatPrice(financeCalculator.results.monthlyPayment)}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Total Cost</span>
                      <span className="result-value">{formatPrice(financeCalculator.results.totalCost)}</span>
                    </div>
                    <div className="result-item">
                      <span className="result-label">Total Interest</span>
                      <span className="result-value">{formatPrice(financeCalculator.results.totalInterest)}</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="finance-disclaimer">
                <p>* Payment calculations are estimates for informational purposes only. Actual rates and terms may vary based on credit approval.</p>
              </div>
            </div>
          )}

          {activeTab === 'warranty' && (
            <div className="warranty-content">
              <div className="warranty-header">
                <h3>Comprehensive Warranty Coverage</h3>
                <p>Industry-leading protection for your investment in hybrid luxury</p>
              </div>
              
              <div className="warranty-grid">
                {Object.entries(product.warranty || {}).map(([key, value]) => (
                  <div key={key} className="warranty-item">
                    <div className="warranty-icon">
                      {key === 'basic' && '🛡️'}
                      {key === 'powertrain' && '⚙️'}
                      {key === 'hybrid' && '🔋'}
                      {key === 'corrosion' && '🚗'}
                      {key === 'roadside' && '🚑'}
                    </div>
                    <h4>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} Warranty</h4>
                    <p className="warranty-coverage">{value}</p>
                    <div className="warranty-description">
                      {key === 'basic' && 'Covers most vehicle components and systems'}
                      {key === 'powertrain' && 'Engine, transmission, and drivetrain coverage'}
                      {key === 'hybrid' && 'Hybrid battery and electric motor components'}
                      {key === 'corrosion' && 'Protection against rust and corrosion damage'}
                      {key === 'roadside' && '24/7 emergency roadside assistance'}
                    </div>
                  </div>
                ))}
              </div>

              <div className="warranty-benefits">
                <h4>🌟 Warranty Benefits & Advantages</h4>
                <div className="benefits-grid">
                  <div className="benefit-item">
                    <h5>✅ Peace of Mind</h5>
                    <p>Comprehensive coverage protects against unexpected repair costs</p>
                  </div>
                  <div className="benefit-item">
                    <h5>💰 Higher Resale Value</h5>
                    <p>Transferable warranty coverage enhances vehicle resale value</p>
                  </div>
                  <div className="benefit-item">
                    <h5>🔧 Authorized Service</h5>
                    <p>Access to certified technicians and genuine OEM parts</p>
                  </div>
                  <div className="benefit-item">
                    <h5>📞 Customer Support</h5>
                    <p>Dedicated warranty support team for quick claim resolution</p>
                  </div>
                </div>
              </div>

              <div className="warranty-comparison">
                <h4>📊 Competitive Warranty Comparison</h4>
                <div className="comparison-table">
                  <div className="comparison-row header">
                    <span>Coverage Type</span>
                    <span>{product.name}</span>
                    <span>German Luxury Avg</span>
                    <span>Industry Standard</span>
                  </div>
                  <div className="comparison-row">
                    <span>Basic Warranty</span>
                    <span className="our-advantage">{product.warranty?.basic || 'N/A'}</span>
                    <span>4 years / 50,000 miles</span>
                    <span>3 years / 36,000 miles</span>
                  </div>
                  <div className="comparison-row">
                    <span>Powertrain</span>
                    <span className="our-advantage">{product.warranty?.powertrain || 'N/A'}</span>
                    <span>4 years / 50,000 miles</span>
                    <span>5 years / 60,000 miles</span>
                  </div>
                  <div className="comparison-row highlight">
                    <span>Hybrid Components</span>
                    <span className="our-advantage">{product.warranty?.hybrid || 'N/A'}</span>
                    <span>8 years / 80,000 miles</span>
                    <span>8 years / 100,000 miles</span>
                  </div>
                </div>
              </div>

              <div className="warranty-claims-process">
                <h4>🏃‍♂️ Simple Claims Process</h4>
                <div className="process-steps">
                  <div className="process-step">
                    <div className="step-number">1</div>
                    <h5>Contact Service Center</h5>
                    <p>Call our warranty hotline or visit authorized dealer</p>
                  </div>
                  <div className="process-step">
                    <div className="step-number">2</div>
                    <h5>Diagnostic & Assessment</h5>
                    <p>Certified technician diagnoses the issue</p>
                  </div>
                  <div className="process-step">
                    <div className="step-number">3</div>
                    <h5>Warranty Approval</h5>
                    <p>Coverage verified and repair authorized</p>
                  </div>
                  <div className="process-step">
                    <div className="step-number">4</div>
                    <h5>Professional Repair</h5>
                    <p>Expert repair using genuine parts</p>
                  </div>
                </div>
              </div>
              
              {product.chargingNetwork && (
                <div className="charging-info">
                  <h3>🔌 Charging Network Support</h3>
                  <div className="charging-benefits">
                    <ul>
                      <li>{product.chargingNetwork.included}</li>
                      <li>{product.chargingNetwork.networkSize}</li>
                      <li>{product.chargingNetwork.homeCharger}</li>
                    </ul>
                  </div>
                </div>
              )}

              <div className="warranty-contact">
                <div className="contact-card">
                  <h4>📞 Warranty Support Contact</h4>
                  <div className="contact-details">
                    <p><strong>Phone:</strong> 1-800-WARRANTY (1-800-927-7268)</p>
                    <p><strong>Hours:</strong> 24/7 Emergency, 8 AM - 8 PM for General Support</p>
                    <p><strong>Email:</strong> warranty@luxuryhybrid.in</p>
                    <p><strong>Online:</strong> www.luxuryhybrid.in/warranty-portal</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="services-content">
              <div className="services-header">
                <h3>🛠️ Services & Support</h3>
                <p>Comprehensive service programs designed for luxury hybrid vehicle owners</p>
              </div>

              <div className="services-grid">
                <div className="service-category">
                  <div className="service-icon">🔧</div>
                  <h4>Maintenance Services</h4>
                  <div className="service-features">
                    <div className="service-feature">
                      <h5>✅ Scheduled Maintenance</h5>
                      <p>Expert technicians trained specifically on hybrid systems</p>
                      <ul>
                        <li>Oil changes every 10,000 miles</li>
                        <li>Hybrid system inspection</li>
                        <li>Battery health monitoring</li>
                        <li>Software updates and recalls</li>
                      </ul>
                    </div>
                    <div className="service-feature">
                      <h5>🔍 Multi-Point Inspection</h5>
                      <p>Comprehensive 150-point vehicle inspection</p>
                      <ul>
                        <li>Hybrid battery performance check</li>
                        <li>Brake system evaluation</li>
                        <li>Cooling system service</li>
                        <li>Tire rotation and alignment</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="service-category">
                  <div className="service-icon">🚗</div>
                  <h4>Specialized Hybrid Services</h4>
                  <div className="service-features">
                    <div className="service-feature">
                      <h5>🔋 Battery Services</h5>
                      <p>Advanced diagnostics and maintenance</p>
                      <ul>
                        <li>Battery health assessment</li>
                        <li>Cooling system maintenance</li>
                        <li>Performance optimization</li>
                        <li>Replacement when needed</li>
                      </ul>
                    </div>
                    <div className="service-feature">
                      <h5>⚡ Charging System Service</h5>
                      <p>For plug-in hybrid models</p>
                      <ul>
                        <li>Charging port inspection</li>
                        <li>Cable and connector check</li>
                        <li>Home charger installation support</li>
                        <li>Charging network assistance</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="service-category">
                  <div className="service-icon">📱</div>
                  <h4>Customer Support</h4>
                  <div className="service-features">
                    <div className="service-feature">
                      <h5>🆘 24/7 Roadside Assistance</h5>
                      <p>Emergency support when you need it most</p>
                      <ul>
                        <li>Jump start and towing service</li>
                        <li>Flat tire assistance</li>
                        <li>Lockout service</li>
                        <li>Emergency fuel delivery</li>
                      </ul>
                    </div>
                    <div className="service-feature">
                      <h5>📞 Customer Care</h5>
                      <p>Dedicated support for all your needs</p>
                      <ul>
                        <li>Technical support hotline</li>
                        <li>Service appointment scheduling</li>
                        <li>Parts and accessories ordering</li>
                        <li>Owner education programs</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="service-category">
                  <div className="service-icon">💎</div>
                  <h4>Premium Services</h4>
                  <div className="service-features">
                    <div className="service-feature">
                      <h5>🚙 Concierge Service</h5>
                      <p>White-glove service experience</p>
                      <ul>
                        <li>Vehicle pickup and delivery</li>
                        <li>Loaner vehicle during service</li>
                        <li>Express service lane</li>
                        <li>Priority appointment scheduling</li>
                      </ul>
                    </div>
                    <div className="service-feature">
                      <h5>🎯 Personalized Care</h5>
                      <p>Tailored to your driving habits</p>
                      <ul>
                        <li>Service history tracking</li>
                        <li>Proactive maintenance reminders</li>
                        <li>Seasonal preparation services</li>
                        <li>Performance optimization</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="service-plans">
                <h4>🎊 Service Plan Options</h4>
                <div className="plans-grid">
                  <div className="service-plan">
                    <div className="plan-header">
                      <h5>Essential Care</h5>
                      <div className="plan-price">₹25,000/year</div>
                    </div>
                    <ul className="plan-features">
                      <li>✅ Scheduled maintenance</li>
                      <li>✅ Multi-point inspections</li>
                      <li>✅ Priority scheduling</li>
                      <li>✅ Genuine parts guarantee</li>
                    </ul>
                    <div className="plan-savings">Save up to ₹15,000 annually</div>
                  </div>

                  <div className="service-plan premium">
                    <div className="plan-badge">Most Popular</div>
                    <div className="plan-header">
                      <h5>Premium Care</h5>
                      <div className="plan-price">₹45,000/year</div>
                    </div>
                    <ul className="plan-features">
                      <li>✅ Everything in Essential Care</li>
                      <li>✅ Pickup & delivery service</li>
                      <li>✅ Loaner vehicle included</li>
                      <li>✅ Extended warranties available</li>
                      <li>✅ 24/7 concierge support</li>
                    </ul>
                    <div className="plan-savings">Save up to ₹25,000 annually</div>
                  </div>

                  <div className="service-plan">
                    <div className="plan-header">
                      <h5>Executive Care</h5>
                      <div className="plan-price">₹65,000/year</div>
                    </div>
                    <ul className="plan-features">
                      <li>✅ Everything in Premium Care</li>
                      <li>✅ Detailed cosmetic care</li>
                      <li>✅ Performance tuning</li>
                      <li>✅ Exclusive customer events</li>
                      <li>✅ VIP service experience</li>
                    </ul>
                    <div className="plan-savings">Save up to ₹35,000 annually</div>
                  </div>
                </div>
              </div>

              <div className="service-contact">
                <h4>📞 Schedule Your Service</h4>
                <div className="contact-methods">
                  <div className="contact-method">
                    <div className="contact-icon">📱</div>
                    <h5>Call Us</h5>
                    <p>1-800-HYBRID (1-800-493-7434)</p>
                    <span>24/7 Available</span>
                  </div>
                  <div className="contact-method">
                    <div className="contact-icon">💻</div>
                    <h5>Online Booking</h5>
                    <p>www.luxuryhybrid.in/service</p>
                    <span>Schedule anytime</span>
                  </div>
                  <div className="contact-method">
                    <div className="contact-icon">📲</div>
                    <h5>Mobile App</h5>
                    <p>Luxury Hybrid Service</p>
                    <span>iOS & Android</span>
                  </div>
                </div>
              </div>

              <div className="service-locations">
                <h4>🏢 Service Center Locations</h4>
                <div className="locations-grid">
                  <div className="location-card">
                    <h5>🏙️ Downtown Service Center</h5>
                    <p>123 Business District, Mumbai 400001</p>
                    <div className="location-details">
                      <span>⏰ Mon-Sat: 7AM-7PM</span>
                      <span>📞 +91-22-1234-5678</span>
                    </div>
                  </div>
                  <div className="location-card">
                    <h5>🌃 Express Service Hub</h5>
                    <p>456 Highway Plaza, Delhi 110001</p>
                    <div className="location-details">
                      <span>⏰ Mon-Sun: 6AM-10PM</span>
                      <span>📞 +91-11-8765-4321</span>
                    </div>
                  </div>
                  <div className="location-card">
                    <h5>🏘️ Suburban Center</h5>
                    <p>789 Mall Complex, Bangalore 560001</p>
                    <div className="location-details">
                      <span>⏰ Mon-Sat: 8AM-6PM</span>
                      <span>📞 +91-80-5555-6666</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'competitive' && (
            <div className="competitive-analysis-content">
              <h3>{product.name} Competitive Analysis</h3>
              
              <div className="competitive-overview">
                <div className="our-advantages">
                  <h4>Why Choose {product.name}?</h4>
                  <div className="advantages-grid">
                    <div className="advantage-card">
                      <span className="advantage-icon">🔋</span>
                      <h5>Hybrid Technology</h5>
                      <p>Advanced {product.specs.battery?.type} battery with {product.warranty?.hybrid} warranty</p>
                    </div>
                    <div className="advantage-card">
                      <span className="advantage-icon">⛽</span>
                      <h5>Fuel Efficiency</h5>
                      <p>{product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} {product.specs.efficiency?.combinedMPGe ? 'MPGe' : 'MPG'} combined rating</p>
                    </div>
                    <div className="advantage-card">
                      <span className="advantage-icon">🏆</span>
                      <h5>Luxury Features</h5>
                      <p>{product.specs.luxury?.interiorMaterial} interior with {product.specs.luxury?.ambientLighting}</p>
                    </div>
                    <div className="advantage-card">
                      <span className="advantage-icon">🛡️</span>
                      <h5>Safety Rating</h5>
                      <p>{product.specs.safety?.crashTest} crash test rating with comprehensive safety suite</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="competitors-comparison">
                <h4>vs Key Competitors</h4>
                <div className="competitors-detailed">
                  {product.competitors?.map((competitor, idx) => (
                    <div key={idx} className="competitor-analysis">
                      <div className="competitor-header">
                        <h5>{competitor}</h5>
                        <div className="vs-indicator">vs</div>
                        <h5>{product.name}</h5>
                      </div>
                      
                      <div className="comparison-points">
                        <div className="comparison-row">
                          <div className="comparison-aspect">
                            <h6>Hybrid Warranty</h6>
                            <div className="comparison-values">
                              <span className="competitor-value">8 years / 80,000 miles*</span>
                              <span className="our-value winner">{product.warranty?.hybrid}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="comparison-row">
                          <div className="comparison-aspect">
                            <h6>Fuel Economy</h6>
                            <div className="comparison-values">
                              <span className="competitor-value">
                                {idx === 0 ? '28 MPG*' : 
                                 idx === 1 ? '31 MPG*' : 
                                 idx === 2 ? '29 MPG*' : 
                                 '30 MPG*'}
                              </span>
                              <span className="our-value winner">
                                {product.specs?.efficiency?.combinedMPG ? 
                                  `${product.specs.efficiency.combinedMPG} MPG` : 
                                  product.specs?.efficiency?.combinedMPGe ? 
                                  `${product.specs.efficiency.combinedMPGe} MPGe` : 
                                  'N/A'
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="comparison-row">
                          <div className="comparison-aspect">
                            <h6>Standard Features</h6>
                            <div className="comparison-values">
                              <span className="competitor-value">Limited luxury features*</span>
                              <span className="our-value winner">Comprehensive luxury package</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="comparison-row">
                          <div className="comparison-aspect">
                            <h6>Price Value</h6>
                            <div className="comparison-values">
                              <span className="competitor-value">
                                {formatPrice(product.price + (50000 + (idx * 25000)))}*
                              </span>
                              <span className="our-value winner">{formatPrice(product.price)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="sales-talking-points">
                        <h6>Key Sales Points vs {competitor}</h6>
                        <ul>
                          <li>Superior hybrid battery warranty coverage</li>
                          <li>Better fuel efficiency for daily driving</li>
                          <li>More standard luxury features included</li>
                          <li>Better value proposition for premium features</li>
                          <li>Advanced hybrid technology integration</li>
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="objection-handling">
                <h4>Common Objections & Responses</h4>
                <div className="objection-cards">
                  <div className="objection-card">
                    <h5>Price Concern</h5>
                    <p><strong>Objection:</strong> "This is more expensive than [competitor]"</p>
                    <p><strong>Response:</strong> "When you factor in the extended {product.warranty?.hybrid || 'N/A'} hybrid warranty, superior fuel economy saving approximately ₹{(20000).toLocaleString('en-IN')} annually on fuel costs, and the comprehensive luxury features that would be expensive options on competitors, the {product.name} actually provides better value for your investment."</p>
                  </div>
                  
                  <div className="objection-card">
                    <h5>Brand Loyalty</h5>
                    <p><strong>Objection:</strong> "I've always driven [competitor brand]"</p>
                    <p><strong>Response:</strong> "I understand brand loyalty, and that speaks well of you as a customer. However, the hybrid technology in the {product.name} represents the latest advancement in luxury hybrid vehicles. We're confident that once you experience the {product.specs.luxury?.interiorMaterial} interior and {product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} {product.specs.efficiency?.combinedMPGe ? 'MPGe' : 'MPG'} efficiency, you'll see why this is the future of luxury driving."</p>
                  </div>
                  
                  <div className="objection-card">
                    <h5>Hybrid Reliability</h5>
                    <p><strong>Objection:</strong> "Are hybrids reliable long-term?"</p>
                    <p><strong>Response:</strong> "Excellent question! That's exactly why we offer a {product.warranty?.hybrid} hybrid component warranty - we're completely confident in the technology. Plus, hybrid systems actually reduce wear on the gasoline engine since the electric motor assists during acceleration and stop-and-go driving."</p>
                  </div>
                </div>
              </div>
              
              <div className="competitive-disclaimer">
                <p><small>*Competitor information is approximate and may vary by model year and trim. Always verify current competitive data before presenting to customers.</small></p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="detail-footer">
        <div className="sales-training-section">
          <h2>Sales Training Resources</h2>
          <div className="training-cards">
            <div className="training-card">
              <h3>Key Selling Points</h3>
              <ul>
                <li>Emphasize the {product.specs.performance?.horsepower} performance</li>
                <li>Highlight {product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} {product.category === 'Electric' ? 'MPGe' : 'MPG'} efficiency</li>
                <li>Focus on {product.warranty?.basic} warranty coverage</li>
                <li>Compare hybrid efficiency vs {product.competitors?.[0]}</li>
              </ul>
            </div>
            
            <div className="training-card">
              <h3>Target Customer Profile</h3>
              <p>Perfect for environmentally conscious customers seeking luxury with:</p>
              <ul>
                <li>Budget range: {formatPrice(product.price - 5000)} - {formatPrice(product.price + 10000)}</li>
                <li>Focus on {product.popularOptions?.[0]?.toLowerCase()}</li>
                <li>Interest in {product.features.standard?.[0]?.toLowerCase()}</li>
              </ul>
            </div>
            
            <div className="training-card">
              <h3>Common Objections & Responses</h3>
              <ul>
                <li><strong>Price:</strong> Highlight financing options and total value</li>
                <li><strong>Fuel Economy:</strong> Emphasize {product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} {product.category === 'Electric' ? 'MPGe' : 'MPG'} rating</li>
                <li><strong>Reliability:</strong> Focus on {product.warranty?.powertrain} powertrain warranty</li>
              </ul>
            </div>
          </div>
          
          <Link to={`/quiz?product=${product.id}`} className="take-quiz-btn">
            Test Your Knowledge - Take Product Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;