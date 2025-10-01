import React, { useState, useEffect } from 'react';
import './CompanyGrid.css';

const CompanyGrid = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/companies/all');
      if (response.ok) {
        const data = await response.json();
        // Adet miktarına göre büyükten küçüğe sırala
        const sortedCompanies = data.sort((a, b) => (b.orderQuantity || 0) - (a.orderQuantity || 0));
        setCompanies(sortedCompanies);
      } else {
        setError('Firma verileri yüklenemedi');
      }
    } catch (error) {
      console.error('Firma verileri yüklenirken hata:', error);
      setError('Bağlantı hatası');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="companies-grid-section">
        <h3 className="grid-title">EKRANDAKİ YERİNİZ</h3>
        <p className="loading-message">Firma logoları yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="companies-grid-section">
        <h3 className="grid-title">EKRANDAKİ YERİNİZ</h3>
        <p className="error-message">{error}</p>
      </div>
    );
  }

  if (companies.length === 0) {
    return (
      <div className="companies-grid-section">
        <h3 className="grid-title">EKRANDAKİ YERİNİZ</h3>
        <p className="no-companies">Henüz katılımcı firma bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="companies-grid-section">
      <h3 className="grid-title">EKRANDAKİ YERİNİZ</h3>
      <div className="companies-grid">
        {companies.map((company) => (
          <div key={company.taxNumber} className="company-cell">
            <div className="company-logo-container">
              {company.logoUrl ? (
                <img 
                  src={company.logoUrl.startsWith('/uploads/logos/') ? `/api/files/logos/${company.logoUrl.split('/').pop()}` : `/api/files/logos/${company.logoUrl}`} 
                  alt={company.companyName || 'Company Logo'}
                  className="company-logo"
                  onError={(e) => {
                    console.log('Grid logo yüklenemedi:', company.logoUrl);
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className="logo-placeholder" style={{display: company.logoUrl ? 'none' : 'flex'}}>
                <span className="company-initial">
                  {company.companyName ? company.companyName.charAt(0).toUpperCase() : 'C'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyGrid;
