import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    categories: [],
    recentActivity: []
  });
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/products');
      const products = response.data;
      const categories = [...new Set(products.map(p => p.category))];
      
      setStats({
        totalProducts: products.length,
        categories: categories,
        recentActivity: [
          {
            title: 'Genesis G90 Hybrid Training',
            description: 'New hybrid model available for training',
            icon: '🚗',
            backgroundImage: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'New Model'
          },
          {
            title: 'Quiz Scores Updated',
            description: 'Luxury hybrid quiz average: 89%',
            icon: '📊',
            backgroundImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Performance'
          },
          {
            title: 'Lexus ES 300h Update',
            description: 'Incentives and features updated',
            icon: '💰',
            backgroundImage: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Incentives'
          },
          {
            title: 'Hybrid Technology Module',
            description: 'New training module: Benefits & Features',
            icon: '🎓',
            backgroundImage: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Training'
          },
          {
            title: 'BMW 530e xDrive Demo',
            description: 'Features demonstration added',
            icon: '🎥',
            backgroundImage: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Demo'
          }
        ]
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Set default data if API fails
      setStats({
        totalProducts: 15,
        categories: ['SUV', 'Sedan', 'Coupe'],
        recentActivity: [
          {
            title: 'Genesis G90 Hybrid Training',
            description: 'New hybrid model available for training',
            icon: '🚗',
            backgroundImage: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'New Model'
          },
          {
            title: 'Quiz Scores Updated',
            description: 'Luxury hybrid quiz average: 89%',
            icon: '📊',
            backgroundImage: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Performance'
          },
          {
            title: 'Lexus ES 300h Update',
            description: 'Incentives and features updated',
            icon: '💰',
            backgroundImage: 'https://images.pexels.com/photos/3593922/pexels-photo-3593922.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Incentives'
          },
          {
            title: 'Hybrid Technology Module',
            description: 'New training module: Benefits & Features',
            icon: '🎓',
            backgroundImage: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Training'
          },
          {
            title: 'BMW 530e xDrive Demo',
            description: 'Features demonstration added',
            icon: '🎥',
            backgroundImage: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=600',
            category: 'Demo'
          }
        ]
      });
    }
  };

  // Auto-scroll carousel
  useEffect(() => {
    if (!stats.recentActivity.length || isPaused) return;

    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => 
        (prev + 1) % stats.recentActivity.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [stats.recentActivity, isPaused]);

  const handlePrevActivity = () => {
    setCurrentActivityIndex((prev) => 
      prev === 0 ? stats.recentActivity.length - 1 : prev - 1
    );
  };

  const handleNextActivity = () => {
    setCurrentActivityIndex((prev) => 
      (prev + 1) % stats.recentActivity.length
    );
  };

  const goToActivity = (index) => {
    setCurrentActivityIndex(index);
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Luxury Hybrid Sales Training Portal</h2>
      
      <div className="stats-grid">
        <Link to="/models" className="stat-card">
          <h3>Models</h3>
          <p className="stat-number">{stats.totalProducts}</p>
        </Link>
        
        <Link to="/quiz" className="stat-card">
          <h3>Quiz</h3>
          <p className="stat-number">89%</p>
        </Link>
        
        <Link to="/training" className="stat-card">
          <h3>Training</h3>
          <p className="stat-number">5</p>
        </Link>
        
        <Link to="/catalog" className="stat-card">
          <h3>Catalogue</h3>
          <p className="stat-number">12</p>
        </Link>
        
        <Link to="/categories" className="stat-card">
          <h3>Categories</h3>
          <p className="stat-number">{stats.categories.length}</p>
        </Link>
        
        <Link to="/progress" className="stat-card">
          <h3>Progress</h3>
          <p className="stat-number">75%</p>
        </Link>
      </div>
      
      {/* Recent Activity Carousel */}
      <div className="activity-carousel-section" style={{ 
        marginLeft: '-8rem', 
        marginRight: '-8rem', 
        paddingLeft: '8rem', 
        paddingRight: '8rem',
        background: 'linear-gradient(135deg, rgba(240, 253, 250, 0.5) 0%, rgba(230, 255, 250, 0.5) 100%)'
      }}>
        <h3>Recent Activity</h3>
        
        {stats.recentActivity.length > 0 && (
          <>
            <div 
              className="activity-carousel-container"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div className="activity-carousel">
                <div 
                  className="activity-carousel-track"
                  style={{ transform: `translateX(-${currentActivityIndex * 100}%)` }}
                >
                  {stats.recentActivity.map((activity, index) => (
                    <div key={index} className="activity-carousel-item">
                      <div className="activity-card">
                        <div className="activity-image-container" style={{
                          backgroundImage: `url('${activity.backgroundImage}')`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}>
                          <div className="activity-overlay">
                            <span className="activity-category">{activity.category}</span>
                          </div>
                          <div className="activity-icon-badge">{activity.icon}</div>
                        </div>
                        
                        <div className="activity-content">
                          <h4 className="activity-title">{activity.title}</h4>
                          <p className="activity-description">{activity.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="carousel-indicators">
              {stats.recentActivity.map((_, index) => (
                <button
                  key={index}
                  className={`carousel-dot ${index === currentActivityIndex ? 'active' : ''}`}
                  onClick={() => goToActivity(index)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;