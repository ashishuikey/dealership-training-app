import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import { getEmptyVehicleTemplate, commonVehicleTemplates, formatPrice } from './VehicleDataHelper';
import TrainingChatBot from './TrainingChatBot';

function AdminDashboard({ user, onLogout }) {
  // Set default tab based on user role - admins go to admin page, others to training
  const [activeTab, setActiveTab] = useState(user?.role === 'admin' ? 'admin' : 'training');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    salesUsers: 0
  });

  // File upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [extractedData, setExtractedData] = useState([]);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [processedFiles, setProcessedFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  // URL input state
  const [url, setUrl] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [processingUrl, setProcessingUrl] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Inventory state
  const [inventory, setInventory] = useState([]);
  const [editingVehicle, setEditingVehicle] = useState(null);
  
  // Dropdown menu state
  const [openDropdown, setOpenDropdown] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  
  // Competitive analysis state
  const [competitors, setCompetitors] = useState([
    {
      id: 1,
      name: 'Toyota Camry Hybrid',
      brand: 'Toyota',
      category: 'Sedan',
      price: 3200000,
      marketShare: 15.2,
      features: ['Hybrid Engine', 'Safety Sense 2.0', 'Wireless Charging'],
      strengths: ['Reliability', 'Fuel Efficiency', 'Brand Trust'],
      weaknesses: ['Conservative Design', 'Interior Space']
    },
    {
      id: 2,
      name: 'Honda Accord Hybrid',
      brand: 'Honda',
      category: 'Sedan',
      price: 3100000,
      marketShare: 12.8,
      features: ['Honda Sensing', 'Spacious Interior', 'Advanced Safety'],
      strengths: ['Interior Quality', 'Performance', 'Technology'],
      weaknesses: ['Higher Price', 'Limited Availability']
    },
    {
      id: 3,
      name: 'Hyundai Elantra',
      brand: 'Hyundai',
      category: 'Sedan',
      price: 2800000,
      marketShare: 8.5,
      features: ['Touchscreen Display', 'Wireless CarPlay', 'Smart Key'],
      strengths: ['Value for Money', 'Warranty', 'Design'],
      weaknesses: ['Build Quality', 'Resale Value']
    }
  ]);
  const [selectedCompetitor, setSelectedCompetitor] = useState(null);
  const [comparisonData, setComparisonData] = useState(null);

  // Training state
  const [currentTrainingScenario, setCurrentTrainingScenario] = useState(null);

  // Admin section state
  const [activeAdminSection, setActiveAdminSection] = useState('dashboard');
  
  // Training section state
  const [activeTrainingSection, setActiveTrainingSection] = useState('dashboard');
  
  // System Settings state
  const [systemSettings, setSystemSettings] = useState(() => {
    const saved = localStorage.getItem('systemSettings');
    return saved ? JSON.parse(saved) : {
      companyName: 'Premium Auto Dealership',
      contactEmail: 'info@premiumauto.com',
      contactPhone: '+1 (555) 123-4567',
      businessHours: '9:00 AM - 7:00 PM',
      weekendHours: '10:00 AM - 5:00 PM',
      apiRateLimit: '1000',
      sessionTimeout: '30',
      maxUploadSize: '10',
      enableNotifications: true,
      enableAnalytics: true,
      maintenanceMode: false
    };
  });
  
  const handleSaveSettings = () => {
    localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    alert('✅ Settings saved successfully!');
  };
  
  const handleResetSettings = () => {
    const defaults = {
      companyName: 'Premium Auto Dealership',
      contactEmail: 'info@premiumauto.com',
      contactPhone: '+1 (555) 123-4567',
      businessHours: '9:00 AM - 7:00 PM',
      weekendHours: '10:00 AM - 5:00 PM',
      apiRateLimit: '1000',
      sessionTimeout: '30',
      maxUploadSize: '10',
      enableNotifications: true,
      enableAnalytics: true,
      maintenanceMode: false
    };
    setSystemSettings(defaults);
    localStorage.setItem('systemSettings', JSON.stringify(defaults));
    alert('🔄 Settings reset to defaults!');
  };

  useEffect(() => {
    fetchUsers();
    fetchInventory();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setOpenDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      const response = await axios.get(`/api/auth/users?token=${token}`);
      
      if (response.data.success) {
        const userList = response.data.users;
        setUsers(userList);
        
        // Calculate stats
        setStats({
          totalUsers: userList.length,
          activeUsers: userList.filter(u => u.active).length,
          adminUsers: userList.filter(u => u.role === 'admin').length,
          salesUsers: userList.filter(u => u.role === 'sales').length
        });
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await axios.get('/api/products');
      setInventory(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  // File upload handlers
  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files.filter(file => {
      const validTypes = [
        // Images
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
        // Documents
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/msword',
        'application/pdf',
        // Text
        'text/plain', 'text/csv',
        // Audio
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/m4a',
        'audio/x-m4a', 'audio/x-wav', 'audio/webm',
        // Video
        'video/mp4', 'video/mpeg', 'video/quicktime', 'video/x-ms-wmv', 'video/avi',
        'video/x-msvideo', 'video/webm', 'video/ogg', 'video/3gpp', 'video/3gpp2'
      ];
      const maxSize = 100 * 1024 * 1024; // 100MB for video files
      
      // Also check by file extension if MIME type is not recognized
      const fileExt = file.name.toLowerCase();
      const allowedExtensions = /\.(txt|csv|pdf|doc|docx|xls|xlsx|jpg|jpeg|png|webp|mp3|wav|ogg|m4a|mp4|avi|mov|wmv|webm|mkv)$/;
      
      if (!validTypes.includes(file.type) && !allowedExtensions.test(fileExt)) {
        setUploadError(`File ${file.name} has unsupported format`);
        return false;
      }
      
      if (file.size > maxSize) {
        setUploadError(`File ${file.name} exceeds 100MB size limit`);
        return false;
      }
      
      return true;
    });

    setSelectedFiles(prev => [...prev, ...validFiles]);
    setUploadError('');
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearFiles = () => {
    setSelectedFiles([]);
    setExtractedData([]);
    setUploadError('');
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    if (fileType === 'application/pdf') return '📄';
    return '📁';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFiles = async () => {
    if (selectedFiles.length === 0) {
      setUploadError('Please select files to upload');
      return;
    }
    
    setProcessing(true);
    setProcessingStatus('Preparing files for upload...');
    setUploadError('');
    
    try {
      const formData = new FormData();
      selectedFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });
      
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      formData.append('token', token);
      
      setProcessingStatus('Uploading files to server...');
      
      console.log('Uploading files:', selectedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })));
      
      const response = await axios.post('/api/admin/process-vehicle-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setProcessingStatus(`Uploading... ${percentCompleted}%`);
          }
        }
      });
      
      console.log('File upload response:', response.data);
      
      if (response.data.success) {
        setExtractedData(response.data.extractedData || []);
        setProcessingStatus('Processing complete!');
        
        // Show any processing errors
        if (response.data.errors && response.data.errors.length > 0) {
          console.warn('Some files had errors:', response.data.errors);
        }
        
        // Clear processing status after 2 seconds
        setTimeout(() => {
          setProcessing(false);
          setProcessingStatus('');
          setSelectedFiles([]); // Clear selected files after successful upload
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to process files');
      }
    } catch (error) {
      console.error('File processing error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to process files. ';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.response.status === 413) {
          errorMessage = 'Files are too large. Maximum size is 10MB per file.';
        } else if (error.response.status === 415) {
          errorMessage = 'Unsupported file type. Please upload images, Excel, Word, or PDF files.';
        } else {
          errorMessage += error.response.data?.message || 'Please try again.';
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if the server is running.';
      } else {
        errorMessage += error.message;
      }
      
      setUploadError(errorMessage);
      setProcessing(false);
      setProcessingStatus('');
    }
  };

  // Process URL function
  const processUrl = async () => {
    const trimmedUrl = urlInput.trim();
    
    if (!trimmedUrl) {
      setUploadError('Please enter a URL');
      return;
    }
    
    // Basic URL validation
    try {
      new URL(trimmedUrl);
    } catch (e) {
      setUploadError('Please enter a valid URL (e.g., https://example.com)');
      return;
    }
    
    setProcessingUrl(true);
    setProcessingStatus('Fetching and analyzing webpage...');
    setUploadError('');
    
    try {
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      if (!token) {
        throw new Error('Authentication required. Please log in again.');
      }
      
      console.log('Processing URL:', trimmedUrl);
      
      const response = await axios.post('/api/admin/process-url', 
        { 
          url: trimmedUrl,
          token: token
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('URL processing response:', response.data);
      
      if (response.data.success) {
        // Add the extracted data to the list
        setExtractedData(prev => [...prev, response.data.data]);
        setProcessingStatus('URL processed successfully!');
        setUrlInput(''); // Clear the URL input
        
        // Clear processing status after 2 seconds
        setTimeout(() => {
          setProcessingUrl(false);
          setProcessingStatus('');
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Failed to process URL');
      }
    } catch (error) {
      console.error('URL processing error:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      let errorMessage = 'Failed to process URL. ';
      
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (error.response.status === 404) {
          errorMessage = 'Website not found. Please check the URL.';
        } else if (error.response.status === 408) {
          errorMessage = 'Request timed out. The website took too long to respond.';
        } else if (error.response.status === 403) {
          errorMessage = 'Access denied. The website may be blocking automated requests.';
        } else {
          errorMessage += error.response.data?.message || 'Please check the URL and try again.';
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check if the server is running.';
      } else {
        errorMessage += error.message;
      }
      
      setUploadError(errorMessage);
      setProcessingUrl(false);
      setProcessingStatus('');
    }
  };

  // Update extracted data field
  const updateExtractedField = (dataIndex, field, value) => {
    setExtractedData(prev => {
      const updated = [...prev];
      updated[dataIndex] = {
        ...updated[dataIndex],
        [field]: value
      };
      return updated;
    });
  };

  // Save vehicle to inventory
  const saveVehicleToInventory = async (vehicleData, dataIndex) => {
    try {
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      
      // Format the data for the products API
      const productData = {
        name: vehicleData.name || 'New Vehicle',
        category: vehicleData.category || 'Sedan',
        price: vehicleData.price || '0',
        originalPrice: vehicleData.msrp || vehicleData.price || '0',
        dealerCost: vehicleData.dealerCost || '0',
        specs: {
          engine: vehicleData.engine || 'NA',
          horsepower: vehicleData.horsepower || 'NA',
          torque: vehicleData.torque || 'NA',
          transmission: vehicleData.transmission || 'NA',
          drivetrain: vehicleData.drivetrain || 'NA',
          fuelType: vehicleData.fuelType || 'Gasoline',
          seatingCapacity: vehicleData.seatingCapacity || '5'
        },
        mileage: {
          city: vehicleData.cityMPG || 'NA',
          highway: vehicleData.highwayMPG || 'NA',
          combined: vehicleData.combinedMPG || 'NA'
        },
        features: vehicleData.features || [],
        description: vehicleData.description || '',
        image: `/images/products/${vehicleData.name?.toLowerCase().replace(/\s+/g, '-')}.jpg`
      };
      
      const response = await axios.post('/api/admin/save-vehicle', {
        vehicleData: productData,
        token: token
      });
      
      if (response.data.success) {
        // Remove from extracted data after saving
        setExtractedData(prev => prev.filter((_, index) => index !== dataIndex));
        // Refresh inventory
        fetchInventory();
        alert('Vehicle saved to inventory successfully!');
      }
    } catch (error) {
      console.error('Error saving vehicle:', error);
      alert('Failed to save vehicle: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete vehicle from extracted data
  const deleteExtractedData = (index) => {
    setExtractedData(prev => prev.filter((_, i) => i !== index));
  };

  // Dropdown menu functions
  const toggleDropdown = (vehicleId, event) => {
    event.stopPropagation();
    setOpenDropdown(openDropdown === vehicleId ? null : vehicleId);
  };

  const viewVehicleDetails = (vehicle) => {
    setViewingVehicle(vehicle);
    setOpenDropdown(null);
  };

  // Edit vehicle in inventory
  const editVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
  };

  // Save edited vehicle
  const saveEditedVehicle = async (vehicleData) => {
    try {
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      
      const response = await axios.put(`/api/admin/update-vehicle/${vehicleData.id}`, {
        vehicleData: vehicleData,
        token: token
      });
      
      if (response.data.success) {
        setEditingVehicle(null);
        fetchInventory(); // Refresh inventory
        alert('Vehicle updated successfully!');
      }
    } catch (error) {
      console.error('Error updating vehicle:', error);
      alert('Failed to update vehicle: ' + (error.response?.data?.message || error.message));
    }
  };

  // Delete vehicle from inventory
  const deleteVehicleFromInventory = async (vehicleId) => {
    if (!window.confirm('Are you sure you want to delete this vehicle from the inventory?')) {
      return;
    }
    
    try {
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      
      const response = await axios.delete(`/api/admin/delete-vehicle/${vehicleId}?token=${token}`);
      
      if (response.data.success) {
        fetchInventory(); // Refresh inventory
        alert('Vehicle deleted successfully!');
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      alert('Failed to delete vehicle: ' + (error.response?.data?.message || error.message));
    }
  };

  // Handle file processing
  const handleProcessFiles = async () => {
    if (selectedFiles.length === 0) return;
    
    setIsProcessing(true);
    setUploadError('');
    setUploadProgress({});
    
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      
      // Track upload progress
      const response = await axios.post('/api/admin/process-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(prev => ({
            ...prev,
            overall: percentCompleted
          }));
        }
      });
      
      if (response.data.extractedData) {
        setExtractedData(prev => [...prev, ...response.data.extractedData]);
        setUploadSuccess('Files processed successfully! ✅');
        setTimeout(() => setUploadSuccess(''), 3000);
        setProcessedFiles(selectedFiles);
        setSelectedFiles([]);
      }
    } catch (error) {
      setUploadError('Failed to process files: ' + error.message);
    } finally {
      setIsProcessing(false);
      setTimeout(() => setUploadProgress({}), 1000);
    }
  };

  // Handle URL processing
  const handleProcessUrl = async () => {
    if (!url) return;
    
    setIsProcessing(true);
    setUploadError('');
    
    try {
      const token = JSON.parse(localStorage.getItem('userData'))?.token;
      const response = await axios.post('/api/admin/process-url', {
        url: url,
        token: token
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data.success && response.data.data) {
        setExtractedData(prev => [...prev, response.data.data]);
        setUrl('');
      } else if (response.data.extractedData) {
        setExtractedData(prev => [...prev, response.data.extractedData]);
        setUrl('');
      }
    } catch (error) {
      setUploadError('Failed to process URL: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle file drop
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  // Handle file removal
  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle training scenario selection
  const handleTrainingScenario = (scenario) => {
    setCurrentTrainingScenario(scenario);
  };

  // Render active admin section content
  const renderActiveAdminSection = () => {
    switch(activeAdminSection) {
      case 'users':
        return (
          <div className="admin-subsection">
            <div className="subsection-header">
              <h3>👥 User Management</h3>
              <button className="back-btn" onClick={() => setActiveAdminSection('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            <div className="stats-grid compact">
              <div className="stat-card compact">
                <span className="stat-icon">👥</span>
                <span className="stat-number">{stats.totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">✅</span>
                <span className="stat-number">{stats.activeUsers}</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">🛡️</span>
                <span className="stat-number">{stats.adminUsers}</span>
                <span className="stat-label">Admins</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">💼</span>
                <span className="stat-number">{stats.salesUsers}</span>
                <span className="stat-label">Sales Staff</span>
              </div>
            </div>
            
            <div className="users-section">
              <h3>User Management</h3>
              <div className="user-actions">
                <button className="add-user-btn">➕ Add New User</button>
                <button className="export-users-btn">📤 Export Users</button>
              </div>
              
              <div className="users-table">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem, index) => (
                        <tr key={userItem.phoneNumber || index}>
                          <td>{userItem.name}</td>
                          <td>{userItem.phoneNumber}</td>
                          <td>
                            <span className={`role-badge ${userItem.role === 'admin' ? 'admin-role' : 'sales-role'}`}>
                              {userItem.role === 'admin' ? '🛡️ Admin' : '💼 Sales'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${userItem.active ? 'active-user' : 'inactive-user'}`}>
                              {userItem.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{userItem.lastActive ? new Date(userItem.lastActive).toLocaleDateString() : 'Never'}</td>
                          <td>
                            <div className="table-actions">
                              <div className="dropdown-container">
                                <button 
                                  className="table-dropdown-toggle"
                                  onClick={(e) => toggleDropdown(`user-${userItem.phoneNumber}`, e)}
                                >
                                  ⋮
                                </button>
                                {openDropdown === `user-${userItem.phoneNumber}` && (
                                  <div className="dropdown-menu">
                                    <button onClick={() => setOpenDropdown(null)}>
                                      👁️ View Profile
                                    </button>
                                    <button onClick={() => setOpenDropdown(null)}>
                                      ✏️ Edit User
                                    </button>
                                    <button onClick={() => setOpenDropdown(null)}>
                                      🔒 {userItem.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => setOpenDropdown(null)} className="delete-option">
                                      🗑️ Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#718096'}}>
                            {loading ? 'Loading users...' : 'No users found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );

      case 'inventory':
        return (
          <div className="admin-subsection">
            <div className="subsection-header">
              <h3>📦 Inventory Management</h3>
              <button className="back-btn" onClick={() => setActiveAdminSection('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            <div className="stats-grid compact">
              <div className="stat-card compact">
                <span className="stat-icon">🚗</span>
                <span className="stat-number">{inventory.length}</span>
                <span className="stat-label">Total Vehicles</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">✅</span>
                <span className="stat-number">{inventory.filter(v => v.inStock > 0).length}</span>
                <span className="stat-label">In Stock</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">⚠️</span>
                <span className="stat-number">{inventory.filter(v => (v.inStock || 0) <= 2).length}</span>
                <span className="stat-label">Low Stock</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">💰</span>
                <span className="stat-number total-value">{formatPrice(inventory.reduce((sum, v) => sum + (parseFloat(v.price) || 0), 0))}</span>
                <span className="stat-label">Total Value</span>
              </div>
            </div>
            
            <div className="inventory-table">
              <h3>Current Inventory</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Level</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((vehicle, index) => (
                      <tr key={vehicle.id || index}>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.category}</td>
                        <td>{formatPrice(vehicle.price)}</td>
                        <td>{vehicle.inStock || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${(vehicle.inStock || 0) > 5 ? 'in-stock' : (vehicle.inStock || 0) > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {(vehicle.inStock || 0) > 5 ? 'In Stock' : (vehicle.inStock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <div className="dropdown-container">
                              <button 
                                className="table-dropdown-toggle"
                                onClick={(e) => toggleDropdown(`inventory-${vehicle.id}`, e)}
                              >
                                ⋮
                              </button>
                              {openDropdown === `inventory-${vehicle.id}` && (
                                <div className="dropdown-menu">
                                  <button onClick={() => { viewVehicleDetails(vehicle); setOpenDropdown(null); }}>
                                    👁️ View Details
                                  </button>
                                  <button onClick={() => { editVehicle(vehicle); setOpenDropdown(null); }}>
                                    ✏️ Edit
                                  </button>
                                  <button onClick={() => { deleteVehicleFromInventory(vehicle.id); setOpenDropdown(null); }} className="delete-option">
                                    🗑️ Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case 'showroom':
        return (
          <div className="admin-subsection">
            <div className="subsection-header">
              <h3>🚗 Vehicle Showroom</h3>
              <button className="back-btn" onClick={() => setActiveAdminSection('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            <p>Manage your vehicle showroom display and catalog.</p>
            
            {inventory.length === 0 ? (
              <div className="empty-inventory">
                <p>📦 No vehicles in showroom</p>
                <p>Add vehicles to start building your showroom</p>
              </div>
            ) : (
              <div className="inventory-grid">
                {inventory.map((vehicle, index) => (
                  <div key={vehicle.id || index} className="inventory-card">
                    <div className="vehicle-info">
                      <h3>{vehicle.name}</h3>
                      <p className="vehicle-category">{vehicle.category}</p>
                      <p className="vehicle-price">{formatPrice(vehicle.price)}</p>
                      <div className="vehicle-specs">
                        {vehicle.fuelType && <span>{vehicle.fuelType}</span>}
                        {vehicle.transmission && <span>{vehicle.transmission}</span>}
                        {vehicle.engine && <span>{vehicle.engine}</span>}
                      </div>
                      <p className="vehicle-description">{vehicle.description}</p>
                    </div>
                    <div className="inventory-actions">
                      <button className="view-details-btn" onClick={() => viewVehicleDetails(vehicle)}>
                        View Details
                      </button>
                      <div className="dropdown-container">
                        <button className="table-dropdown-toggle" onClick={(e) => toggleDropdown(`showroom-${vehicle.id}`, e)}>
                          ⋮
                        </button>
                        {openDropdown === `showroom-${vehicle.id}` && (
                          <div className="dropdown-menu">
                            <button onClick={() => { editVehicle(vehicle); setOpenDropdown(null); }}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => { deleteVehicleFromInventory(vehicle.id); setOpenDropdown(null); }} className="delete-option">
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );

      case 'products':
        return (
          <div className="admin-subsection">
            <div className="subsection-header">
              <h3>➕ Add New Products</h3>
              <button className="back-btn" onClick={() => setActiveAdminSection('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            
            {uploadError && (
              <div className="upload-error">
                {uploadError}
              </div>
            )}
            
            {uploadSuccess && (
              <div className="upload-success">
                {uploadSuccess}
              </div>
            )}
            
            <div className="url-input-section">
              <h3>📎 Import from URL</h3>
              <p>Enter a URL to automatically extract vehicle information</p>
              <div className="url-input-container">
                <input 
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/vehicle-page"
                  className="url-input"
                />
                <button 
                  onClick={handleProcessUrl}
                  disabled={isProcessing || !url}
                  className="process-url-btn"
                >
                  {isProcessing ? 'Processing...' : 'Process URL'}
                </button>
              </div>
            </div>
            
            <div className="divider-section">
              <span className="divider-text">OR</span>
            </div>
            
            <div className="upload-container">
              <div 
                className="file-drop-zone"
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className="upload-icon">📁</div>
                <h3>Click or Drop Files Here</h3>
                <p>Upload product catalogs, brochures, or spec sheets</p>
                <p className="file-size-limit">Supported: PDF, Word, Excel, Images, Audio, Video (Max 100MB)</p>
              </div>
              <input 
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt,.csv,.mp3,.wav,.ogg,.m4a,.mp4,.avi,.mov,.wmv,.webm,.mkv"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files:</h4>
                  <div className="files-list">
                    {selectedFiles.map((file, index) => {
                      const fileType = file.type.split('/')[0];
                      const fileExt = file.name.split('.').pop().toLowerCase();
                      let fileIcon = '📄';
                      
                      if (fileType === 'image') fileIcon = '🖼️';
                      else if (fileType === 'video') fileIcon = '🎬';
                      else if (fileType === 'audio') fileIcon = '🎵';
                      else if (fileExt === 'pdf') fileIcon = '📕';
                      else if (['doc', 'docx'].includes(fileExt)) fileIcon = '📘';
                      else if (['xls', 'xlsx'].includes(fileExt)) fileIcon = '📗';
                      
                      return (
                        <div key={index} className="file-item">
                          <div className="file-info">
                            <span className="file-icon">{fileIcon}</span>
                            <div className="file-details">
                              <span className="file-name">{file.name}</span>
                              <span className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                              {fileType === 'image' && (
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={file.name} 
                                  className="file-thumbnail"
                                  onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                                />
                              )}
                              {fileType === 'video' && (
                                <video 
                                  src={URL.createObjectURL(file)} 
                                  className="file-thumbnail video-thumbnail"
                                  muted
                                  onLoadedMetadata={(e) => URL.revokeObjectURL(e.target.src)}
                                />
                              )}
                            </div>
                          </div>
                          <button 
                            className="remove-file-btn"
                            onClick={() => handleRemoveFile(index)}
                          >
                            ❌
                          </button>
                        </div>
                      );
                    })}
                  </div>
                  <div className="upload-actions">
                    <button 
                      onClick={handleProcessFiles}
                      disabled={isProcessing}
                      className="process-files-btn"
                    >
                      {isProcessing ? (
                        <>
                          <span className="spinner"></span>
                          Processing... {uploadProgress.overall ? `${uploadProgress.overall}%` : ''}
                        </>
                      ) : (
                        'Process Files'
                      )}
                    </button>
                    <button 
                      onClick={() => setSelectedFiles([])}
                      disabled={isProcessing}
                      className="clear-files-btn"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
              )}
              
              {uploadProgress.overall && (
                <div className="upload-progress-container">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${uploadProgress.overall}%` }}
                    >
                      {uploadProgress.overall}%
                    </div>
                  </div>
                </div>
              )}
              
              {processedFiles.length > 0 && (
                <div className="processed-files-section">
                  <h3>✅ Files Successfully Added to Knowledge Base!</h3>
                  <div className="info-message">
                    <span className="info-icon">ℹ️</span>
                    <div>
                      <p><strong>Files Location:</strong> <code>backend/uploads/</code></p>
                      <p>Gabru can now answer questions about these products! Test it in the Training tab.</p>
                    </div>
                  </div>
                  <div className="processed-files-list">
                    {processedFiles.map((file, index) => {
                      const fileType = file.type.split('/')[0];
                      const fileExt = file.name.split('.').pop().toLowerCase();
                      let fileIcon = '📄';
                      
                      if (fileType === 'image') fileIcon = '🖼️';
                      else if (fileType === 'video') fileIcon = '🎬';
                      else if (fileType === 'audio') fileIcon = '🎵';
                      else if (fileExt === 'pdf') fileIcon = '📕';
                      else if (['doc', 'docx'].includes(fileExt)) fileIcon = '📘';
                      else if (['xls', 'xlsx'].includes(fileExt)) fileIcon = '📗';
                      
                      return (
                        <div key={index} className="processed-file-item">
                          <span className="file-icon">{fileIcon}</span>
                          <span className="file-name">{file.name}</span>
                          <span className="success-icon">✅</span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="action-buttons">
                    <button 
                      className="view-knowledge-btn"
                      onClick={() => setActiveAdminSection('knowledge')}
                    >
                      📚 View Knowledge Base
                    </button>
                    <button 
                      className="test-gabru-btn"
                      onClick={() => setActiveTab('training')}
                    >
                      🤓 Test with Gabru
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'knowledge':
        return (
          <div className="admin-subsection">
            <div className="subsection-header">
              <h3>📚 Knowledge Base Management</h3>
              <button className="back-btn" onClick={() => setActiveAdminSection('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            
            <div className="knowledge-info">
              <h4>📂 File Storage Information</h4>
              <div className="storage-details">
                <p><strong>Storage Location:</strong> <code>backend/uploads/</code></p>
                <p><strong>Vector Database:</strong> ChromaDB / In-Memory</p>
                <p><strong>Processing Engine:</strong> OpenAI GPT-4</p>
              </div>
            </div>
            
            <div className="stats-grid compact">
              <div className="stat-card compact">
                <span className="stat-icon">📄</span>
                <span className="stat-number">{processedFiles.length + extractedData.length}</span>
                <span className="stat-label">Total Documents</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">🧠</span>
                <span className="stat-number">Active</span>
                <span className="stat-label">AI Status</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">🌐</span>
                <span className="stat-number">21</span>
                <span className="stat-label">Languages</span>
              </div>
            </div>
            
            {(processedFiles.length > 0 || extractedData.length > 0) && (
              <div className="knowledge-content">
                <h4>📋 Processed Knowledge Items</h4>
                <div className="knowledge-items-grid">
                  {processedFiles.map((file, index) => (
                    <div key={`file-${index}`} className="knowledge-item">
                      <div className="item-header">
                        <span className="item-type">FILE</span>
                        <span className="item-status active">Active</span>
                      </div>
                      <h5>{file.name}</h5>
                      <p className="item-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <p className="item-info">Processed and indexed for AI training</p>
                    </div>
                  ))}
                  {extractedData.slice(0, 6).map((item, index) => (
                    <div key={`data-${index}`} className="knowledge-item">
                      <div className="item-header">
                        <span className="item-type">PRODUCT</span>
                        <span className="item-status active">Active</span>
                      </div>
                      <h5>{item.title || item.name || `Product ${index + 1}`}</h5>
                      {item.price && <p className="item-price">{formatPrice(item.price)}</p>}
                      <p className="item-info">{item.description ? item.description.substring(0, 100) + '...' : 'Product information available'}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {processedFiles.length === 0 && extractedData.length === 0 && (
              <div className="empty-knowledge">
                <p>📁 No files in knowledge base yet</p>
                <button 
                  className="add-files-btn"
                  onClick={() => setActiveAdminSection('products')}
                >
                  ➕ Add Product Files
                </button>
              </div>
            )}
            
            <div className="knowledge-actions">
              <button 
                className="add-more-btn"
                onClick={() => setActiveAdminSection('products')}
              >
                ➕ Add More Files
              </button>
              <button 
                className="test-knowledge-btn"
                onClick={() => setActiveTab('training')}
              >
                🤓 Chat with Gabru
              </button>
            </div>
          </div>
        );

      case 'competitive':
        return (
          <div className="admin-subsection">
            <div className="subsection-header">
              <h3>📊 Competitive Analysis</h3>
              <button className="back-btn" onClick={() => setActiveAdminSection('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            
            <div className="stats-grid compact">
              <div className="stat-card compact">
                <span className="stat-icon">🏢</span>
                <span className="stat-number">{competitors.length}</span>
                <span className="stat-label">Competitors Tracked</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">📊</span>
                <span className="stat-number">42.5%</span>
                <span className="stat-label">Market Share</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">💰</span>
                <span className="stat-number">₹32L</span>
                <span className="stat-label">Avg Price Position</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">🏆</span>
                <span className="stat-number">2nd</span>
                <span className="stat-label">Market Position</span>
              </div>
            </div>
            
            <div className="competitors-grid">
              {competitors.map((competitor) => (
                <div key={competitor.id} className="competitor-card">
                  <div className="competitor-header">
                    <h4>{competitor.name}</h4>
                    <span className="market-share">{competitor.marketShare}% Market</span>
                  </div>
                  <div className="competitor-info">
                    <div className="info-row">
                      <span className="label">Brand:</span>
                      <span className="value">{competitor.brand}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Category:</span>
                      <span className="value">{competitor.category}</span>
                    </div>
                    <div className="info-row">
                      <span className="label">Price:</span>
                      <span className="value price">{formatPrice(competitor.price)}</span>
                    </div>
                  </div>
                  <div className="competitor-actions">
                    <button className="analyze-btn">Analyze</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="admin-subsection">
            <div className="subsection-header">
              <h3>⚙️ System Settings</h3>
              <button className="back-btn" onClick={() => setActiveAdminSection('dashboard')}>
                ← Back to Dashboard
              </button>
            </div>
            
            <div className="settings-sections">
              <div className="settings-card">
                <h3>🏢 Company Settings</h3>
                <div className="setting-item">
                  <label>Company Name</label>
                  <input 
                    type="text" 
                    value={systemSettings.companyName}
                    onChange={(e) => setSystemSettings({...systemSettings, companyName: e.target.value})}
                  />
                </div>
                <div className="setting-item">
                  <label>Contact Email</label>
                  <input 
                    type="email" 
                    value={systemSettings.contactEmail}
                    onChange={(e) => setSystemSettings({...systemSettings, contactEmail: e.target.value})}
                  />
                </div>
                <div className="setting-item">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    value={systemSettings.contactPhone}
                    onChange={(e) => setSystemSettings({...systemSettings, contactPhone: e.target.value})}
                  />
                </div>
                <div className="setting-item">
                  <label>Business Hours</label>
                  <input 
                    type="text" 
                    value={systemSettings.businessHours}
                    onChange={(e) => setSystemSettings({...systemSettings, businessHours: e.target.value})}
                  />
                </div>
                <div className="setting-item">
                  <label>Weekend Hours</label>
                  <input 
                    type="text" 
                    value={systemSettings.weekendHours}
                    onChange={(e) => setSystemSettings({...systemSettings, weekendHours: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="settings-card">
                <h3>🔒 System Configuration</h3>
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input 
                    type="number" 
                    value={systemSettings.sessionTimeout}
                    onChange={(e) => setSystemSettings({...systemSettings, sessionTimeout: e.target.value})}
                    min="15" 
                    max="480" 
                  />
                </div>
                <div className="setting-item">
                  <label>API Rate Limit (requests/hour)</label>
                  <input 
                    type="number" 
                    value={systemSettings.apiRateLimit}
                    onChange={(e) => setSystemSettings({...systemSettings, apiRateLimit: e.target.value})}
                    min="100" 
                    max="10000" 
                  />
                </div>
                <div className="setting-item">
                  <label>Max Upload Size (MB)</label>
                  <input 
                    type="number" 
                    value={systemSettings.maxUploadSize}
                    onChange={(e) => setSystemSettings({...systemSettings, maxUploadSize: e.target.value})}
                    min="1" 
                    max="100" 
                  />
                </div>
                <div className="setting-item">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={systemSettings.enableNotifications}
                      onChange={(e) => setSystemSettings({...systemSettings, enableNotifications: e.target.checked})}
                    />
                    Enable Email Notifications
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={systemSettings.enableAnalytics}
                      onChange={(e) => setSystemSettings({...systemSettings, enableAnalytics: e.target.checked})}
                    />
                    Enable Analytics Tracking
                  </label>
                </div>
                <div className="setting-item">
                  <label>
                    <input 
                      type="checkbox" 
                      checked={systemSettings.maintenanceMode}
                      onChange={(e) => setSystemSettings({...systemSettings, maintenanceMode: e.target.checked})}
                    />
                    Maintenance Mode
                  </label>
                </div>
              </div>
              
              <div className="settings-actions">
                <button 
                  className="save-settings-btn"
                  onClick={handleSaveSettings}
                >
                  💾 Save Settings
                </button>
                <button 
                  className="reset-settings-btn"
                  onClick={handleResetSettings}
                >
                  🔄 Reset to Defaults
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container admin-dashboard" style={{background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'}}>
      {/* Top Navigation Bar */}
      <div className="top-navigation">
        <div className="top-nav-left">
          <h1 className="app-title">🚗 AI Sales Coach</h1>
        </div>
        <div className="top-nav-tabs">
          {user?.role === 'admin' && (
            <button 
              className={`top-tab ${activeTab === 'admin' ? 'active' : ''}`}
              onClick={() => {
                setActiveTab('admin');
                window.scrollTo(0, 0);
              }}
            >
              🛠️ Admin Panel
            </button>
          )}
          <button 
            className={`top-tab ${activeTab === 'training' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('training');
              window.scrollTo(0, 0);
            }}
          >
            🎓 Sales Training Center
          </button>
        </div>
        <div className="top-nav-right">
          <div className="user-info">
            <span className="user-name">👤 {user?.name || 'User'}</span>
            <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Sales Rep'}</span>
          </div>
          <button 
            className="logout-btn" 
            onClick={() => {
              localStorage.removeItem('userData');
              onLogout();
            }}
            title="Logout"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="main-container">
        {/* Admin Tab - Show access denied for non-admin users */}
        {activeTab === 'admin' && user?.role !== 'admin' && (
          <div className="tab-content">
            <div className="access-denied">
              <h1>🔒 Access Restricted</h1>
              <p>You don't have permission to access the Admin Panel.</p>
              <p>Please contact your administrator if you believe you should have access.</p>
              <button 
                className="training-btn"
                onClick={() => {
                  setActiveTab('training');
                  window.scrollTo(0, 0);
                }}
                style={{ marginTop: '20px' }}
              >
                Go to Sales Training Center
              </button>
            </div>
          </div>
        )}

        {/* Admin Tab - Only accessible for admin users */}
        {activeTab === 'admin' && user?.role === 'admin' && (
          <div className="tab-content" style={{display: 'flex', gap: '20px'}}>
            {/* Left Sidebar for Admin */}
            <div className="admin-left-sidebar">
              <nav className="admin-nav">
                <button 
                  className={`nav-item ${activeAdminSection === 'dashboard' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('dashboard')}
                >
                  📋 Dashboard
                </button>
                <button 
                  className={`nav-item ${activeAdminSection === 'showroom' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('showroom')}
                >
                  🚗 Showroom
                </button>
                <button 
                  className={`nav-item ${activeAdminSection === 'inventory' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('inventory')}
                >
                  📦 Inventory Management
                </button>
                <button 
                  className={`nav-item ${activeAdminSection === 'products' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('products')}
                >
                  ➕ Add Products
                </button>
                <button 
                  className={`nav-item ${activeAdminSection === 'users' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('users')}
                >
                  👥 User Management
                </button>
                <button 
                  className={`nav-item ${activeAdminSection === 'competitive' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('competitive')}
                >
                  📊 Competitive Analysis
                </button>
                <button 
                  className={`nav-item ${activeAdminSection === 'knowledge' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('knowledge')}
                >
                  📚 Knowledge Base
                </button>
                <button 
                  className={`nav-item ${activeAdminSection === 'settings' ? 'active' : ''}`}
                  onClick={() => setActiveAdminSection('settings')}
                >
                  ⚙️ System Settings
                </button>
              </nav>
            </div>
            
            {/* Main Admin Content */}
            <div className="admin-main-content" style={{flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 120px)'}}>
              {error && (
                <div className="error-message">
                  <p>{error}</p>
                  <button onClick={fetchUsers}>Try Again</button>
                </div>
              )}
            {/* Dashboard Overview - Only show when dashboard is selected */}
            {activeAdminSection === 'dashboard' && (
              <div className="admin-section compact-overview">
                <h2>📊 Dashboard Overview</h2>
                <div className="stats-grid compact">
                  <div className="stat-card compact">
                    <span className="stat-icon">👥</span>
                    <span className="stat-number">{stats.totalUsers}</span>
                    <span className="stat-label">Users</span>
                  </div>
                  
                  <div className="stat-card compact">
                    <span className="stat-icon">✅</span>
                    <span className="stat-number">{stats.activeUsers}</span>
                    <span className="stat-label">Active</span>
                  </div>
                  
                  <div className="stat-card compact">
                    <span className="stat-icon">🚗</span>
                    <span className="stat-number">{inventory.length}</span>
                    <span className="stat-label">Stock</span>
                  </div>
                  
                  <div className="stat-card compact">
                    <span className="stat-icon">📈</span>
                    <span className="stat-number">{extractedData.length}</span>
                    <span className="stat-label">Imports</span>
                  </div>
                </div>
                
                {/* Quick Actions - Part of Dashboard Overview */}
                <h3 style={{fontSize: '18px', marginTop: '20px', marginBottom: '15px', color: '#2d3748', fontWeight: '600'}}>⚡ Quick Actions</h3>
                <div className="admin-quick-actions compact">
                <button 
                  className="admin-action-btn" 
                  onClick={() => setActiveAdminSection('users')}
                >
                  <span className="action-icon">👥</span>
                  <div className="action-content">
                    <span className="action-title">Users</span>
                    <span className="action-desc">Manage user accounts and permissions</span>
                  </div>
                </button>
                
                <button 
                  className="admin-action-btn" 
                  onClick={() => setActiveAdminSection('inventory')}
                >
                  <span className="action-icon">📦</span>
                  <div className="action-content">
                    <span className="action-title">Inventory</span>
                    <span className="action-desc">Track and manage vehicle stock</span>
                  </div>
                </button>
                
                <button 
                  className="admin-action-btn" 
                  onClick={() => setActiveAdminSection('products')}
                >
                  <span className="action-icon">➕</span>
                  <div className="action-content">
                    <span className="action-title">Add Product</span>
                    <span className="action-desc">Add new vehicles to the catalog</span>
                  </div>
                </button>
                
                
                <button 
                  className="admin-action-btn" 
                  onClick={() => setActiveAdminSection('competitive')}
                >
                  <span className="action-icon">📊</span>
                  <div className="action-content">
                    <span className="action-title">Competitive Analysis</span>
                    <span className="action-desc">Analyze market competition</span>
                  </div>
                </button>
                
                <button 
                  className="admin-action-btn" 
                  onClick={() => setActiveAdminSection('settings')}
                >
                  <span className="action-icon">⚙️</span>
                  <div className="action-content">
                    <span className="action-title">System Settings</span>
                    <span className="action-desc">Configure system preferences</span>
                  </div>
                </button>
              </div>
              </div>
            )}

              {/* Active Admin Section Content */}
              {activeAdminSection !== 'dashboard' && (
                <div className="admin-active-section">
                  {renderActiveAdminSection()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Product functionality - moved to Admin tab */}
        {false && (
          <div className="tab-content">
            <h1>➕ Add New Product</h1>
            <p>Upload files or provide a URL to automatically extract and populate vehicle information</p>
            
            {uploadError && (
              <div className="upload-error">
                {uploadError}
              </div>
            )}
            
            {/* URL Input Section */}
            <div className="url-input-section">
              <h3>🌐 Extract from URL</h3>
              <div className="url-input-container">
                <input
                  type="url"
                  className="url-input"
                  placeholder="Enter vehicle webpage URL (e.g., https://example.com/vehicle-details)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !processingUrl) {
                      processUrl();
                    }
                  }}
                  disabled={processingUrl}
                />
                <button
                  className="process-url-btn"
                  onClick={processUrl}
                  disabled={processingUrl || !urlInput.trim()}
                >
                  {processingUrl ? '⏳ Processing...' : '🔍 Extract Data'}
                </button>
              </div>
            </div>
            
            <div className="divider-section">
              <span className="divider-text">OR</span>
            </div>
            
            <div className="upload-container">
              <div className="file-drop-zone" 
                   onDrop={handleFileDrop}
                   onDragOver={handleDragOver}
                   onDragLeave={handleDragLeave}
                   onClick={handleUploadClick}>
                <div className="upload-icon">📤</div>
                <h3>Drop files here or click to upload</h3>
                <p>Supported formats: Images, PDF, Word, Excel, Audio (MP3, WAV), Video (MP4, AVI, MOV)</p>
                <p className="file-size-limit">Maximum file size: 100MB per file</p>
                
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt,.csv,.mp3,.wav,.ogg,.m4a,.mp4,.avi,.mov,.wmv,.webm,.mkv"
                  onChange={handleFileSelect}
                />
              </div>
              
              {selectedFiles.length > 0 && (
                <div className="selected-files">
                  <h4>Selected Files ({selectedFiles.length})</h4>
                  <div className="files-list">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="file-item">
                        <div className="file-info">
                          <span className="file-icon">
                            {getFileIcon(file.type)}
                          </span>
                          <div className="file-details">
                            <span className="file-name">{file.name}</span>
                            <span className="file-size">{formatFileSize(file.size)}</span>
                          </div>
                        </div>
                        <button 
                          className="remove-file-btn"
                          onClick={() => removeFile(index)}
                        >
                          ❌
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="upload-actions">
                    <button 
                      className="process-files-btn"
                      onClick={processFiles}
                      disabled={processing}
                    >
                      {processing ? '⏳ Processing...' : '🤖 Process with AI'}
                    </button>
                    <button 
                      className="clear-files-btn"
                      onClick={clearFiles}
                      disabled={processing}
                    >
                      🗑️ Clear All
                    </button>
                  </div>
                </div>
              )}
              
              {processing && (
                <div className="processing-status">
                  <div className="processing-spinner"></div>
                  <p>{processingStatus}</p>
                </div>
              )}
              
              {extractedData.length > 0 && (
                <div className="extracted-data">
                  <h3>🎉 Extracted Vehicle Data</h3>
                  <p>Review, edit, and save the following vehicle information:</p>
                  
                  {/* Quick Template Buttons */}
                  <div className="template-buttons">
                    <p>Quick Templates:</p>
                    {Object.keys(commonVehicleTemplates).map(templateName => (
                      <button
                        key={templateName}
                        className="template-btn"
                        onClick={() => {
                          setExtractedData([...extractedData, commonVehicleTemplates[templateName]]);
                        }}
                      >
                        + {templateName}
                      </button>
                    ))}
                    <button
                      className="template-btn"
                      onClick={() => {
                        setExtractedData([...extractedData, getEmptyVehicleTemplate()]);
                      }}
                    >
                      + Blank Template
                    </button>
                  </div>
                  
                  {extractedData.map((vehicle, index) => (
                    <div key={index} className="vehicle-data-card">
                      <div className="vehicle-header">
                        <h4>{vehicle.name || 'New Vehicle'}</h4>
                        <div className="vehicle-actions">
                          <span className="confidence-score" style={{
                            backgroundColor: vehicle.confidence > 50 ? '#d4f4dd' : '#ffeaa7',
                            color: vehicle.confidence > 50 ? '#27ae60' : '#fdcb6e'
                          }}>
                            {vehicle.confidence > 0 ? `Confidence: ${vehicle.confidence}%` : 'Manual Entry'}
                          </span>
                          <button 
                            className="save-vehicle-btn"
                            onClick={() => saveVehicleToInventory(vehicle, index)}
                          >
                            💾 Save to Showroom
                          </button>
                          <button 
                            className="delete-vehicle-btn"
                            onClick={() => deleteExtractedData(index)}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                      
                      <div className="vehicle-edit-form">
                        <div className="form-section">
                          <h5>Basic Information</h5>
                          <div className="form-row">
                            <div className="form-field">
                              <label>Vehicle Name</label>
                              <input 
                                type="text" 
                                value={vehicle.name || ''} 
                                onChange={(e) => updateExtractedField(index, 'name', e.target.value)}
                              />
                            </div>
                            <div className="form-field">
                              <label>Category</label>
                              <select 
                                value={vehicle.category || 'Sedan'} 
                                onChange={(e) => updateExtractedField(index, 'category', e.target.value)}
                              >
                                <option value="Sedan">Sedan</option>
                                <option value="SUV">SUV</option>
                                <option value="Coupe">Coupe</option>
                                <option value="Truck">Truck</option>
                                <option value="Van">Van</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Electric">Electric</option>
                                <option value="Luxury">Luxury</option>
                              </select>
                            </div>
                            <div className="form-field">
                              <label>Year</label>
                              <input 
                                type="number" 
                                value={vehicle.year || ''} 
                                onChange={(e) => updateExtractedField(index, 'year', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-section">
                          <h5>Pricing</h5>
                          <div className="form-row">
                            <div className="form-field">
                              <label>Price (₹/$)</label>
                              <input 
                                type="text" 
                                value={vehicle.price || ''} 
                                onChange={(e) => updateExtractedField(index, 'price', e.target.value.replace(/[^0-9.]/g, ''))}
                                placeholder="e.g., 1500000 or 35000"
                              />
                              {vehicle.price && <small>{formatPrice(vehicle.price)}</small>}
                            </div>
                            <div className="form-field">
                              <label>MSRP (₹/$)</label>
                              <input 
                                type="text" 
                                value={vehicle.msrp || ''} 
                                onChange={(e) => updateExtractedField(index, 'msrp', e.target.value.replace(/[^0-9.]/g, ''))}
                                placeholder="Original price"
                              />
                              {vehicle.msrp && <small>{formatPrice(vehicle.msrp)}</small>}
                            </div>
                            <div className="form-field">
                              <label>Dealer Cost (₹/$)</label>
                              <input 
                                type="text" 
                                value={vehicle.dealerCost || ''} 
                                onChange={(e) => updateExtractedField(index, 'dealerCost', e.target.value.replace(/[^0-9.]/g, ''))}
                                placeholder="Dealer invoice price"
                              />
                              {vehicle.dealerCost && <small>{formatPrice(vehicle.dealerCost)}</small>}
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-section">
                          <h5>Performance</h5>
                          <div className="form-row">
                            <div className="form-field">
                              <label>Engine</label>
                              <input 
                                type="text" 
                                value={vehicle.engine || ''} 
                                onChange={(e) => updateExtractedField(index, 'engine', e.target.value)}
                              />
                            </div>
                            <div className="form-field">
                              <label>Horsepower</label>
                              <input 
                                type="text" 
                                value={vehicle.horsepower || ''} 
                                onChange={(e) => updateExtractedField(index, 'horsepower', e.target.value)}
                              />
                            </div>
                            <div className="form-field">
                              <label>Torque</label>
                              <input 
                                type="text" 
                                value={vehicle.torque || ''} 
                                onChange={(e) => updateExtractedField(index, 'torque', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-section">
                          <h5>Efficiency</h5>
                          <div className="form-row">
                            <div className="form-field">
                              <label>City MPG</label>
                              <input 
                                type="text" 
                                value={vehicle.cityMPG || ''} 
                                onChange={(e) => updateExtractedField(index, 'cityMPG', e.target.value)}
                              />
                            </div>
                            <div className="form-field">
                              <label>Highway MPG</label>
                              <input 
                                type="text" 
                                value={vehicle.highwayMPG || ''} 
                                onChange={(e) => updateExtractedField(index, 'highwayMPG', e.target.value)}
                              />
                            </div>
                            <div className="form-field">
                              <label>Combined MPG</label>
                              <input 
                                type="text" 
                                value={vehicle.combinedMPG || ''} 
                                onChange={(e) => updateExtractedField(index, 'combinedMPG', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-section">
                          <h5>Additional Details</h5>
                          <div className="form-row">
                            <div className="form-field">
                              <label>Transmission</label>
                              <input 
                                type="text" 
                                value={vehicle.transmission || ''} 
                                onChange={(e) => updateExtractedField(index, 'transmission', e.target.value)}
                              />
                            </div>
                            <div className="form-field">
                              <label>Drivetrain</label>
                              <select 
                                value={vehicle.drivetrain || ''} 
                                onChange={(e) => updateExtractedField(index, 'drivetrain', e.target.value)}
                              >
                                <option value="">Select</option>
                                <option value="FWD">FWD</option>
                                <option value="RWD">RWD</option>
                                <option value="AWD">AWD</option>
                                <option value="4WD">4WD</option>
                              </select>
                            </div>
                            <div className="form-field">
                              <label>Seating Capacity</label>
                              <input 
                                type="number" 
                                value={vehicle.seatingCapacity || ''} 
                                onChange={(e) => updateExtractedField(index, 'seatingCapacity', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="form-section">
                          <h5>Description</h5>
                          <textarea 
                            className="description-field"
                            value={vehicle.description || ''} 
                            onChange={(e) => updateExtractedField(index, 'description', e.target.value)}
                            rows="3"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Showroom functionality - moved to Admin tab */}
        {false && (
          <div className="tab-content">
            <h1>🚗 Vehicle Showroom</h1>
            <p>Manage your vehicle inventory - edit details, pricing, and remove vehicles as needed.</p>
            
            {inventory.length === 0 ? (
              <div className="empty-inventory">
                <p>No vehicles in inventory yet. Add some vehicles from the Collection tab!</p>
              </div>
            ) : (
              <div className="inventory-grid">
                {inventory.map((vehicle, index) => (
                  <div key={vehicle.id || index} className="inventory-card">
                    <div className="vehicle-image">
                      <img src={vehicle.image || '/images/products/default-car.jpg'} alt={vehicle.name} onError={(e) => e.target.src = '/images/products/default-car.jpg'} />
                    </div>
                    <div className="vehicle-info">
                      <h3>{vehicle.name}</h3>
                      <p className="vehicle-category">{vehicle.category}</p>
                      <div className="vehicle-specs">
                        {vehicle.specs?.engine && <span>🔧 {vehicle.specs.engine}</span>}
                        {vehicle.specs?.horsepower && <span>⚡ {vehicle.specs.horsepower}hp</span>}
                        {vehicle.mileage?.combined && <span>⛽ {vehicle.mileage.combined} mpg</span>}
                      </div>
                      <div className="vehicle-pricing">
                        <span className="current-price">{formatPrice(vehicle.price)}</span>
                        {vehicle.originalPrice && vehicle.originalPrice !== vehicle.price && (
                          <span className="original-price">{formatPrice(vehicle.originalPrice)}</span>
                        )}
                      </div>
                      {vehicle.description && (
                        <p className="vehicle-description">{vehicle.description.substring(0, 100)}...</p>
                      )}
                    </div>
                    <div className="inventory-actions">
                      <button className="view-details-btn" onClick={() => viewVehicleDetails(vehicle)}>
                        👁️ View Details
                      </button>
                      <div className="dropdown-container">
                        <button 
                          className="dropdown-toggle"
                          onClick={(e) => toggleDropdown(vehicle.id, e)}
                        >
                          ⋮
                        </button>
                        {openDropdown === vehicle.id && (
                          <div className="dropdown-menu">
                            <button onClick={() => { viewVehicleDetails(vehicle); setOpenDropdown(null); }}>
                              👁️ View
                            </button>
                            <button onClick={() => { editVehicle(vehicle); setOpenDropdown(null); }}>
                              ✏️ Edit
                            </button>
                            <button onClick={() => { deleteVehicleFromInventory(vehicle.id); setOpenDropdown(null); }} className="delete-option">
                              🗑️ Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* Vehicle Details Modal */}
            {viewingVehicle && (
              <div className="edit-modal-backdrop">
                <div className="edit-modal">
                  <div className="modal-header">
                    <h3>Vehicle Details: {viewingVehicle.name}</h3>
                    <button className="close-modal-btn" onClick={() => setViewingVehicle(null)}>✕</button>
                  </div>
                  <div className="modal-content">
                    <div className="vehicle-details-grid">
                      <div className="detail-section">
                        <h5>Basic Information</h5>
                        <div className="detail-item">
                          <label>Name:</label>
                          <span>{viewingVehicle.name || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Category:</label>
                          <span>{viewingVehicle.category || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Year:</label>
                          <span>{viewingVehicle.year || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h5>Pricing</h5>
                        <div className="detail-item">
                          <label>Current Price:</label>
                          <span>{formatPrice(viewingVehicle.price)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Original Price:</label>
                          <span>{viewingVehicle.originalPrice ? formatPrice(viewingVehicle.originalPrice) : 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Dealer Cost:</label>
                          <span>{viewingVehicle.dealerCost ? formatPrice(viewingVehicle.dealerCost) : 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h5>Specifications</h5>
                        <div className="detail-item">
                          <label>Engine:</label>
                          <span>{viewingVehicle.specs?.engine || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Horsepower:</label>
                          <span>{viewingVehicle.specs?.horsepower || 'N/A'}</span>
                        </div>
                        <div className="detail-item">
                          <label>Transmission:</label>
                          <span>{viewingVehicle.specs?.transmission || 'N/A'}</span>
                        </div>
                      </div>
                      
                      <div className="detail-section">
                        <h5>Features</h5>
                        <div className="features-list">
                          {viewingVehicle.features?.length > 0 ? (
                            viewingVehicle.features.map((feature, index) => (
                              <span key={index} className="feature-tag">{feature}</span>
                            ))
                          ) : (
                            <span>No features listed</span>
                          )}
                        </div>
                      </div>
                      
                      {viewingVehicle.description && (
                        <div className="detail-section full-width">
                          <h5>Description</h5>
                          <p>{viewingVehicle.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="save-btn" onClick={() => { editVehicle(viewingVehicle); setViewingVehicle(null); }}>✏️ Edit Vehicle</button>
                    <button className="cancel-btn" onClick={() => setViewingVehicle(null)}>Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Vehicle Modal */}
            {editingVehicle && (
              <div className="edit-modal-backdrop">
                <div className="edit-modal">
                  <div className="modal-header">
                    <h3>Edit Vehicle: {editingVehicle.name}</h3>
                    <button className="close-modal-btn" onClick={() => setEditingVehicle(null)}>✕</button>
                  </div>
                  <div className="modal-content">
                    <div className="form-section">
                      <h5>Basic Information</h5>
                      <div className="form-row">
                        <div className="form-field">
                          <label>Vehicle Name</label>
                          <input 
                            type="text" 
                            value={editingVehicle.name || ''} 
                            onChange={(e) => setEditingVehicle({...editingVehicle, name: e.target.value})}
                          />
                        </div>
                        <div className="form-field">
                          <label>Category</label>
                          <select 
                            value={editingVehicle.category || 'Sedan'} 
                            onChange={(e) => setEditingVehicle({...editingVehicle, category: e.target.value})}
                          >
                            <option value="Sedan">Sedan</option>
                            <option value="SUV">SUV</option>
                            <option value="Coupe">Coupe</option>
                            <option value="Truck">Truck</option>
                            <option value="Van">Van</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Electric">Electric</option>
                            <option value="Luxury">Luxury</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h5>Pricing</h5>
                      <div className="form-row">
                        <div className="form-field">
                          <label>Current Price</label>
                          <input 
                            type="text" 
                            value={editingVehicle.price || ''} 
                            onChange={(e) => setEditingVehicle({...editingVehicle, price: e.target.value.replace(/[^0-9.]/g, '')})}
                            placeholder="e.g., 1500000 or 35000"
                          />
                          {editingVehicle.price && <small>{formatPrice(editingVehicle.price)}</small>}
                        </div>
                        <div className="form-field">
                          <label>Original Price (MSRP)</label>
                          <input 
                            type="text" 
                            value={editingVehicle.originalPrice || ''} 
                            onChange={(e) => setEditingVehicle({...editingVehicle, originalPrice: e.target.value.replace(/[^0-9.]/g, '')})}
                            placeholder="Original price"
                          />
                        </div>
                        <div className="form-field">
                          <label>Dealer Cost</label>
                          <input 
                            type="text" 
                            value={editingVehicle.dealerCost || ''} 
                            onChange={(e) => setEditingVehicle({...editingVehicle, dealerCost: e.target.value.replace(/[^0-9.]/g, '')})}
                            placeholder="Dealer invoice price"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="form-section">
                      <h5>Description</h5>
                      <textarea 
                        className="description-field"
                        value={editingVehicle.description || ''} 
                        onChange={(e) => setEditingVehicle({...editingVehicle, description: e.target.value})}
                        rows="3"
                      />
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="save-btn" onClick={() => saveEditedVehicle(editingVehicle)}>💾 Save Changes</button>
                    <button className="cancel-btn" onClick={() => setEditingVehicle(null)}>❌ Cancel</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Inventory functionality - moved to Admin tab */}
        {false && (
          <div className="tab-content">
            <h1>📦 Inventory Management</h1>
            <p>Manage stock levels, track vehicle availability, and monitor inventory metrics.</p>
            
            <div className="stats-grid compact">
              <div className="stat-card compact">
                <span className="stat-icon">🚗</span>
                <span className="stat-number">{inventory.length}</span>
                <span className="stat-label">Total Vehicles</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">✅</span>
                <span className="stat-number">{inventory.filter(v => v.inStock > 0).length}</span>
                <span className="stat-label">In Stock</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">⚠️</span>
                <span className="stat-number">{inventory.filter(v => (v.inStock || 0) <= 2).length}</span>
                <span className="stat-label">Low Stock</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">💰</span>
                <span className="stat-number total-value">{formatPrice(inventory.reduce((sum, v) => sum + (parseFloat(v.price) || 0), 0))}</span>
                <span className="stat-label">Total Value</span>
              </div>
            </div>
            
            <div className="inventory-table">
              <h3>Current Inventory</h3>
              <div className="table-responsive">
                <table>
                  <thead>
                    <tr>
                      <th>Vehicle</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Stock Level</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map((vehicle, index) => (
                      <tr key={vehicle.id || index}>
                        <td>{vehicle.name}</td>
                        <td>{vehicle.category}</td>
                        <td>{formatPrice(vehicle.price)}</td>
                        <td>{vehicle.inStock || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${(vehicle.inStock || 0) > 5 ? 'in-stock' : (vehicle.inStock || 0) > 0 ? 'low-stock' : 'out-of-stock'}`}>
                            {(vehicle.inStock || 0) > 5 ? 'In Stock' : (vehicle.inStock || 0) > 0 ? 'Low Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td>
                          <div className="table-actions">
                            <div className="dropdown-container">
                              <button 
                                className="table-dropdown-toggle"
                                onClick={(e) => toggleDropdown(`inventory-${vehicle.id}`, e)}
                              >
                                ⋮
                              </button>
                              {openDropdown === `inventory-${vehicle.id}` && (
                                <div className="dropdown-menu">
                                  <button onClick={() => { viewVehicleDetails(vehicle); setOpenDropdown(null); }}>
                                    👁️ View Details
                                  </button>
                                  <button onClick={() => { editVehicle(vehicle); setOpenDropdown(null); }}>
                                    ✏️ Edit
                                  </button>
                                  <button onClick={() => { deleteVehicleFromInventory(vehicle.id); setOpenDropdown(null); }} className="delete-option">
                                    🗑️ Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Users functionality - moved to Admin tab */}
        {false && (
          <div className="tab-content">
            <h1>👥 User Management</h1>
            <p>Manage user accounts, roles, and permissions.</p>
            
            <div className="stats-grid compact">
              <div className="stat-card compact">
                <span className="stat-icon">👥</span>
                <span className="stat-number">{stats.totalUsers}</span>
                <span className="stat-label">Total Users</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">✅</span>
                <span className="stat-number">{stats.activeUsers}</span>
                <span className="stat-label">Active Users</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">🛡️</span>
                <span className="stat-number">{stats.adminUsers}</span>
                <span className="stat-label">Admins</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">💼</span>
                <span className="stat-number">{stats.salesUsers}</span>
                <span className="stat-label">Sales Staff</span>
              </div>
            </div>
            
            <div className="users-section">
              <h3>User Management</h3>
              <div className="user-actions">
                <button className="add-user-btn">➕ Add New User</button>
                <button className="export-users-btn">📤 Export Users</button>
              </div>
              
              <div className="users-table">
                <div className="table-responsive">
                  <table>
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Last Active</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((userItem, index) => (
                        <tr key={userItem.phoneNumber || index}>
                          <td>{userItem.name}</td>
                          <td>{userItem.phoneNumber}</td>
                          <td>
                            <span className={`role-badge ${userItem.role === 'admin' ? 'admin-role' : 'sales-role'}`}>
                              {userItem.role === 'admin' ? '🛡️ Admin' : '💼 Sales'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${userItem.active ? 'active-user' : 'inactive-user'}`}>
                              {userItem.active ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>{userItem.lastActive ? new Date(userItem.lastActive).toLocaleDateString() : 'Never'}</td>
                          <td>
                            <div className="table-actions">
                              <div className="dropdown-container">
                                <button 
                                  className="table-dropdown-toggle"
                                  onClick={(e) => toggleDropdown(`user-${userItem.phoneNumber}`, e)}
                                >
                                  ⋮
                                </button>
                                {openDropdown === `user-${userItem.phoneNumber}` && (
                                  <div className="dropdown-menu">
                                    <button onClick={() => setOpenDropdown(null)}>
                                      👁️ View Profile
                                    </button>
                                    <button onClick={() => setOpenDropdown(null)}>
                                      ✏️ Edit User
                                    </button>
                                    <button onClick={() => setOpenDropdown(null)}>
                                      🔒 {userItem.active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button onClick={() => setOpenDropdown(null)} className="delete-option">
                                      🗑️ Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan="6" style={{textAlign: 'center', padding: '20px', color: '#718096'}}>
                            {loading ? 'Loading users...' : 'No users found'}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Competitive Analysis functionality - moved to Admin tab */}
        {false && (
          <div className="tab-content">
            <h1>📊 Competitive Analysis</h1>
            <p>Analyze competitors, compare pricing, and identify market opportunities.</p>
            
            {/* Market Overview Cards */}
            <div className="stats-grid compact">
              <div className="stat-card compact">
                <span className="stat-icon">🏆</span>
                <span className="stat-number">{competitors.length}</span>
                <span className="stat-label">Active Competitors</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">📈</span>
                <span className="stat-number">{formatPrice(competitors.reduce((avg, c) => avg + c.price, 0) / competitors.length)}</span>
                <span className="stat-label">Avg Competitor Price</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">🎯</span>
                <span className="stat-number">{Math.max(...competitors.map(c => c.marketShare)).toFixed(1)}%</span>
                <span className="stat-label">Top Market Share</span>
              </div>
              <div className="stat-card compact">
                <span className="stat-icon">💰</span>
                <span className="stat-number">{formatPrice(Math.min(...competitors.map(c => c.price)))}</span>
                <span className="stat-label">Lowest Price Point</span>
              </div>
            </div>

            {/* Competitive Analysis Sections */}
            <div className="competitive-sections">
              <div className="competitive-section">
                <h3>🏢 Competitor Overview</h3>
                <div className="competitors-grid">
                  {competitors.map(competitor => (
                    <div key={competitor.id} className="competitor-card">
                      <div className="competitor-header">
                        <h4>{competitor.name}</h4>
                        <span className="market-share">{competitor.marketShare}% market share</span>
                      </div>
                      <div className="competitor-info">
                        <div className="info-row">
                          <span className="label">Brand:</span>
                          <span className="value">{competitor.brand}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Category:</span>
                          <span className="value">{competitor.category}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Price:</span>
                          <span className="value price">{formatPrice(competitor.price)}</span>
                        </div>
                      </div>
                      <div className="competitor-actions">
                        <button 
                          className="analyze-btn"
                          onClick={() => setSelectedCompetitor(competitor)}
                        >
                          📊 Analyze
                        </button>
                        <div className="dropdown-container">
                          <button 
                            className="dropdown-toggle"
                            onClick={(e) => toggleDropdown(`comp-${competitor.id}`, e)}
                          >
                            ⋮
                          </button>
                          {openDropdown === `comp-${competitor.id}` && (
                            <div className="dropdown-menu">
                              <button onClick={() => { setSelectedCompetitor(competitor); setOpenDropdown(null); }}>
                                👁️ View Details
                              </button>
                              <button onClick={() => setOpenDropdown(null)}>
                                ✏️ Edit
                              </button>
                              <button onClick={() => setOpenDropdown(null)} className="delete-option">
                                🗑️ Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  <div className="add-competitor-card">
                    <div className="add-competitor-content">
                      <div className="add-icon">➕</div>
                      <h4>Add Competitor</h4>
                      <p>Track new competitors in your market</p>
                      <button className="add-competitor-btn">Add New</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Comparison Section */}
              <div className="competitive-section">
                <h3>💰 Price Comparison</h3>
                <div className="price-comparison-table">
                  <div className="table-responsive">
                    <table>
                      <thead>
                        <tr>
                          <th>Vehicle</th>
                          <th>Brand</th>
                          <th>Our Price</th>
                          <th>Competitor Price</th>
                          <th>Difference</th>
                          <th>Market Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {inventory.slice(0, 3).map((vehicle, index) => {
                          const competitor = competitors[index % competitors.length];
                          const ourPrice = parseFloat(vehicle.price) || 0;
                          const compPrice = competitor.price;
                          const difference = ourPrice - compPrice;
                          const percentage = ((difference / compPrice) * 100).toFixed(1);
                          
                          return (
                            <tr key={vehicle.id || index}>
                              <td>{vehicle.name}</td>
                              <td>Our Brand</td>
                              <td className="price">{formatPrice(ourPrice)}</td>
                              <td className="price">{formatPrice(compPrice)}</td>
                              <td className={`difference ${difference > 0 ? 'higher' : 'lower'}`}>
                                {difference > 0 ? '+' : ''}{formatPrice(Math.abs(difference))}
                                <span className="percentage">({percentage > 0 ? '+' : ''}{percentage}%)</span>
                              </td>
                              <td>
                                <span className={`position-badge ${difference > 0 ? 'premium' : 'competitive'}`}>
                                  {difference > 0 ? '🔺 Premium' : '🔻 Competitive'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Market Insights */}
              <div className="competitive-section">
                <h3>📈 Market Insights</h3>
                <div className="insights-grid">
                  <div className="insight-card">
                    <h4>🎯 Positioning Opportunity</h4>
                    <p>Your vehicles are positioned in the premium segment with 15-20% higher pricing than competitors. Consider highlighting luxury features and quality advantages.</p>
                    <div className="insight-actions">
                      <button className="insight-btn">View Strategy</button>
                    </div>
                  </div>
                  
                  <div className="insight-card">
                    <h4>⚡ Feature Gaps</h4>
                    <p>Competitors are emphasizing advanced safety features and connectivity. Consider adding these to your value proposition.</p>
                    <div className="insight-actions">
                      <button className="insight-btn">Analyze Features</button>
                    </div>
                  </div>
                  
                  <div className="insight-card">
                    <h4>💡 Pricing Strategy</h4>
                    <p>Market average is {formatPrice(competitors.reduce((avg, c) => avg + c.price, 0) / competitors.length)}. Your pricing strategy shows premium positioning.</p>
                    <div className="insight-actions">
                      <button className="insight-btn">Optimize Pricing</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Competitor Detail Modal */}
            {selectedCompetitor && (
              <div className="edit-modal-backdrop">
                <div className="edit-modal competitive-modal">
                  <div className="modal-header">
                    <h3>Competitive Analysis: {selectedCompetitor.name}</h3>
                    <button className="close-modal-btn" onClick={() => setSelectedCompetitor(null)}>✕</button>
                  </div>
                  <div className="modal-content">
                    <div className="competitive-analysis-grid">
                      <div className="analysis-section">
                        <h5>📊 Market Position</h5>
                        <div className="detail-item">
                          <label>Market Share:</label>
                          <span>{selectedCompetitor.marketShare}%</span>
                        </div>
                        <div className="detail-item">
                          <label>Price Point:</label>
                          <span>{formatPrice(selectedCompetitor.price)}</span>
                        </div>
                        <div className="detail-item">
                          <label>Category:</label>
                          <span>{selectedCompetitor.category}</span>
                        </div>
                      </div>

                      <div className="analysis-section">
                        <h5>🔥 Strengths</h5>
                        <div className="strengths-list">
                          {selectedCompetitor.strengths.map((strength, index) => (
                            <span key={index} className="strength-tag">✅ {strength}</span>
                          ))}
                        </div>
                      </div>

                      <div className="analysis-section">
                        <h5>⚠️ Weaknesses</h5>
                        <div className="weaknesses-list">
                          {selectedCompetitor.weaknesses.map((weakness, index) => (
                            <span key={index} className="weakness-tag">❌ {weakness}</span>
                          ))}
                        </div>
                      </div>

                      <div className="analysis-section">
                        <h5>🛠️ Key Features</h5>
                        <div className="features-list">
                          {selectedCompetitor.features.map((feature, index) => (
                            <span key={index} className="feature-tag">{feature}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-actions">
                    <button className="save-btn">📊 Generate Report</button>
                    <button className="cancel-btn" onClick={() => setSelectedCompetitor(null)}>Close</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Training Tab */}
        {activeTab === 'training' && (
          <div className="tab-content" style={{display: 'flex', gap: '20px'}}>
            {/* Left Sidebar for Training */}
            <div className="admin-left-sidebar">
              <nav className="admin-nav">
                <button 
                  className={`nav-item ${activeTrainingSection === 'dashboard' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTrainingSection('dashboard');
                    window.scrollTo(0, 0);
                  }}
                >
                  📋 Dashboard
                </button>
                <button 
                  className={`nav-item ${activeTrainingSection === 'modules' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTrainingSection('modules');
                    window.scrollTo(0, 0);
                  }}
                >
                  📚 Training Modules
                </button>
                <button 
                  className={`nav-item ${activeTrainingSection === 'scenarios' ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTrainingSection('scenarios');
                    window.scrollTo(0, 0);
                  }}
                >
                  🎭 Training Scenarios
                </button>
              </nav>
            </div>
            
            {/* Main Training Content */}
            <div className="admin-main-content" style={{flex: 1, overflowY: 'auto', maxHeight: 'calc(100vh - 120px)'}}>
              {activeTrainingSection === 'dashboard' && (
                <div className="admin-section">
                  <h2>📋 Training Dashboard</h2>
                  <div className="stats-grid compact">
                    <div className="stat-card compact">
                      <span className="stat-icon">📚</span>
                      <span className="stat-number">4</span>
                      <span className="stat-label">Active Modules</span>
                    </div>
                    <div className="stat-card compact">
                      <span className="stat-icon">✅</span>
                      <span className="stat-number">58%</span>
                      <span className="stat-label">Avg Progress</span>
                    </div>
                    <div className="stat-card compact">
                      <span className="stat-icon">🏆</span>
                      <span className="stat-number">85%</span>
                      <span className="stat-label">Avg Score</span>
                    </div>
                    <div className="stat-card compact">
                      <span className="stat-icon">🔥</span>
                      <span className="stat-number">7</span>
                      <span className="stat-label">Day Streak</span>
                    </div>
                  </div>
                  
                  <h3 style={{marginTop: '30px', marginBottom: '20px'}}>⚡ Quick Actions</h3>
                  <div className="admin-quick-actions">
                    <button 
                      className="admin-action-btn"
                      onClick={() => setActiveTrainingSection('modules')}
                    >
                      <span className="action-icon">📖</span>
                      <div className="action-content">
                        <span className="action-title">Continue Learning</span>
                        <span className="action-desc">Resume your training modules</span>
                      </div>
                    </button>
                    <button 
                      className="admin-action-btn"
                      onClick={() => setActiveTrainingSection('scenarios')}
                    >
                      <span className="action-icon">🎭</span>
                      <div className="action-content">
                        <span className="action-title">Practice Scenarios</span>
                        <span className="action-desc">Interactive role-play training</span>
                      </div>
                    </button>
                    <button 
                      className="admin-action-btn"
                      onClick={() => handleTrainingScenario('product-knowledge')}
                    >
                      <span className="action-icon">🧪</span>
                      <div className="action-content">
                        <span className="action-title">Quick Quiz</span>
                        <span className="action-desc">Test your knowledge</span>
                      </div>
                    </button>
                    <button 
                      className="admin-action-btn"
                      onClick={() => alert('Performance reports coming soon!')}
                    >
                      <span className="action-icon">📊</span>
                      <div className="action-content">
                        <span className="action-title">View Progress</span>
                        <span className="action-desc">Check your performance stats</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
              
              {activeTrainingSection === 'modules' && (
                <div className="admin-subsection">
                  <div className="subsection-header">
                    <h3>📚 Training Modules</h3>
                  </div>
                  
                  <div className="training-sections">
                    <div className="training-card">
                      <h3>📖 Sales Techniques</h3>
                      <p>Learn proven sales methodologies and closing techniques for luxury vehicles</p>
                      <div className="training-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: '75%'}}></div>
                        </div>
                        <span className="progress-text">75% Complete</span>
                      </div>
                      <button className="training-btn">Continue Training</button>
                    </div>
                    
                    <div className="training-card">
                      <h3>🔧 Product Knowledge</h3>
                      <p>Master specifications, features, and benefits of all vehicle models</p>
                      <div className="training-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: '60%'}}></div>
                        </div>
                        <span className="progress-text">60% Complete</span>
                      </div>
                      <button className="training-btn">View Materials</button>
                    </div>
                    
                    <div className="training-card">
                      <h3>🎯 Customer Handling</h3>
                      <p>Practice objection handling and customer relationship management</p>
                      <div className="training-progress">
                        <div className="progress-bar">
                          <div className="progress-fill" style={{width: '40%'}}></div>
                        </div>
                        <span className="progress-text">40% Complete</span>
                      </div>
                      <button className="training-btn">Practice Now</button>
                    </div>
                    
                    <div className="training-card">
                      <h3>📊 Performance Tracking</h3>
                      <p>Monitor your progress and identify areas for improvement</p>
                      <div className="training-stats">
                        <div className="stat">
                          <span className="stat-number">85%</span>
                          <span className="stat-label">Avg Score</span>
                        </div>
                        <div className="stat">
                          <span className="stat-number">12</span>
                          <span className="stat-label">Completed</span>
                        </div>
                      </div>
                      <button className="training-btn">View Reports</button>
                    </div>
                  </div>
                </div>
              )}
              
              {activeTrainingSection === 'scenarios' && (
                <div className="admin-subsection">
                  <div className="subsection-header">
                    <h3>🎭 Training Scenarios</h3>
                  </div>
                  
                  <div className="training-chatbot-section">
                    <div className="training-chatbot-header">
                      <h2>🤖 AI Training Coach</h2>
                      <p>Interactive training assistant for sales representatives</p>
                    </div>
                    
                    <div className="training-chatbot-container">
                      <TrainingChatBot trainingScenario={currentTrainingScenario} />
                    </div>
                    
                    <div className="training-quick-actions">
                      <h4>Select Training Scenario:</h4>
                      <div className="scenario-buttons">
                        <button className="scenario-btn" onClick={() => handleTrainingScenario('objection-handling')}>
                          🛡️ Objection Handling
                        </button>
                        <button className="scenario-btn" onClick={() => handleTrainingScenario('product-knowledge')}>
                          🔧 Product Knowledge Test
                        </button>
                        <button className="scenario-btn" onClick={() => handleTrainingScenario('closing-techniques')}>
                          🎯 Closing Techniques
                        </button>
                        <button className="scenario-btn" onClick={() => handleTrainingScenario('customer-interaction')}>
                          👥 Customer Interaction
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Settings functionality - moved to Admin tab */}
        {false && (
          <div className="tab-content">
            <h1>⚙️ System Settings</h1>
            <div className="settings-sections">
              <div className="settings-card">
                <h3>🔧 General Settings</h3>
                <div className="setting-item">
                  <label>Dealership Name</label>
                  <input type="text" value="Premium Hybrid Motors" readOnly />
                </div>
                <div className="setting-item">
                  <label>Business Hours</label>
                  <input type="text" value="Mon-Fri: 9AM-8PM, Sat-Sun: 10AM-6PM" readOnly />
                </div>
                <div className="setting-item">
                  <label>Contact Phone</label>
                  <input type="text" value="+1 (555) 123-4567" readOnly />
                </div>
              </div>
              
              <div className="settings-card">
                <h3>💰 Pricing Settings</h3>
                <div className="setting-item">
                  <label>Default Currency</label>
                  <select>
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                  </select>
                </div>
                <div className="setting-item">
                  <label>Tax Rate (%)</label>
                  <input type="number" value="18" min="0" max="50" step="0.1" />
                </div>
              </div>
              
              <div className="settings-card">
                <h3>🤖 AI Settings</h3>
                <div className="setting-item">
                  <label>Chatbot Response Delay (ms)</label>
                  <input type="number" value="1500" min="500" max="5000" step="100" />
                </div>
                <div className="setting-item">
                  <label>Enable Quick Questions</label>
                  <input type="checkbox" defaultChecked />
                </div>
              </div>
              
              <div className="settings-card">
                <h3>🔐 Security Settings</h3>
                <div className="setting-item">
                  <label>Session Timeout (minutes)</label>
                  <input type="number" value="60" min="15" max="480" />
                </div>
                <div className="setting-item">
                  <label>Enable Two-Factor Authentication</label>
                  <input type="checkbox" />
                </div>
              </div>
              
              <div className="settings-actions">
                <button className="save-settings-btn">💾 Save Settings</button>
                <button className="reset-settings-btn">🔄 Reset to Defaults</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;