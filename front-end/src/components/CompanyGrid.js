import React, { useState, useEffect } from 'react';
import './CompanyGrid.css';

const CompanyGrid = () => {
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
        // Adet miktarına göre büyükten küçüğe sırala
        const sortedCompanies = data.sort((a, b) => (b.orderQuantity || 0) - (a.orderQuantity || 0));
        setCompanies(sortedCompanies);
      }
    } catch (error) {
      console.error('Firma verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toplam 228 hücre için (12x19 grid)
  const totalCells = 228;
  const companyCells = companies.length;
  const emptyCells = totalCells - companyCells;

  if (loading) {
    return (
      <div className="companies-grid-section">
        <h3 className="grid-title">EKRANDAKİ YERİNİZ</h3>
        <div className="loading-grid">
          <div className="loading-spinner"></div>
          <p>Firma logoları yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="companies-grid-section">
      <h3 className="grid-title">EKRANDAKİ YERİNİZ</h3>
      <div className="companies-grid">
        {/* Firmalar - adet miktarına göre sıralı */}
        {companies.map((company, index) => (
          <div key={company.id} className="company-cell" data-order={index + 1}>
            <div className="company-logo-container">
              {company.logoUrl ? (
                <img 
                  src={company.logoUrl.startsWith('/uploads/') ? `/api/files${company.logoUrl}` : `/api/files/logos/${company.logoUrl}`} 
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
            <div className="company-info">
              <span className="company-name">{company.companyName || 'Firma'}</span>
              <span className="order-quantity">{company.orderQuantity || 0} adet</span>
            </div>
          </div>
        ))}
        
        {/* Boş hücreler */}
        {Array.from({ length: emptyCells }, (_, index) => (
          <div key={`empty-${index}`} className="empty-cell">
            <span>LOGO</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyGrid;
