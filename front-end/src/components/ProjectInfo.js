import React from 'react';
import './ProjectInfo.css';

const ProjectInfo = () => {
  return (
    <section className="project-info">
      <div className="container">
        <div className="project-description">
          <div className="intro-section">
            <h3 className="intro-title">birdamlapaylas.com</h3>
            <p className="intro-slogan">"Bir Damla Paylaş, Dünyayı Değiştir"</p>
            <p className="intro-text">
              Susuz kaldığınız bir anda, elinize ücretsiz bir şişe su geçtiğini düşünün. Sadece susuzluğunuzu gidermiyor; aynı zamanda bir paylaşım hareketinin parçası oluyorsunuz.
            </p>
          </div>

          <div className="goal-section">
            <p className="goal-text">
              birdamlapaylas.com, Konya'da başlayan ve kısa sürede tüm Türkiye'ye yayılmayı hedefleyen bir sosyal sorumluluk projesidir. Amacımız, suyu herkes için ulaşılabilir kılarken, sponsor markalara da güçlü bir görünürlük sağlamaktır.
            </p>
          </div>

          <div className="benefits-section">
            <h4 className="benefits-title">Neden birdamlapaylas.com?</h4>
            <div className="benefits-grid">
              <div className="benefit-item">
                <h5 className="benefit-subtitle">Yaşam Kaynağı</h5>
                <p>Su, hayatın temelidir. Onu ücretsiz paylaşmak, toplumsal dayanışmayı güçlendirir.</p>
              </div>
              <div className="benefit-item">
                <h5 className="benefit-subtitle">Sosyal Fayda</h5>
                <p>birdamlapaylas.com, reklamı bir iyilik aracına dönüştürür. Her dağıtılan şişe, hem insanlara fayda sağlar hem de markaların toplumla bağını kuvvetlendirir.</p>
              </div>
              <div className="benefit-item">
                <h5 className="benefit-subtitle">Sürdürülebilirlik</h5>
                <p>Geri dönüştürülebilir şişeler ve çevre dostu mesajlarla doğayı da korur.</p>
              </div>
            </div>
          </div>

          <div className="value-section">
            <h4 className="value-title">Markalar İçin Değer</h4>
            <div className="value-grid">
              <div className="value-item">
                <h5 className="value-subtitle">Doğrudan Etkileşim</h5>
                <p>birdamlapaylas.com şişeler, tüketiciyle en doğal temas noktasıdır.</p>
              </div>
              <div className="value-item">
                <h5 className="value-subtitle">İtibar ve Güven</h5>
                <p>Sosyal sorumluluk desteği veren markalar, toplumun gözünde değer kazanır.</p>
              </div>
              <div className="value-item">
                <h5 className="value-subtitle">Dijital Bağlantı</h5>
                <p>QR kodlar sayesinde markalar, tüketicileri kampanyalara, indirimlere veya sosyal içeriklere yönlendirebilir.</p>
              </div>
            </div>
          </div>

          <div className="konya-section">
            <h4 className="konya-title">İlk Adım Konya'da</h4>
            <p className="konya-text">
              Türkiye'nin en dinamik şehirlerinden biri olan Konya, genç nüfusu, üniversite kampüsleri ve kalabalık yaşam alanlarıyla birdamlapaylas.com'nin ilk durağı. 
              Meydanlarda, festivallerde ve etkinliklerde dağıtılacak ücretsiz sular, iyilik ve paylaşımın sembolü olacak.
            </p>
            <p className="konya-conclusion">
              birdamlapaylas.com sadece bir şişe su değil, toplumsal dayanışmanın simgesidir. Bugün Konya'da başlıyor, yarın tüm Türkiye'de yayılacak. 
              "Bir damla paylaş, dünyayı değiştir."
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectInfo;
