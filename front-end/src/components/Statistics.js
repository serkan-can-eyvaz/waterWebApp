import React from 'react';
import './Statistics.css';

const Statistics = () => {
  return (
    <section className="statistics-section">
      <div className="statistics-container">
        <div className="statistic-item">
          <h3 className="statistic-label">Katılımcı Sayısı</h3>
          <div className="statistic-value pink">228</div>
          <div className="statistic-unit pink">Firma</div>
        </div>
        
        <div className="statistic-item">
          <h3 className="statistic-label">Dağıtılan Su ve İkram Sayısı</h3>
          <div className="statistic-value green">22800</div>
          <div className="statistic-unit green">Adet</div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
