import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ scrollToSection }) => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'proje-detayi', 'katilimcilar', 'sizde-katilin'];
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const element = document.getElementById(sections[i]);
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    scrollToSection(sectionId);
  };

  return (
    <header className="header">
      <nav className="nav">
        <button 
          onClick={() => handleNavClick('home')}
          className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}
        >
          Ana Sayfa
        </button>
        <button 
          onClick={() => handleNavClick('proje-detayi')}
          className={`nav-link ${activeSection === 'proje-detayi' ? 'active' : ''}`}
        >
          Proje Detayı
        </button>
        <button 
          onClick={() => handleNavClick('katilimcilar')}
          className={`nav-link ${activeSection === 'katilimcilar' ? 'active' : ''}`}
        >
          Katılımcılar
        </button>
        <button 
          onClick={() => handleNavClick('sizde-katilin')}
          className={`nav-link ${activeSection === 'sizde-katilin' ? 'active' : ''}`}
        >
          Sizde Katılın
        </button>
      </nav>
    </header>
  );
};

export default Header;
