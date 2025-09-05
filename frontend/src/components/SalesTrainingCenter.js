import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './SalesTrainingCenter.css';

function SalesTrainingCenter() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [trainingModules, setTrainingModules] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/products');
      setProducts(response.data);
      if (response.data.length > 0) {
        setSelectedProduct(response.data[0]);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const trainingModulesData = [
    {
      id: 'product_knowledge',
      title: 'Product Knowledge Mastery',
      description: 'Comprehensive training on each vehicle model, specifications, and features',
      modules: [
        { name: 'Hybrid Technology Deep Dive', duration: '45 mins', difficulty: 'Intermediate' },
        { name: 'Luxury Features & Benefits', duration: '30 mins', difficulty: 'Easy' },
        { name: 'Performance & Efficiency', duration: '35 mins', difficulty: 'Intermediate' },
        { name: 'Safety Systems Overview', duration: '40 mins', difficulty: 'Easy' }
      ]
    },
    {
      id: 'sales_techniques',
      title: 'Advanced Sales Techniques',
      description: 'Master the art of selling luxury hybrid vehicles',
      modules: [
        { name: 'Consultative Selling Approach', duration: '50 mins', difficulty: 'Advanced' },
        { name: 'Value Proposition Presentation', duration: '40 mins', difficulty: 'Intermediate' },
        { name: 'Closing Techniques for Luxury Sales', duration: '45 mins', difficulty: 'Advanced' },
        { name: 'Building Long-term Relationships', duration: '35 mins', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'objection_handling',
      title: 'Objection Handling Mastery',
      description: 'Turn customer concerns into opportunities',
      modules: [
        { name: 'Price Objection Strategies', duration: '40 mins', difficulty: 'Advanced' },
        { name: 'Technology Concerns Resolution', duration: '35 mins', difficulty: 'Intermediate' },
        { name: 'Brand Comparison Techniques', duration: '45 mins', difficulty: 'Advanced' },
        { name: 'Hybrid Skepticism Handling', duration: '30 mins', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'customer_profiling',
      title: 'Customer Profiling & Needs Assessment',
      description: 'Identify and match customers with the perfect vehicle',
      modules: [
        { name: 'Luxury Buyer Psychology', duration: '40 mins', difficulty: 'Advanced' },
        { name: 'Environmental Consciousness Indicators', duration: '25 mins', difficulty: 'Easy' },
        { name: 'Family vs Individual Buyer Needs', duration: '35 mins', difficulty: 'Intermediate' },
        { name: 'First-time Hybrid Buyer Guidance', duration: '30 mins', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'competitive_analysis',
      title: 'Competitive Intelligence',
      description: 'Know your competition and win more sales',
      modules: [
        { name: 'German Luxury Brand Comparison', duration: '55 mins', difficulty: 'Advanced' },
        { name: 'Non-Hybrid Luxury Positioning', duration: '40 mins', difficulty: 'Intermediate' },
        { name: 'Tesla & Electric Vehicle Handling', duration: '45 mins', difficulty: 'Advanced' },
        { name: 'Value Proposition Differentiation', duration: '35 mins', difficulty: 'Intermediate' }
      ]
    },
    {
      id: 'financing_insurance',
      title: 'Financing & F&I Excellence',
      description: 'Master the financial aspect of luxury vehicle sales',
      modules: [
        { name: 'Hybrid Incentives & Tax Credits', duration: '35 mins', difficulty: 'Intermediate' },
        { name: 'Lease vs Purchase Guidance', duration: '40 mins', difficulty: 'Intermediate' },
        { name: 'Extended Warranty Positioning', duration: '30 mins', difficulty: 'Easy' },
        { name: 'Insurance Considerations for Hybrids', duration: '25 mins', difficulty: 'Easy' }
      ]
    }
  ];

  const getKeySellingPoints = (product) => {
    if (!product) return [];
    
    const points = [
      `${product.specs.performance?.horsepower} total system power`,
      `${product.specs.efficiency?.combinedMPG || product.specs.efficiency?.combinedMPGe} ${product.specs.efficiency?.combinedMPGe ? 'MPGe' : 'MPG'} combined efficiency`,
      `${product.warranty?.hybrid} hybrid component warranty`,
      `${product.features.standard?.length || 0} standard luxury features`
    ];

    if (product.incentives) {
      points.push(`Up to ₹${(product.incentives.manufacturer || 0).toLocaleString('en-IN')} in manufacturer incentives`);
    }

    return points;
  };

  const getTargetCustomerProfile = (product) => {
    if (!product) return {};
    
    return {
      demographics: [
        'Age 35-55, established professionals',
        'Household income ₹25L+ annually',
        'College-educated with family responsibilities',
        'Environmentally conscious luxury buyers'
      ],
      psychographics: [
        'Values both performance and efficiency',
        'Appreciates advanced technology',
        'Seeks social status with responsibility',
        'Willing to pay premium for quality'
      ],
      behaviorPatterns: [
        'Researches thoroughly before purchasing',
        'Influenced by peer recommendations',
        'Values long-term ownership experience',
        'Prefers consultative sales approach'
      ]
    };
  };

  const getCompetitiveAdvantages = (product) => {
    if (!product) return [];
    
    return [
      {
        advantage: 'Superior Hybrid Technology',
        description: `Advanced ${product.specs.battery?.type} battery system with proven reliability`,
        competitor: 'vs Traditional Luxury Sedans',
        benefit: 'Better fuel economy and lower emissions'
      },
      {
        advantage: 'Comprehensive Warranty Coverage',
        description: `${product.warranty?.hybrid} hybrid warranty vs industry standard`,
        competitor: 'vs German Luxury Brands',
        benefit: 'Better long-term value and peace of mind'
      },
      {
        advantage: 'Standard Luxury Features',
        description: 'Features that are expensive options on competitors',
        competitor: 'vs BMW/Mercedes/Audi',
        benefit: 'Better value proposition'
      },
      {
        advantage: 'Proven Reliability',
        description: '20+ years of hybrid development and refinement',
        competitor: 'vs Newer Hybrid Systems',
        benefit: 'Lower maintenance costs and higher resale value'
      }
    ];
  };

  if (loading) {
    return <div className="loading">Loading Sales Training Center...</div>;
  }

  return (
    <div className="sales-training-center">
      <div className="training-header">
        <h1>Sales Training Center</h1>
        <p>Master the art of selling luxury hybrid vehicles with comprehensive training resources</p>
      </div>

      <div className="training-navigation">
        <div className="nav-tabs">
          <button 
            className={activeTab === 'overview' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('overview')}
          >
            📊 Training Overview
          </button>
          <button 
            className={activeTab === 'modules' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('modules')}
          >
            🎓 Training Modules
          </button>
          <button 
            className={activeTab === 'products' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('products')}
          >
            🚗 Product Deep Dive
          </button>
          <button 
            className={activeTab === 'resources' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('resources')}
          >
            📚 Sales Resources
          </button>
        </div>
      </div>

      <div className="training-content">
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">🎯</div>
                <h3>Training Modules</h3>
                <div className="stat-number">{trainingModulesData.length}</div>
                <p>Comprehensive training categories</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🚗</div>
                <h3>Product Models</h3>
                <div className="stat-number">{products.length}</div>
                <p>Luxury hybrid vehicles to master</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">📝</div>
                <h3>Quiz Questions</h3>
                <div className="stat-number">80+</div>
                <p>Assessment questions available</p>
              </div>
              <div className="stat-card">
                <div className="stat-icon">🎪</div>
                <h3>Scenarios</h3>
                <div className="stat-number">50+</div>
                <p>Real-world sales situations</p>
              </div>
            </div>

            <div className="quick-start-guide">
              <h2>Quick Start Guide for New Sales Representatives</h2>
              <div className="guide-steps">
                <div className="step-card">
                  <div className="step-number">1</div>
                  <h3>Product Knowledge Foundation</h3>
                  <p>Complete hybrid technology overview and product specifications training</p>
                  <Link to="/quiz?product=0" className="step-action">Start General Training Quiz</Link>
                </div>
                <div className="step-card">
                  <div className="step-number">2</div>
                  <h3>Vehicle-Specific Training</h3>
                  <p>Deep dive into each model's unique selling points and features</p>
                  <Link to="#" className="step-action" onClick={() => setActiveTab('products')}>Explore Products</Link>
                </div>
                <div className="step-card">
                  <div className="step-number">3</div>
                  <h3>Sales Technique Mastery</h3>
                  <p>Learn proven techniques for luxury hybrid vehicle sales</p>
                  <Link to="#" className="step-action" onClick={() => setActiveTab('modules')}>View Modules</Link>
                </div>
                <div className="step-card">
                  <div className="step-number">4</div>
                  <h3>Objection Handling</h3>
                  <p>Practice common customer objections and winning responses</p>
                  <Link to="/quiz" className="step-action">Practice Scenarios</Link>
                </div>
              </div>
            </div>

            <div className="training-performance">
              <h2>Training Performance Dashboard</h2>
              <div className="performance-grid">
                <div className="performance-card">
                  <h3>Recent Activity</h3>
                  <ul className="activity-list">
                    <li>✅ Completed Lexus ES 300h product quiz (Score: 95%)</li>
                    <li>📖 Reviewed Genesis G90 Hybrid competitive analysis</li>
                    <li>🎯 Practiced objection handling scenarios</li>
                    <li>📝 Studied BMW 530e xDrive financing options</li>
                    <li>🏆 Achieved certification in hybrid technology basics</li>
                  </ul>
                </div>
                <div className="performance-card">
                  <h3>Recommended Next Steps</h3>
                  <ul className="recommendations">
                    <li>📚 Complete Volvo XC90 T8 product training</li>
                    <li>🎪 Practice luxury buyer psychology module</li>
                    <li>🔄 Review competitive analysis updates</li>
                    <li>📊 Take comprehensive assessment quiz</li>
                    <li>🎯 Focus on F&I product knowledge</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'modules' && (
          <div className="modules-section">
            <h2>Comprehensive Training Modules</h2>
            <p className="section-desc">Structured learning paths to develop expertise in luxury hybrid vehicle sales</p>
            
            <div className="modules-grid">
              {trainingModulesData.map(module => (
                <div key={module.id} className="module-card">
                  <div className="module-header">
                    <h3>{module.title}</h3>
                    <span className="module-count">{module.modules.length} sessions</span>
                  </div>
                  <p className="module-description">{module.description}</p>
                  
                  <div className="module-sessions">
                    {module.modules.map((session, idx) => (
                      <div key={idx} className="session-item">
                        <div className="session-info">
                          <span className="session-name">{session.name}</span>
                          <div className="session-meta">
                            <span className="duration">{session.duration}</span>
                            <span className={`difficulty ${session.difficulty.toLowerCase()}`}>
                              {session.difficulty}
                            </span>
                          </div>
                        </div>
                        <button className="start-session-btn">Start</button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="module-actions">
                    <button className="btn-primary">Start Module</button>
                    <button className="btn-outline">View Syllabus</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <div className="product-selector">
              <h2>Product-Specific Training</h2>
              <div className="product-tabs">
                {products.map(product => (
                  <button
                    key={product.id}
                    className={selectedProduct?.id === product.id ? 'product-tab active' : 'product-tab'}
                    onClick={() => setSelectedProduct(product)}
                  >
                    {product.name}
                  </button>
                ))}
              </div>
            </div>

            {selectedProduct && (
              <div className="product-training-content">
                <div className="product-training-header">
                  <div className="product-info">
                    <h3>{selectedProduct.name}</h3>
                    <p>{selectedProduct.description}</p>
                    <div className="product-badges">
                      <span className="badge">{selectedProduct.category}</span>
                      <span className="badge">{selectedProduct.year}</span>
                      <span className="badge-price">₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                  <div className="training-actions">
                    <Link 
                      to={`/quiz?product=${selectedProduct.id}`} 
                      className="btn-primary"
                    >
                      Take Product Quiz
                    </Link>
                    <Link 
                      to={`/products/${selectedProduct.id}`} 
                      className="btn-outline"
                    >
                      View Full Details
                    </Link>
                  </div>
                </div>

                <div className="product-training-grid">
                  <div className="training-card">
                    <h4>🎯 Key Selling Points</h4>
                    <ul className="selling-points">
                      {getKeySellingPoints(selectedProduct).map((point, idx) => (
                        <li key={idx}>{point}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="training-card">
                    <h4>👥 Target Customer Profile</h4>
                    <div className="customer-profile">
                      <div className="profile-section">
                        <h5>Demographics</h5>
                        <ul>
                          {getTargetCustomerProfile(selectedProduct).demographics?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="profile-section">
                        <h5>Psychographics</h5>
                        <ul>
                          {getTargetCustomerProfile(selectedProduct).psychographics?.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="training-card competitive-advantages">
                    <h4>🏆 Competitive Advantages</h4>
                    <div className="advantages-list">
                      {getCompetitiveAdvantages(selectedProduct).map((adv, idx) => (
                        <div key={idx} className="advantage-item">
                          <h5>{adv.advantage}</h5>
                          <p>{adv.description}</p>
                          <div className="advantage-comparison">
                            <span className="competitor">{adv.competitor}</span>
                            <span className="benefit">{adv.benefit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="training-card">
                    <h4>💰 Pricing & Value Proposition</h4>
                    <div className="pricing-info">
                      <div className="price-breakdown">
                        <div className="price-item">
                          <span>MSRP</span>
                          <span>₹{selectedProduct.msrp.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="price-item primary">
                          <span>Our Price</span>
                          <span>₹{selectedProduct.price.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="price-item savings">
                          <span>Customer Savings</span>
                          <span>₹{(selectedProduct.msrp - selectedProduct.price).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      
                      {selectedProduct.incentives && (
                        <div className="incentives-summary">
                          <h5>Available Incentives</h5>
                          <ul>
                            {selectedProduct.incentives.manufacturer && (
                              <li>Manufacturer: ₹{selectedProduct.incentives.manufacturer.toLocaleString('en-IN')}</li>
                            )}
                            {selectedProduct.incentives.loyalty && (
                              <li>Loyalty: ₹{selectedProduct.incentives.loyalty.toLocaleString('en-IN')}</li>
                            )}
                            {selectedProduct.incentives.hybrid && (
                              <li>Hybrid: ₹{selectedProduct.incentives.hybrid.toLocaleString('en-IN')}</li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="quick-training-actions">
                  <Link to={`/quiz?product=${selectedProduct.id}&tab=qanda`} className="quick-action">
                    🤔 Q&A Training
                  </Link>
                  <Link to={`/quiz?product=${selectedProduct.id}&tab=objections`} className="quick-action">
                    🛡️ Objection Handling
                  </Link>
                  <Link to={`/products/${selectedProduct.id}?tab=competitive`} className="quick-action">
                    ⚖️ Competitive Analysis
                  </Link>
                  <Link to={`/products/${selectedProduct.id}?tab=finance`} className="quick-action">
                    💳 Financing Calculator
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'resources' && (
          <div className="resources-section">
            <h2>Sales Resources & Tools</h2>
            <p className="section-desc">Essential tools and resources for successful luxury hybrid sales</p>

            <div className="resources-grid">
              <div className="resource-category">
                <h3>📊 Sales Tools</h3>
                <div className="resource-items">
                  <div className="resource-item">
                    <h4>ROI Calculator</h4>
                    <p>Calculate fuel savings and total cost of ownership for customers</p>
                    <button className="resource-btn">Launch Tool</button>
                  </div>
                  <div className="resource-item">
                    <h4>Comparison Matrix</h4>
                    <p>Side-by-side feature comparisons with competitors</p>
                    <button className="resource-btn">View Matrix</button>
                  </div>
                  <div className="resource-item">
                    <h4>Incentives Calculator</h4>
                    <p>Real-time incentive and rebate calculations</p>
                    <button className="resource-btn">Calculate Now</button>
                  </div>
                </div>
              </div>

              <div className="resource-category">
                <h3>📚 Sales Playbooks</h3>
                <div className="resource-items">
                  <div className="resource-item">
                    <h4>First-Time Hybrid Buyer Guide</h4>
                    <p>Step-by-step approach for hybrid skeptics</p>
                    <button className="resource-btn">Download PDF</button>
                  </div>
                  <div className="resource-item">
                    <h4>Luxury Upgrade Path</h4>
                    <p>Transitioning customers from standard to luxury</p>
                    <button className="resource-btn">View Guide</button>
                  </div>
                  <div className="resource-item">
                    <h4>Corporate Fleet Sales</h4>
                    <p>B2B sales strategies for fleet customers</p>
                    <button className="resource-btn">Access Playbook</button>
                  </div>
                </div>
              </div>

              <div className="resource-category">
                <h3>🎯 Assessment Tools</h3>
                <div className="resource-items">
                  <div className="resource-item">
                    <h4>Customer Needs Assessment</h4>
                    <p>Questionnaire to identify perfect vehicle match</p>
                    <Link to="/quiz" className="resource-btn">Take Assessment</Link>
                  </div>
                  <div className="resource-item">
                    <h4>Product Knowledge Test</h4>
                    <p>Comprehensive test covering all models</p>
                    <Link to="/quiz?product=0" className="resource-btn">Start Test</Link>
                  </div>
                  <div className="resource-item">
                    <h4>Sales Skills Evaluation</h4>
                    <p>Role-playing scenarios and skill assessment</p>
                    <button className="resource-btn">Begin Evaluation</button>
                  </div>
                </div>
              </div>

              <div className="resource-category">
                <h3>📱 Digital Resources</h3>
                <div className="resource-items">
                  <div className="resource-item">
                    <h4>Mobile Sales App</h4>
                    <p>On-the-go access to product info and calculators</p>
                    <button className="resource-btn">Download App</button>
                  </div>
                  <div className="resource-item">
                    <h4>Video Training Library</h4>
                    <p>Product demos and sales technique videos</p>
                    <button className="resource-btn">Watch Videos</button>
                  </div>
                  <div className="resource-item">
                    <h4>Customer Portal Demo</h4>
                    <p>Show customers our online ownership tools</p>
                    <button className="resource-btn">Demo Portal</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="certification-track">
              <h3>🏆 Certification Track</h3>
              <div className="certification-levels">
                <div className="cert-level">
                  <div className="cert-badge bronze">🥉</div>
                  <h4>Bronze Certified</h4>
                  <p>Basic hybrid knowledge and product familiarity</p>
                  <ul>
                    <li>Complete all product quizzes (80%+ score)</li>
                    <li>Finish hybrid technology module</li>
                    <li>Pass general sales knowledge test</li>
                  </ul>
                  <button className="cert-btn">Start Bronze Path</button>
                </div>
                <div className="cert-level">
                  <div className="cert-badge silver">🥈</div>
                  <h4>Silver Certified</h4>
                  <p>Advanced sales techniques and competitive knowledge</p>
                  <ul>
                    <li>Complete all training modules</li>
                    <li>Pass advanced sales scenarios</li>
                    <li>Demonstrate objection handling skills</li>
                  </ul>
                  <button className="cert-btn">Continue to Silver</button>
                </div>
                <div className="cert-level">
                  <div className="cert-badge gold">🥇</div>
                  <h4>Gold Master</h4>
                  <p>Expert-level knowledge and mentoring capability</p>
                  <ul>
                    <li>Achieve consistent high performance</li>
                    <li>Complete specialized certifications</li>
                    <li>Mentor new sales representatives</li>
                  </ul>
                  <button className="cert-btn">Reach Gold Level</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SalesTrainingCenter;