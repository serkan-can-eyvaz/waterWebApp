import React, { useState } from 'react';
import './CompanyLogos.css';

const CompanyLogos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Mock data - gerçek projede API'den gelecek
  const logos = Array.from({ length: 18 }, (_, i) => ({
    id: i + 1,
    name: `Firma ${i + 1}`,
    logo: null // Gerçek logolar buraya gelecek
  }));

  const logosPerPage = 6; // 3x2 grid
  const totalPages = Math.ceil(logos.length / logosPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentLogos = logos.slice(
    currentIndex * logosPerPage,
    (currentIndex + 1) * logosPerPage
  );

  return (
    <section id="katilimcilar" className="company-logos">
      <div className="container">
        <h2 className="section-title">KATILIMCILAR</h2>
        
        <div className="logos-carousel">
          <button className="carousel-btn prev" onClick={prevPage}>
            ‹
          </button>
          
          <div className="logos-grid">
            {currentLogos.map((logo) => (
              <div key={logo.id} className="logo-item">
                <div className="logo-placeholder">
                  FİRMA LOGO
                </div>
              </div>
            ))}
          </div>
          
          <button className="carousel-btn next" onClick={nextPage}>
            ›
          </button>
        </div>
        
        <div className="carousel-indicators">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`indicator ${i === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CompanyLogos;
