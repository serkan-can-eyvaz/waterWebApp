import React, { useState } from 'react';
import './CompanyManagement.css';

const QrInbox = () => {
  const [taxNumber, setTaxNumber] = useState('');
  const [company, setCompany] = useState(null);
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const search = async () => {
    if (!taxNumber) return;
    setLoading(true);
    try {
      console.log('Aranan vergi no:', taxNumber);
      
      const [qrRes, subsRes] = await Promise.all([
        fetch(`/api/qr-info/${taxNumber}`),
        fetch(`/api/subscriptions/company/${taxNumber}`)
      ]);
      
      console.log('QR Response status:', qrRes.status);
      console.log('Subscriptions Response status:', subsRes.status);
      
      const qr = qrRes.ok ? await qrRes.json() : null;
      const subsJson = subsRes.ok ? await subsRes.json() : [];
      
      console.log('QR Data:', qr);
      console.log('Subscriptions Data:', subsJson);
      
      setCompany(qr);
      setSubs(Array.isArray(subsJson) ? subsJson : []);
    } catch (e) {
      console.error('Search error:', e);
    } finally {
      setLoading(false);
    }
  };

  const normalizeDate = (value) => {
    if (!value) return null;
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d;
  };

  const displaySubs = subs.filter(s => {
    const text = `${s.fullName||''} ${s.email||''} ${s.phone||''}`.toLowerCase();
    const matchText = searchText.trim() === '' || text.includes(searchText.toLowerCase());
    if (!matchText) return false;
    const from = normalizeDate(dateFrom);
    const to = normalizeDate(dateTo);
    if (!from && !to) return true;
    const created = s.createdAt ? new Date(s.createdAt) : null;
    if (!created) return false;
    if (from && created < new Date(from.setHours(0,0,0,0))) return false;
    if (to && created > new Date(to.setHours(23,59,59,999))) return false;
    return true;
  });

  const exportCsv = () => {
    console.log('Export CSV - displaySubs:', displaySubs);
    console.log('Export CSV - taxNumber:', taxNumber);
    console.log('Export CSV - subs length:', displaySubs.length);
    console.log('Export CSV - subs (original):', subs);
    console.log('Export CSV - subs length (original):', subs.length);
    
    // Excel uyumlu tarih formatı
    const formatDateForExcel = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      // Excel'in tanıyacağı format: YYYY-MM-DD HH:MM:SS
      return date.toISOString().replace('T', ' ').substring(0, 19);
    };

    // Excel uyumlu field escaping - sadece gerekli alanları tırnak içine al
    const escapeField = (field) => {
      if (field === null || field === undefined) return '';
      const str = String(field);
      // Virgül, tırnak, yeni satır içeren alanları tırnak içine al
      if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Header satırı - her sütun ayrı
    const headerRow = [
      'Ad Soyad',
      'E-posta', 
      'Telefon',
      'Kayıt Zamanı',
      'Vergi No'
    ];

    // Data satırları - her bilgi ayrı hücrede
    // Eğer displaySubs boşsa, orijinal subs verisini kullan
    const dataToExport = displaySubs.length > 0 ? displaySubs : subs;
    console.log('Data to export:', dataToExport);
    
    // Eğer subscription verisi yoksa, firma bilgisini CSV'ye yaz
    let dataRows = [];
    
    if (dataToExport.length > 0) {
      // Subscription verileri var
      dataRows = dataToExport.map(s => {
        console.log('Processing subscription:', s);
        return [
          escapeField(s.fullName || ''),
          escapeField(s.email || ''),
          escapeField(s.phone || ''),
          escapeField(formatDateForExcel(s.createdAt)),
          escapeField(taxNumber || '')
        ];
      });
    } else if (company) {
      // Sadece firma bilgisi var, subscription yok
      console.log('No subscriptions found, using company info:', company);
      dataRows = [[
        escapeField(''),
        escapeField(''),
        escapeField(''),
        escapeField(''),
        escapeField(taxNumber || '')
      ]];
    } else {
      alert('Bu vergi numarasına ait kayıt bulunamadı. Lütfen başka bir vergi numarası deneyin.');
      return;
    }

    console.log('Data rows:', dataRows);

    // Tüm satırları birleştir
    const allRows = [headerRow, ...dataRows];
    
    // Her satırı virgülle ayır, her satırı yeni satırla ayır
    const csv = allRows.map(row => row.join(',')).join('\r\n');
    
    console.log('Final CSV:', csv);
    
    // UTF-8 BOM ile Excel uyumlu encoding
    const blob = new Blob(["\uFEFF" + csv], { 
      type: 'text/csv;charset=utf-8;' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-kayitlari_${taxNumber || 'tum'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="company-management">
      <div className="company-header">
        <h2>QR Kayıtları</h2>
        <div className="header-actions" style={{flexWrap:'wrap'}}>
          <input className="company-search-input" value={taxNumber} onChange={e=>setTaxNumber(e.target.value)} placeholder="Vergi No ile ara" />
          <input className="company-search-input" value={searchText} onChange={e=>setSearchText(e.target.value)} placeholder="İsim/e‑posta/telefon ara" />
          <input className="company-search-input" type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} />
          <input className="company-search-input" type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} />
          <button className="stats-toggle-btn" onClick={search}>Ara</button>
          <button className="view-btn" onClick={exportCsv}>CSV Dışa Aktar</button>
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
            {displaySubs.length === 0 && (
              <tr><td colSpan="4" style={{color:'#fff', padding:14}}>Kayıt bulunamadı.</td></tr>
            )}
            {displaySubs.map(s => (
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


