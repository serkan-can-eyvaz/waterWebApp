import React, { useEffect, useState } from 'react';
import './CompanyManagement.css';

const QrInbox = () => {
  const [taxNumber, setTaxNumber] = useState('');
  const [company, setCompany] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!taxNumber) return;
    setLoading(true);
    try {
      const [qrRes, subsRes] = await Promise.all([
        fetch(`/api/qr-info/${taxNumber}`),
        fetch(`/api/subscriptions/company/${taxNumber}`)
      ]);
      const qr = qrRes.ok ? await qrRes.json() : null;
      const subsJson = subsRes.ok ? await subsRes.json() : [];
      setCompany(qr);
      setSubs(Array.isArray(subsJson) ? subsJson : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="company-management">
      <div className="company-header">
        <h2>QR Kayıtları</h2>
        <div className="header-actions">
          <input className="company-search-input" value={taxNumber} onChange={e=>setTaxNumber(e.target.value)} placeholder="Vergi No ile ara" />
          <button className="stats-toggle-btn" onClick={search}>Ara</button>
        </div>
      </div>

      {loading && <div style={{color:'#fff'}}>Yükleniyor...</div>}

      {company && (
        <div className="companies-table-wrapper">
          <table className="companies-table">
            <thead>
              <tr>
                <th>Vergi No</th>
                <th>Firma</th>
                <th>Adres</th>
                <th>Sosyal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{company.companyTaxNumber}</td>
                <td className="company-name-cell">{company.companyName}</td>
                <td className="address-cell">{company.address}</td>
                <td>
                  <div className="social-links inline">
                    {company.instagramUrl && <a href={company.instagramUrl} target="_blank" rel="noreferrer" className="social-link instagram">IG</a>}
                    {company.twitterUrl && <a href={company.twitterUrl} target="_blank" rel="noreferrer" className="social-link twitter">X</a>}
                    {company.linkedinUrl && <a href={company.linkedinUrl} target="_blank" rel="noreferrer" className="social-link linkedin">In</a>}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      <div className="companies-table-wrapper" style={{marginTop:20}}>
        <table className="companies-table">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Kayıt Zamanı</th>
            </tr>
          </thead>
          <tbody>
            {subs.length === 0 && (
              <tr><td colSpan="4" style={{color:'#fff', padding:14}}>Kayıt bulunamadı.</td></tr>
            )}
            {subs.map(s => (
              <tr key={s.id}>
                <td className="company-name-cell">{s.fullName}</td>
                <td>{s.email}</td>
                <td>{s.phone}</td>
                <td>{s.createdAt || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default QrInbox;


