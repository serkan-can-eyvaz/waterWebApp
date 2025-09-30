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
      const response = await fetch('http://localhost:8080/api/slides/all');
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

      const response = await fetch('http://localhost:8080/api/slides/upload', {
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
        const response = await fetch(`http://localhost:8080/api/slides/${id}`, {
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
        {slides.map(slide => (
          <div key={slide.id} className="slide-card">
            <div className="slide-image">
              <img src={`http://localhost:8080${slide.imageUrl}`} alt={slide.title} />
            </div>
            <div className="slide-info">
              <h4>{slide.title}</h4>
              <p className="slide-description">{slide.description}</p>
              <div className="slide-meta">
                <span className="company-info">
                  🏢 Slide
                </span>
                <span className="display-order">Sıra: {slide.displayOrder}</span>
                <span className={`status ${slide.isActive ? 'active' : 'inactive'}`}>
                  {slide.isActive ? '✅ Aktif' : '❌ Pasif'}
                </span>
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
          </div>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="no-slides">
          <p>Henüz slide eklenmemiş.</p>
        </div>
      )}
    </div>
  );
};

export default SlideManagement;
