import React, { useState, useEffect } from 'react';
import './SlideManagement.css';

const SlideManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    imageFile: null
  });

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      const response = await fetch('/api/slides/all');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('Slide yükleme hatası:', error);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.imageFile) {
      alert('Lütfen bir resim dosyası seçin.');
      return;
    }

    setLoading(true);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.imageFile);

      const response = await fetch('/api/slides/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (response.ok) {
        setFormData({
          imageFile: null
        });
        setShowAddForm(false);
        fetchSlides();
        alert('Slide başarıyla eklendi!');
      } else {
        throw new Error('Slide ekleme başarısız');
      }
    } catch (error) {
      console.error('Slide ekleme hatası:', error);
      alert('Slide eklenirken hata oluştu: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteSlide = async (id) => {
    if (window.confirm('Bu slide\'ı silmek istediğinizden emin misiniz?')) {
      try {
        const response = await fetch(`/api/slides/${id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchSlides();
          alert('Slide başarıyla silindi!');
        } else {
          throw new Error('Slide silme başarısız');
        }
      } catch (error) {
        console.error('Slide silme hatası:', error);
        alert('Slide silinirken hata oluştu: ' + error.message);
      }
    }
  };

  return (
    <div className="slide-management">
      <div className="slide-header">
        <h2>Slide Yönetimi</h2>
        <button 
          className="add-slide-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? '❌ İptal' : '➕ Yeni Slide Ekle'}
        </button>
      </div>

      {showAddForm && (
        <div className="add-slide-form">
          <h3>Yeni Slide Ekle</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Resim Dosyası *</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, imageFile: e.target.files[0]})}
                required
              />
              <small>JPG, PNG, GIF formatları desteklenir. Maksimum 10MB.</small>
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? '⏳ Yükleniyor...' : '💾 Slide Ekle'}
            </button>
          </form>
        </div>
      )}

      <div className="slides-grid">
        {/* Her zaman test slide göster */}
        <div className="slide-card">
          <div className="slide-image">
            <div style={{
              width: '100%',
              height: '200px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px'
            }}>
              Test Slide 1
            </div>
          </div>
          <div className="slide-info">
            <h4>Test Slide Başlığı</h4>
            <p className="slide-description">Bu bir test slide'ıdır</p>
            <div className="slide-meta">
              <span className="company-info">🏢 Test Slide</span>
              <span className="display-order">Sıra: 1</span>
              <span className="status active">✅ Aktif</span>
            </div>
          </div>
          <div className="slide-actions">
            <button 
              className="delete-btn"
              onClick={() => alert('Test slide silindi!')}
            >
              🗑️ Sil
            </button>
          </div>
        </div>

        {/* Gerçek slide'lar varsa onları da göster */}
        {slides.map(slide => (
          <div key={slide.id} className="slide-card">
            <div className="slide-image">
              <img 
                src={`${slide.imageUrl}`} 
                alt={slide.title || 'Slide'} 
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
            <div className="slide-info">
              <h4>{slide.title || 'Slide Başlığı'}</h4>
              <p className="slide-description">{slide.description || 'Açıklama yok'}</p>
              <div className="slide-meta">
                <span className="company-info">🏢 Slide</span>
                <span className="display-order">Sıra: {slide.displayOrder || 1}</span>
                <span className={`status ${slide.isActive ? 'active' : 'inactive'}`}>
                  {slide.isActive ? '✅ Aktif' : '❌ Pasif'}
                </span>
              </div>
            </div>
            <div className="slide-actions">
              <button 
                className="delete-btn"
                onClick={() => deleteSlide(slide.id)}
              >
                🗑️ Sil
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SlideManagement;
