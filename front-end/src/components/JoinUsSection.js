import React, { useState } from 'react';
import './JoinUsSection.css';

const JoinUsSection = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    taxNumber: '',
    address: '',
    instagramUrl: '',
    twitterUrl: '',
    linkedinUrl: '',
    orderQuantity: '',
    logoFile: null
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Dosya formatını kontrol et
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        setError('Sadece JPG, PNG ve SVG formatları kabul edilir.');
        return;
      }
      
      // Dosya boyutunu kontrol et (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Dosya boyutu 5MB\'dan küçük olmalıdır.');
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        logoFile: file
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Sipariş adeti kontrolü
    const orderQuantity = parseInt(formData.orderQuantity);
    if (orderQuantity < 100) {
      setError('Minimum 100 adet sipariş verebilirsiniz. Lütfen sipariş adetini 100 veya üzeri olarak girin.');
      setLoading(false);
      return;
    }

    try {
      // Logo yükleme
      let logoUrl = '';
      if (formData.logoFile) {
        const logoFormData = new FormData();
        logoFormData.append('file', formData.logoFile);
        logoFormData.append('taxNumber', formData.taxNumber);

        const logoResponse = await fetch('http://localhost:9095/api/files/upload/logo', {
          method: 'POST',
          body: logoFormData
        });

        if (!logoResponse.ok) {
          throw new Error('Logo yükleme başarısız');
        }

        const logoData = await logoResponse.json();
        logoUrl = logoData.fileUrl;
      }

      // Firma bilgilerini kaydetme
      const companyData = {
        taxNumber: formData.taxNumber,
        companyName: formData.companyName,
        address: formData.address,
        instagramUrl: formData.instagramUrl,
        twitterUrl: formData.twitterUrl,
        linkedinUrl: formData.linkedinUrl,
        orderQuantity: parseInt(formData.orderQuantity) || 0,
        logoUrl: logoUrl
      };

      const response = await fetch('http://localhost:9095/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(companyData)
      });

      if (response.ok) {
        setSuccess(true);
        setFormData({
          companyName: '',
          taxNumber: '',
          address: '',
          instagramUrl: '',
          twitterUrl: '',
          linkedinUrl: '',
          orderQuantity: '',
          logoFile: null
        });
        // File input'u temizle
        document.getElementById('logoFile').value = '';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Kayıt başarısız');
      }
    } catch (err) {
      console.error('Form gönderme hatası:', err);
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="sizde-katilin" className="join-us-section">
      <div className="join-header">
        <h1 className="page-title">Sizde Katılın</h1>
        <p className="page-subtitle">
          AquaShare hareketinin bir parçası olun ve sosyal sorumluluğunuzu gösterin
        </p>
      </div>
      
      <div className="join-content">
        <div className="company-info-section">
          <h2 className="section-title">SİZDE KATILIN</h2>
          
          <form onSubmit={handleSubmit} className="company-form">
            <div className="info-grid">
              <div className="info-item">
                <label htmlFor="companyName">FİRMA ÜNVANI *</label>
                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Şirket Adı"
                  required
                />
              </div>
              
              <div className="info-item">
                <label htmlFor="taxNumber">FİRMA VERGİ NO V.D. *</label>
                <input
                  type="text"
                  id="taxNumber"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Vergi Numarası"
                  required
                />
              </div>
              
              <div className="info-item">
                <label htmlFor="address">FİRMA ADRESİ *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Adres Bilgisi"
                  rows="3"
                  required
                />
              </div>
              
              <div className="info-item">
                <label>SOSYAL MEDYA</label>
                <div className="social-inputs">
                  <input
                    type="url"
                    name="instagramUrl"
                    value={formData.instagramUrl}
                    onChange={handleInputChange}
                    className="social-input"
                    placeholder="Instagram URL"
                  />
                  <input
                    type="url"
                    name="twitterUrl"
                    value={formData.twitterUrl}
                    onChange={handleInputChange}
                    className="social-input"
                    placeholder="X (Twitter) URL"
                  />
                  <input
                    type="url"
                    name="linkedinUrl"
                    value={formData.linkedinUrl}
                    onChange={handleInputChange}
                    className="social-input"
                    placeholder="LinkedIn URL"
                  />
                </div>
              </div>
              
              <div className="info-item">
                <label htmlFor="orderQuantity">SİPARİŞ ADETİ *</label>
                <input
                  type="number"
                  id="orderQuantity"
                  name="orderQuantity"
                  value={formData.orderQuantity}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Minimum 100 adet"
                  min="100"
                  required
                />
                <small className="field-info">Minimum 100 adet sipariş verebilirsiniz</small>
              </div>

              <div className="info-item logo-upload">
                <label htmlFor="logoFile">FİRMA LOGOSU</label>
                <div className="file-upload-container">
                  <input
                    type="file"
                    id="logoFile"
                    name="logoFile"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.svg"
                    className="file-input"
                  />
                  <label htmlFor="logoFile" className="file-upload-label">
                    {formData.logoFile ? formData.logoFile.name : 'Logo Seç (JPG, PNG, SVG)'}
                  </label>
                  <small className="file-info">Maksimum 5MB, JPG/PNG/SVG formatları</small>
                </div>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">Başvurunuz başarıyla gönderildi!</div>}

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Başvuru Gönder'}
              </button>
            </div>
          </form>
        </div>
        
        <div className="cta-section">
          <div className="cta-content">
            <h3 className="cta-title">Bir Yudum İyilik Harekitine Sende Katıl</h3>
            <div className="contact-info">
              <div className="reservation">
                <span className="reservation-label">REZERVASYON</span>
                <a href="https://www.biryudumiyilikharekit.com" className="website">www.biryudumiyilikharekit.com</a>
                <span className="separator">/</span>
                <a href="tel:+905333333333" className="phone">0 533 333 33 33</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinUsSection;