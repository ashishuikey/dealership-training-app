import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import ProductCatalog from './components/ProductCatalog';
import ProductDetail from './components/ProductDetail';
import Quiz from './components/Quiz';
import SalesTrainingCenter from './components/SalesTrainingCenter';
import ChatBot from './components/ChatBot';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Categories from './components/Categories';
import Progress from './components/Progress';
import ProgressTest from './components/ProgressTest';
import './App.css';

function AppContent({ user, onLogout }) {
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  return (
    <div className="App">
      {!isAdminPage && <Navigation user={user} onLogout={onLogout} />}
      <div className={`content ${isAdminPage ? 'admin-content' : ''}`}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/models" element={<ProductList />} />
          <Route path="/models/:id" element={<ProductDetail />} />
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/training" element={<SalesTrainingCenter />} />
          <Route path="/catalog" element={<ProductCatalog />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin" userRole={user.role}>
                <AdminDashboard user={user} onLogout={onLogout} />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <ChatBot />
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('userData');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('userData');
      }
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#718096'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <AppContent user={user} onLogout={handleLogout} />
    </Router>
  );
}

export default App;