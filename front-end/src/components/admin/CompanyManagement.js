import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import './CompanyManagement.css';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [stats, setStats] = useState({ activeCompanyCount: 0, totalOrderQuantity: 0 });
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [showStats, setShowStats] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [qrForCompany, setQrForCompany] = useState(null);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [subscribeForm, setSubscribeForm] = useState({ fullName: '', email: '', phone: '' });

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

  const openQrForCompany = async (company) => {
    const payload = {
      companyName: company.companyName,
      address: company.address,
      instagramUrl: company.instagramUrl,
      twitterUrl: company.twitterUrl,
      linkedinUrl: company.linkedinUrl
    };
    const text = JSON.stringify(payload);
    try {
      const dataUrl = await QRCode.toDataURL(text, { width: 300, margin: 1 });
      setQrDataUrl(dataUrl);
      setQrForCompany(company);
    } catch (e) {
      console.error('QR üretilemedi', e);
      alert('QR üretilirken hata oluştu.');
    }
  };

  const submitSubscription = async (e) => {
    e.preventDefault();
    try {
      const body = { ...subscribeForm, companyTaxNumber: qrForCompany?.taxNumber };
      const res = await fetch('/api/subscriptions', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      if (res.ok) {
        alert('Kayıt alındı, fırsatlarda sizi bilgilendireceğiz.');
        setSubscribeForm({ fullName: '', email: '', phone: '' });
      } else {
        throw new Error('Kayıt başarısız');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  return (
    <div className="company-management">
      <div className="company-header">
        <h2>Firma Yönetimi</h2>
        <div className="header-actions">
          <input
            type="text"
            className="company-search-input"
            placeholder="Firma adına göre ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button 
            className="stats-toggle-btn"
            onClick={() => setShowStats(!showStats)}
          >
            {showStats ? '📊 İstatistikleri Gizle' : '📊 İstatistikleri Göster'}
          </button>
        </div>
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
        {(() => { const filtered = companies.filter(c => (c.companyName||'').toLowerCase().includes(searchQuery.toLowerCase())); return (
        <div className="section-header">
          <h3>Kayıtlı Firmalar ({filtered.length} / {companies.length})</h3>
          <div className="filter-info">
            <span className="active-count">✅ Aktif: {filtered.filter(c => c.isActive).length}</span>
            <span className="inactive-count">❌ Pasif: {filtered.filter(c => !c.isActive).length}</span>
          </div>
        </div> ) })()}

        <div className="companies-table-wrapper">
          <table className="companies-table">
            <thead>
              <tr>
                <th>Logo</th>
                <th>Firma Adı</th>
                <th>Vergi No</th>
                <th>Vergi Dairesi</th>
                <th>Sipariş Adeti</th>
                <th>Adres</th>
                <th>Durum</th>
                <th>Sosyal</th>
                <th>Aksiyonlar</th>
              </tr>
            </thead>
            <tbody>
              {companies
                .filter(c => (c.companyName||'').toLowerCase().includes(searchQuery.toLowerCase()))
                .map(company => (
                <tr key={company.taxNumber}>
                  <td>
                    <div className="table-logo">
                      {company.logoUrl ? (
                        <img src={company.logoUrl.startsWith('/uploads/logos/') ? `/api/files/logos/${company.logoUrl.split('/').pop()}` : `/api/files/logos/${company.logoUrl}`} alt={company.companyName} />
                      ) : (
                        <div className="no-logo">🏢</div>
                      )}
                    </div>
                  </td>
                  <td className="company-name-cell">{company.companyName}</td>
                  <td>{company.taxNumber}</td>
                  <td>{company.taxOffice}</td>
                  <td className="highlight">{company.orderQuantity}</td>
                  <td className="address-cell">{company.address}</td>
                  <td>
                    <span className={`status-badge ${company.isActive ? 'active' : 'inactive'}`}>
                      {company.isActive ? 'Aktif' : 'Pasif'}
                    </span>
                  </td>
                  <td>
                    <div className="social-links inline">
                      {company.instagramUrl && (
                        <a href={company.instagramUrl} target="_blank" rel="noopener noreferrer" className="social-link instagram">IG</a>
                      )}
                      {company.twitterUrl && (
                        <a href={company.twitterUrl} target="_blank" rel="noopener noreferrer" className="social-link twitter">X</a>
                      )}
                      {company.linkedinUrl && (
                        <a href={company.linkedinUrl} target="_blank" rel="noopener noreferrer" className="social-link linkedin">In</a>
                      )}
                    </div>
                  </td>
                  <td className="actions-cell">
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
                    <button 
                      className="view-btn"
                      onClick={() => openQrForCompany(company)}
                    >
                      🧾 QR
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {companies.length === 0 && (
            <div className="no-companies">
              <p>Henüz firma kaydı bulunmuyor.</p>
            </div>
          )}
        </div>
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

      {qrForCompany && (
        <div className="modal-overlay" onClick={() => setQrForCompany(null)}>
          <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>{qrForCompany.companyName} — QR Bilgileri</h3>
              <button className="close-modal" onClick={() => setQrForCompany(null)}>❌</button>
            </div>
            <div className="modal-body">
              <div style={{display:'flex', gap:20, alignItems:'flex-start', flexWrap:'wrap'}}>
                <img src={qrDataUrl} alt="QR" style={{width:220, height:220, background:'#fff', padding:10, borderRadius:12}} />
                <div>
                  <p><strong>Adres:</strong> {qrForCompany.address}</p>
                  {qrForCompany.instagramUrl && <p><strong>Instagram:</strong> <a href={qrForCompany.instagramUrl} target="_blank" rel="noreferrer">{qrForCompany.instagramUrl}</a></p>}
                  {qrForCompany.twitterUrl && <p><strong>Twitter:</strong> <a href={qrForCompany.twitterUrl} target="_blank" rel="noreferrer">{qrForCompany.twitterUrl}</a></p>}
                  {qrForCompany.linkedinUrl && <p><strong>LinkedIn:</strong> <a href={qrForCompany.linkedinUrl} target="_blank" rel="noreferrer">{qrForCompany.linkedinUrl}</a></p>}
                </div>
              </div>
              <hr style={{borderColor:'rgba(255,255,255,0.2)'}} />
              <h4>Fırsatları yakalayın</h4>
              <form onSubmit={submitSubscription} className="edit-form">
                <div className="form-row">
                  <label>Ad Soyad</label>
                  <input value={subscribeForm.fullName} onChange={(e)=>setSubscribeForm({...subscribeForm, fullName:e.target.value})} required />
                </div>
                <div className="form-row-inline">
                  <div>
                    <label>E-posta</label>
                    <input type="email" value={subscribeForm.email} onChange={(e)=>setSubscribeForm({...subscribeForm, email:e.target.value})} required />
                  </div>
                  <div>
                    <label>Telefon</label>
                    <input value={subscribeForm.phone} onChange={(e)=>setSubscribeForm({...subscribeForm, phone:e.target.value})} />
                  </div>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="submit-btn">Fırsatları Yakalayın</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagement;
