import React, { useState, useEffect } from 'react';
import './CompanyLogos.css';

const CompanyLogos = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies/all');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
      setLoading(false);
    } catch (error) {
      console.error('Firmalar yüklenirken hata:', error);
      setLoading(false);
    }
  };

  const logosPerPage = 6; // 3x2 grid
  const totalPages = Math.ceil(companies.length / logosPerPage);

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const currentLogos = companies.slice(
    currentIndex * logosPerPage,
    (currentIndex + 1) * logosPerPage
  );

  if (loading) {
    return (
      <section id="katilimcilar" className="company-logos">
        <div className="container">
          <h2 className="section-title">KATILIMCILAR</h2>
          <div className="loading-message">Firmalar yükleniyor...</div>
        </div>
      </section>
    );
  }

  return (
    <section id="katilimcilar" className="company-logos">
      <div className="container">
        <h2 className="section-title">KATILIMCILAR</h2>
        
        {companies.length === 0 ? (
          <div className="no-companies">Henüz katılımcı firma bulunmuyor.</div>
        ) : (
          <>
            <div className="logos-carousel">
              {totalPages > 1 && (
                <button className="carousel-btn prev" onClick={prevPage}>
                  ‹
                </button>
              )}
              
              <div className="logos-grid">
                {currentLogos.map((company) => (
                  <div key={company.taxNumber} className="logo-item">
                    {company.logoUrl ? (
                      <img 
                        src={company.logoUrl.startsWith('/uploads/logos/') ? `/api/files/logos/${company.logoUrl.split('/').pop()}` : `/api/files/logos/${company.logoUrl}`} 
                        alt={company.companyName}
                        className="company-logo-img"
                        onError={(e) => {
                          console.log('Logo yüklenemedi:', company.logoUrl);
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div 
                      className="logo-placeholder" 
                      style={{ display: company.logoUrl ? 'none' : 'flex' }}
                    >
                      {company.companyName ? company.companyName.charAt(0).toUpperCase() : '🏢'}
                    </div>
                  </div>
                ))}
              </div>
              
              {totalPages > 1 && (
                <button className="carousel-btn next" onClick={nextPage}>
                  ›
                </button>
              )}
            </div>
            
            {totalPages > 1 && (
              <div className="carousel-indicators">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    className={`indicator ${i === currentIndex ? 'active' : ''}`}
                    onClick={() => setCurrentIndex(i)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CompanyLogos;
