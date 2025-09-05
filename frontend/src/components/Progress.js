import React, { useState, useEffect, useRef } from 'react';
import './Progress.css';

function Progress() {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    // Simulate fetching progress data
    console.log('Progress component mounted');
    const timer = setTimeout(() => {
      console.log('Setting progress data');
      setProgressData({
        overall: 72,
        modules: [
          { name: 'Product Knowledge', completed: 85, icon: '📚' },
          { name: 'Sales Techniques', completed: 70, icon: '💼' },
          { name: 'Customer Service', completed: 90, icon: '🤝' },
          { name: 'Quiz Performance', completed: 65, icon: '📝' },
          { name: 'Training Videos', completed: 60, icon: '🎥' }
        ],
        achievements: [
          { name: 'Quick Learner', icon: '🏃', earned: true },
          { name: 'Product Expert', icon: '🎯', earned: true },
          { name: 'Sales Master', icon: '🏆', earned: false },
          { name: 'Perfect Score', icon: '💯', earned: false }
        ],
        recentActivity: [
          { 
            date: '2024-01-15', 
            activity: 'Completed SUV Training Module', 
            score: 92,
            icon: '🚙',
            image: 'https://via.placeholder.com/400x250/0891B2/ffffff?text=SUV+Training',
            category: 'Training',
            duration: '45 mins'
          },
          { 
            date: '2024-01-14', 
            activity: 'Passed Electric Vehicle Quiz', 
            score: 88,
            icon: '⚡',
            image: 'https://via.placeholder.com/400x250/10B981/ffffff?text=Electric+Quiz',
            category: 'Quiz',
            duration: '20 mins'
          },
          { 
            date: '2024-01-13', 
            activity: 'Watched Hybrid Technology Video', 
            score: null,
            icon: '🎬',
            image: 'https://via.placeholder.com/400x250/0D9488/ffffff?text=Hybrid+Video',
            category: 'Video',
            duration: '30 mins'
          },
          { 
            date: '2024-01-12', 
            activity: 'Completed Customer Handling Course', 
            score: 95,
            icon: '🤝',
            image: 'https://via.placeholder.com/400x250/0A4F4F/ffffff?text=Customer+Course',
            category: 'Course',
            duration: '1 hour'
          },
          {
            date: '2024-01-11',
            activity: 'Luxury Features Certification',
            score: 91,
            icon: '💎',
            image: 'https://via.placeholder.com/400x250/06B6D4/ffffff?text=Luxury+Certification',
            category: 'Certification',
            duration: '2 hours'
          },
          {
            date: '2024-01-10',
            activity: 'Sales Pitch Practice',
            score: 85,
            icon: '🎤',
            image: 'https://via.placeholder.com/400x250/22D3EE/ffffff?text=Sales+Practice',
            category: 'Practice',
            duration: '35 mins'
          }
        ]
      });
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll carousel
  useEffect(() => {
    if (!progressData || isPaused) return;

    const interval = setInterval(() => {
      setCurrentActivityIndex((prev) => 
        (prev + 1) % progressData.recentActivity.length
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [progressData, isPaused]);

  const handlePrevActivity = () => {
    setCurrentActivityIndex((prev) => 
      prev === 0 ? progressData.recentActivity.length - 1 : prev - 1
    );
  };

  const handleNextActivity = () => {
    setCurrentActivityIndex((prev) => 
      (prev + 1) % progressData.recentActivity.length
    );
  };

  const goToActivity = (index) => {
    setCurrentActivityIndex(index);
  };

  if (loading) {
    return (
      <div className="progress-container">
        <div className="loading">
          <div className="loading-spinner"></div>
          <span>Loading progress data...</span>
        </div>
      </div>
    );
  }

  // Calculate circumference for circular progress
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (circumference * progressData.overall) / 100;

  return (
    <div className="progress-container">
      <div className="progress-header">
        <h1>Your Learning Progress</h1>
        <p>Track your training journey and achievements</p>
      </div>

      {/* Overall Progress Card */}
      <div className="overall-progress-card">
        <h2>Overall Progress</h2>
        <div className="progress-circle">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#0891B2' }} />
                <stop offset="100%" style={{ stopColor: '#10B981' }} />
              </linearGradient>
            </defs>
            {/* Background circle */}
            <circle 
              cx="100" 
              cy="100" 
              r={radius}
              fill="none" 
              stroke="#E5E7EB" 
              strokeWidth="12"
            />
            {/* Progress circle */}
            <circle 
              cx="100" 
              cy="100" 
              r={radius}
              fill="none" 
              stroke="url(#progressGradient)" 
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '100px 100px',
                transition: 'stroke-dashoffset 1s ease'
              }}
            />
          </svg>
          <div className="progress-percentage">{progressData.overall}%</div>
        </div>
      </div>

      {/* Module Progress */}
      <div className="modules-section">
        <h2>Module Progress</h2>
        <div className="modules-list">
          {progressData.modules.map((module, index) => (
            <div key={index} className="module-card">
              <div className="module-header">
                <span className="module-icon">{module.icon}</span>
                <span className="module-name">{module.name}</span>
                <span className="module-percentage">{module.completed}%</span>
              </div>
              <div className="module-progress-bar">
                <div 
                  className="module-progress-fill"
                  style={{ width: `${module.completed}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="achievements-section">
        <h2>Achievements</h2>
        <div className="achievements-grid">
          {progressData.achievements.map((achievement, index) => (
            <div 
              key={index} 
              className={`achievement-badge ${achievement.earned ? 'earned' : 'locked'}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-name">{achievement.name}</div>
              {!achievement.earned && <div className="locked-overlay">🔒</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity Carousel */}
      <div className="activity-carousel-section">
        <h2>Recent Activity</h2>
        
        <div 
          className="activity-carousel-container"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <button className="carousel-nav carousel-nav-prev" onClick={handlePrevActivity}>
            ❮
          </button>
          
          <div className="activity-carousel" ref={carouselRef}>
            <div 
              className="activity-carousel-track"
              style={{ transform: `translateX(-${currentActivityIndex * 100}%)` }}
            >
              {progressData.recentActivity.map((activity, index) => (
                <div key={index} className="activity-carousel-item">
                  <div className="activity-card">
                    <div className="activity-image-container">
                      <img 
                        src={activity.image} 
                        alt={activity.activity}
                        className="activity-image"
                      />
                      <div className="activity-overlay">
                        <span className="activity-category">{activity.category}</span>
                        <span className="activity-duration">{activity.duration}</span>
                      </div>
                      <div className="activity-icon-badge">{activity.icon}</div>
                    </div>
                    
                    <div className="activity-content">
                      <h3 className="activity-title">{activity.activity}</h3>
                      <div className="activity-meta">
                        <span className="activity-date">📅 {activity.date}</span>
                        {activity.score && (
                          <span className="activity-score-badge">
                            <span className="score-icon">⭐</span>
                            {activity.score}%
                          </span>
                        )}
                      </div>
                      
                      {activity.score && (
                        <div className="activity-progress">
                          <div className="activity-progress-bar">
                            <div 
                              className="activity-progress-fill"
                              style={{ width: `${activity.score}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button className="carousel-nav carousel-nav-next" onClick={handleNextActivity}>
            ❯
          </button>
        </div>
        
        {/* Carousel Indicators */}
        <div className="carousel-indicators">
          {progressData.recentActivity.map((_, index) => (
            <button
              key={index}
              className={`carousel-dot ${index === currentActivityIndex ? 'active' : ''}`}
              onClick={() => goToActivity(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Progress;