import React, { useState, useEffect } from 'react';
import './SlideManagement.css';

const SlideManagement = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    imageFile: null
  });
  const [editSlide, setEditSlide] = useState(null);

  useEffect(() => {
    fetchSlides();
  }, []);

  const fetchSlides = async () => {
    try {
      console.log('Slide verileri yükleniyor...');
      const response = await fetch('/api/slides/all');
      console.log('Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Gelen slide verileri:', data);
        setSlides(data);
      } else {
        console.error('Slide yükleme başarısız:', response.status);
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
        console.log('Slide siliniyor:', id);
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

  const openEdit = (slide) => {
    setEditSlide({
      id: slide.id,
      title: slide.title || '',
      description: slide.description || '',
      displayOrder: slide.displayOrder || 0,
      isActive: slide.isActive === true
    });
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!editSlide) return;
    try {
      const response = await fetch(`/api/slides/${editSlide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editSlide.title,
          description: editSlide.description,
          displayOrder: Number(editSlide.displayOrder) || 0,
          imageUrl: slides.find(s=>s.id===editSlide.id)?.imageUrl,
          isActive: !!editSlide.isActive
        })
      });
      if (response.ok) {
        setEditSlide(null);
        fetchSlides();
        alert('Slide güncellendi');
      } else {
        throw new Error('Güncelleme başarısız');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
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

      <div className="slides-table-wrapper">
        <table className="slides-table">
          <thead>
            <tr>
              <th>Görsel</th>
              <th>Başlık</th>
              <th>Açıklama</th>
              <th>Sıra</th>
              <th>Durum</th>
              <th>Aksiyonlar</th>
            </tr>
          </thead>
          <tbody>
            {slides.map(slide => (
              <tr key={slide.id}>
                <td>
                  <div className="slide-thumb">
                    <img src={`${slide.imageUrl}`} alt={slide.title || 'Slide'} onError={(e)=>{e.target.style.display='none';}} />
                  </div>
                </td>
                <td className="title-cell">{slide.title || 'Slide Başlığı'}</td>
                <td className="desc-cell">{slide.description || 'Açıklama yok'}</td>
                <td className="order-cell">{slide.displayOrder || 0}</td>
                <td>
                  <span className={`status-badge ${slide.isActive ? 'active' : 'inactive'}`}>
                    {slide.isActive ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="view-btn" onClick={() => openEdit(slide)}>✏️ Güncelle</button>
                  <button className="delete-btn" onClick={() => deleteSlide(slide.id)}>🗑️ Sil</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editSlide && (
        <div className="modal-overlay" onClick={() => setEditSlide(null)}>
          <div className="modal-content" onClick={(e)=>e.stopPropagation()}>
            <div className="modal-header">
              <h3>Slide Düzenle</h3>
              <button className="close-modal" onClick={() => setEditSlide(null)}>❌</button>
            </div>
            <form onSubmit={submitEdit} className="edit-form">
              <div className="form-row">
                <label>Başlık</label>
                <input value={editSlide.title} onChange={(e)=>setEditSlide({...editSlide,title:e.target.value})} />
              </div>
              <div className="form-row">
                <label>Açıklama</label>
                <textarea rows="3" value={editSlide.description} onChange={(e)=>setEditSlide({...editSlide,description:e.target.value})} />
              </div>
              <div className="form-row-inline">
                <div>
                  <label>Sıra</label>
                  <input type="number" value={editSlide.displayOrder} onChange={(e)=>setEditSlide({...editSlide,displayOrder:e.target.value})} />
                </div>
                <div className="switch">
                  <label>Durum</label>
                  <select value={editSlide.isActive ? '1':'0'} onChange={(e)=>setEditSlide({...editSlide,isActive:e.target.value==='1'})}>
                    <option value="1">Aktif</option>
                    <option value="0">Pasif</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="delete-btn" onClick={()=>setEditSlide(null)}>İptal</button>
                <button type="submit" className="submit-btn">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideManagement;