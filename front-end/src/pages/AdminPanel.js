import React, { useState, useEffect } from 'react';
import SlideManagement from '../components/admin/SlideManagement';
import CompanyManagement from '../components/admin/CompanyManagement';
import './AdminPanel.css';

const AdminPanel = ({ onExitAdmin }) => {
  const [activeTab, setActiveTab] = useState('slides');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('adminUser');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div className="admin-header-content">
          <div className="admin-title-section">
            <h1 className="admin-title">
              <span className="admin-icon">⚙️</span>
              Admin Panel
            </h1>
            {user && (
              <div className="user-info">
                <span className="welcome-text">Hoş geldin,</span>
                <span className="user-name">{user.fullName}</span>
                <span className="user-email">({user.email})</span>
                <span className="user-role">({user.role})</span>
              </div>
            )}
          </div>
          <button className="exit-admin-btn" onClick={onExitAdmin}>
            Çıkış Yap
          </button>
        </div>
      </div>

      <div className="admin-nav">
        <button 
          className={`admin-nav-btn ${activeTab === 'slides' ? 'active' : ''}`}
          onClick={() => setActiveTab('slides')}
        >
          <span className="nav-icon">🖼️</span>
          Slide Yönetimi
        </button>
        <button 
          className={`admin-nav-btn ${activeTab === 'companies' ? 'active' : ''}`}
          onClick={() => setActiveTab('companies')}
        >
          <span className="nav-icon">🏢</span>
          Firma Yönetimi
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'slides' && <SlideManagement />}
        {activeTab === 'companies' && <CompanyManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;
