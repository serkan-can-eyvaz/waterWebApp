import React, { useState, useEffect } from 'react';
import './CompanyManagement.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({ activeCompanyCount: 0, totalOrderQuantity: 0 });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    fetchCompanies();
    fetchStats();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await fetch('/api/companies/all');
      if (response.ok) {
        const data = await response.json();
        setCompanies(data);
      }
    } catch (error) {
      console.error('Firma yükleme hatası:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/companies/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('İstatistik yükleme hatası:', error);
    }
  };

  const deleteCompany = async (taxNumber) => {
    if (window.confirm('Bu firmayı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/companies/${taxNumber}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchCompanies();
          fetchStats();
          alert('Firma başarıyla silindi!');
        } else {
          throw new Error('Firma silme başarısız');
        }
      } catch (error) {
        console.error('Firma silme hatası:', error);
        alert('Firma silinirken hata oluştu: ' + error.message);
      }
    }
  };

  const toggleCompanyStatus = async (company) => {
    try {
      const updatedCompany = {
        ...company,
        isActive: !company.isActive
      };

      const response = await fetch(`/api/companies/${company.taxNumber}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedCompany)
      });

      if (response.ok) {
        fetchCompanies();
        fetchStats();
        alert(`Firma ${updatedCompany.isActive ? 'aktif' : 'pasif'} yapıldı!`);
      } else {
        throw new Error('Firma güncelleme başarısız');
      }
    } catch (error) {
      console.error('Firma güncelleme hatası:', error);
      alert('Firma güncellenirken hata oluştu: ' + error.message);
    }
  };

  return (
    <div className="company-management">
      <div className="company-header">
        <h2>Firma Yönetimi</h2>
        <button 
          className="stats-toggle-btn"
          onClick={() => setShowStats(!showStats)}
        >
          {showStats ? '📊 İstatistikleri Gizle' : '📊 İstatistikleri Göster'}
        </button>
      </div>

      {showStats && (
        <div className="stats-section">
          <h3>Genel İstatistikler</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">🏢</div>
              <div className="stat-info">
                <div className="stat-number">{stats.activeCompanyCount}</div>
                <div className="stat-label">Aktif Firma</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-info">
                <div className="stat-number">{stats.totalOrderQuantity.toLocaleString()}</div>
                <div className="stat-label">Toplam Sipariş</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="companies-section">
        <div className="section-header">
          <h3>Kayıtlı Firmalar ({companies.length})</h3>
          <div className="filter-info">
            <span className="active-count">✅ Aktif: {companies.filter(c => c.isActive).length}</span>
            <span className="inactive-count">❌ Pasif: {companies.filter(c => !c.isActive).length}</span>
          </div>
        </div>

        <div className="companies-grid">
          {companies.map(company => (
            <div key={company.taxNumber} className="company-card">
              <div className="company-header-card">
                <div className="company-logo">
                  {company.logoUrl ? (
                    <img src={company.logoUrl.startsWith('/uploads/') ? `/api/files${company.logoUrl}` : `/api/files/logos/${company.logoUrl}`} alt={company.companyName} />
                  ) : (
                    <div className="no-logo">🏢</div>
                  )}
                </div>
                <div className="company-status">
                  <span className={`status-badge ${company.isActive ? 'active' : 'inactive'}`}>
                    {company.isActive ? '✅ Aktif' : '❌ Pasif'}
                  </span>
                </div>
              </div>

              <div className="company-info">
                <h4 className="company-name">{company.companyName}</h4>
                <div className="company-details">
                  <div className="detail-item">
                    <span className="detail-label">Vergi No:</span>
                    <span className="detail-value">{company.taxNumber}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Vergi Dairesi:</span>
                    <span className="detail-value">{company.taxOffice}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Sipariş Adeti:</span>
                    <span className="detail-value highlight">{company.orderQuantity}</span>
                  </div>
                  <div className="detail-item full-width">
                    <span className="detail-label">Adres:</span>
                    <span className="detail-value">{company.address}</span>
                  </div>
                </div>

                <div className="social-links">
                  {company.instagramUrl && (
                    <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link instagram">
                      📷 Instagram
                    </a>
                  )}
                  {company.twitterUrl && (
                    <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-link twitter">
                      🐦 Twitter
                    </a>
                  )}
                  {company.linkedinUrl && (
                    <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link linkedin">
                      💼 LinkedIn
                    </a>
                  )}
                </div>
              </div>

              <div className="company-actions">
                <button 
                  className={`toggle-btn ${company.isActive ? 'deactivate' : 'activate'}`}
                  onClick={() => toggleCompanyStatus(company)}
                >
                  {company.isActive ? '❌ Pasif Yap' : '✅ Aktif Yap'}
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => deleteCompany(company.taxNumber)}
                >
                  🗑️ Sil
                </button>
                <button 
                  className="view-btn"
                  onClick={() => setSelectedCompany(company)}
                >
                  👁️ Detay
                </button>
              </div>
            </div>
          ))}
        </div>

        {companies.length === 0 && (
          <div className="no-companies">
            <p>Henüz firma kaydı bulunmuyor.</p>
          </div>
        )}
      </div>

      {selectedCompany && (
        <div className="modal-overlay" onClick={() => setSelectedCompany(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedCompany.companyName} - Detay Bilgileri</h3>
              <button className="close-modal" onClick={() => setSelectedCompany(null)}>
                ❌
              </button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-section">
                  <h4>Firma Bilgileri</h4>
                  <p><strong>Firma Adı:</strong> {selectedCompany.companyName}</p>
                  <p><strong>Vergi Numarası:</strong> {selectedCompany.taxNumber}</p>
                  <p><strong>Vergi Dairesi:</strong> {selectedCompany.taxOffice}</p>
                  <p><strong>Durum:</strong> <span className={selectedCompany.isActive ? 'active' : 'inactive'}>
                    {selectedCompany.isActive ? 'Aktif' : 'Pasif'}
                  </span></p>
                </div>
                <div className="detail-section">
                  <h4>İletişim Bilgileri</h4>
                  <p><strong>Adres:</strong> {selectedCompany.address}</p>
                  <p><strong>Sipariş Adeti:</strong> {selectedCompany.orderQuantity}</p>
                  {selectedCompany.logoUrl && (
                    <p><strong>Logo:</strong> <a href={`${selectedCompany.logoUrl}`} target="_blank" rel="noopener noreferrer">Logo Görüntüle</a></p>
                  )}
                </div>
                <div className="detail-section">
                  <h4>Sosyal Medya</h4>
                  {selectedCompany.instagramUrl && <p><strong>Instagram:</strong> <a href={selectedCompany.instagramUrl} target="_blank" rel="noopener noreferrer">{selectedCompany.instagramUrl}</a></p>}
                  {selectedCompany.twitterUrl && <p><strong>Twitter:</strong> <a href={selectedCompany.twitterUrl} target="_blank" rel="noopener noreferrer">{selectedCompany.twitterUrl}</a></p>}
                  {selectedCompany.linkedinUrl && <p><strong>LinkedIn:</strong> <a href={selectedCompany.linkedinUrl} target="_blank" rel="noopener noreferrer">{selectedCompany.linkedinUrl}</a></p>}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
