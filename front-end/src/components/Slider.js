import React, { useState, useEffect } from 'react';
import './Slider.css';

const Slider = () => {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length > 0) {
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 3000); // 3 saniye

      return () => clearInterval(interval);
    }
  }, [slides]);

  const fetchSlides = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/slides');
      if (response.ok) {
        const data = await response.json();
        setSlides(data);
      }
    } catch (error) {
      console.error('Slider verileri çekilirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
  };

  if (loading) {
    return (
      <section className="slider-section">
        <div className="slider-container">
          <div className="slider-loading">
            <div className="loading-spinner"></div>
            <span>Slider yükleniyor...</span>
          </div>
        </div>
      </section>
    );
  }

  if (slides.length === 0) {
    return (
      <section className="slider-section">
        <div className="slider-container">
          <div className="slider-empty">
            <span>Henüz slide eklenmemiş</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="slider-section">
      <div className="slider-container">
        <div className="slider-wrapper">
          <div className="slider-track" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {slides.map((slide, index) => (
              <div key={slide.id} className="slide-item">
                    <img 
                      src={`http://localhost:8080${encodeURI(slide.imageUrl)}`} 
                      alt={slide.title}
                      className="slide-image"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        display: 'block'
                      }}
                      onError={(e) => {
                        console.error('Resim yüklenemedi:', e.target.src);
                        // Boşluksuz URL ile tekrar dene
                        const cleanUrl = slide.imageUrl.replace(/\s+/g, '_');
                        e.target.src = `http://localhost:8080${cleanUrl}`;
                      }}
                      onLoad={() => {
                        console.log('Resim başarıyla yüklendi:', slide.title);
                      }}
                    />
                <div className="slide-fallback" style={{ display: 'none' }}>
                  <span>📷 Resim yüklenemedi</span>
                </div>
              </div>
            ))}
          </div>
          
          {/* Navigation buttons */}
          <button className="slider-nav slider-prev" onClick={goToPrevious}>
            ❮
          </button>
          <button className="slider-nav slider-next" onClick={goToNext}>
            ❯
          </button>
          
          {/* Dots indicator */}
          <div className="slider-dots">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`slider-dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Slider;
