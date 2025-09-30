import React, { useState, useEffect } from 'react';
import './Statistics.css';

const Statistics = () => {
  const [statistics, setStatistics] = useState({
    totalCompanies: 0,
    totalOrderQuantity: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics/dashboard');
      if (!response.ok) {
        throw new Error('İstatistikler yüklenemedi');
      }
      const data = await response.json();
      setStatistics(data);
      setLoading(false);
    } catch (err) {
      console.error('İstatistik hatası:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const AnimatedCounter = ({ end, duration = 2000, className }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      let startTime;
      const startCount = 0;
      const endCount = end;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const currentCount = Math.floor(progress * (endCount - startCount) + startCount);
        
        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(updateCount);
        }
      };

      requestAnimationFrame(updateCount);
    }, [end, duration]);

    return <span className={className}>{count.toLocaleString()}</span>;
  };

  if (loading) {
    return (
      <section className="statistics-section">
        <div className="statistics-container">
          <div className="statistic-item">
            <div className="loading-spinner"></div>
            <div className="statistic-label">Yükleniyor...</div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="statistics-section">
        <div className="statistics-container">
          <div className="statistic-item">
            <div className="error-message">⚠️ {error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="statistics-section">
      <div className="statistics-container">
        <div className="statistic-item">
          <div className="circular-counter">
            <div className="counter-circle pink">
              <div className="counter-inner">
                <div className="counter-value">
                  <AnimatedCounter 
                    end={statistics.totalCompanies} 
                    duration={2500}
                    className="statistic-number pink"
                  />
                </div>
                <div className="counter-label pink">Firma</div>
              </div>
            </div>
            <div className="counter-title">Katılımcı Sayısı</div>
          </div>
        </div>
        
        <div className="statistic-item">
          <div className="circular-counter">
            <div className="counter-circle teal">
              <div className="counter-inner">
                <div className="counter-value">
                  <AnimatedCounter 
                    end={statistics.totalOrderQuantity} 
                    duration={3000}
                    className="statistic-number teal"
                  />
                </div>
                <div className="counter-label teal">Adet</div>
              </div>
            </div>
            <div className="counter-title">Dağıtılan Su ve İkram</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
