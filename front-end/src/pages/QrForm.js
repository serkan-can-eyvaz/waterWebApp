import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ProjectDetails.css';

const QrForm = () => {
  const { taxNumber } = useParams();
  const [qrInfo, setQrInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/qr-info/${taxNumber}`);
        if (res.ok) {
          const data = await res.json();
          setQrInfo(data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [taxNumber]);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const resp = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, companyTaxNumber: taxNumber })
      });
      if (resp.ok) {
        setSent(true);
      } else {
        alert('Kayıt başarısız');
      }
    } catch (err) {
      alert('Hata: ' + err.message);
    }
  };

  if (loading) return <div style={{padding:20,color:'#fff'}}>Yükleniyor...</div>;

  return (
    <div className="project-details" style={{paddingTop:40}}>
      <div className="container">
        <h2 className="section-title">Firma Bilgileri</h2>
        {qrInfo ? (
          <div style={{background:'rgba(255,255,255,0.1)',borderRadius:12,padding:20,marginBottom:20}}>
            <p><strong>Firma:</strong> {qrInfo.companyName}</p>
            <p><strong>Adres:</strong> {qrInfo.address}</p>
            {qrInfo.instagramUrl && <p><strong>Instagram:</strong> <a href={qrInfo.instagramUrl} target="_blank" rel="noreferrer">{qrInfo.instagramUrl}</a></p>}
            {qrInfo.twitterUrl && <p><strong>Twitter:</strong> <a href={qrInfo.twitterUrl} target="_blank" rel="noreferrer">{qrInfo.twitterUrl}</a></p>}
            {qrInfo.linkedinUrl && <p><strong>LinkedIn:</strong> <a href={qrInfo.linkedinUrl} target="_blank" rel="noreferrer">{qrInfo.linkedinUrl}</a></p>}
          </div>
        ) : (
          <div style={{color:'#fff'}}>Firma bilgisi bulunamadı.</div>
        )}

        <h3 className="section-title">Fırsatları Yakalayın</h3>
        {sent ? (
          <div style={{color:'#fff'}}>Teşekkürler! Kampanyalardan haberdar edeceğiz.</div>
        ) : (
          <form onSubmit={submit} style={{display:'grid',gap:12,maxWidth:520}}>
            <input placeholder="Ad Soyad" value={form.fullName} onChange={(e)=>setForm({...form, fullName:e.target.value})} required />
            <input placeholder="E-posta" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})} required />
            <input placeholder="Telefon" value={form.phone} onChange={(e)=>setForm({...form, phone:e.target.value})} />
            <button type="submit" className="submit-btn">Gönder</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default QrForm;


