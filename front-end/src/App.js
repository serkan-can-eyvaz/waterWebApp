import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Home from './pages/Home';
import ProjectDetails from './pages/ProjectDetails';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';

// Ana uygulama bileşeni
const MainApp = () => {
  const navigate = useNavigate();

  const scrollToSection = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (sectionId === 'proje-detayi') {
      const element = document.getElementById('proje-detayi');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (sectionId === 'katilimcilar') {
      const element = document.getElementById('katilimcilar');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (sectionId === 'sizde-katilin') {
      const element = document.getElementById('sizde-katilin');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="App">
      <Header scrollToSection={scrollToSection} />
      <button 
        className="admin-toggle-btn" 
        onClick={goToLogin}
        title="Admin Girişi"
      >
        ⚙️
      </button>
      <Home />
      <div id="proje-detayi">
        <ProjectDetails />
      </div>
    </div>
  );
};

// Admin panel bileşeni (Protected)
const AdminApp = () => {
  const navigate = useNavigate();

  // Token kontrolü
  const token = localStorage.getItem('adminToken');
  
  if (!token) {
    navigate('/login');
    return null;
  }

  const exitAdmin = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/');
  };

  return (
    <div className="App">
      <AdminPanel onExitAdmin={exitAdmin} />
    </div>
  );
};

// Ana App bileşeni
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
      </Routes>
    </Router>
  );
}

export default App;
