# 🌊 birdamlapaylas.com - Water Web Application

birdamlapaylas.com, Konya'da başlayan ve tüm Türkiye'ye yayılmayı hedefleyen sosyal sorumluluk projesidir. Suyu herkes için ulaşılabilir kılarken, sponsor markalara da güçlü bir görünürlük sağlar.

## 🚀 Proje Özellikleri

### Frontend (React)
- ✅ **Modern UI/UX:** Responsive tasarım, mavi tonlarda su teması
- ✅ **Slider Yönetimi:** Otomatik değişen görseller
- ✅ **Form Sistemi:** Firma başvuru formu
- ✅ **Admin Panel:** Slide ve firma yönetimi
- ✅ **Logo Upload:** JPG, PNG, SVG formatları

### Backend (Spring Boot)
- ✅ **RESTful API:** Modern API tasarımı
- ✅ **PostgreSQL:** Güvenilir veritabanı
- ✅ **File Upload:** Resim yükleme sistemi
- ✅ **Authentication:** Admin giriş sistemi
- ✅ **Validation:** Veri doğrulama

### DevOps
- ✅ **Docker:** Containerization
- ✅ **Nginx:** Reverse proxy ve static file serving
- ✅ **Docker Compose:** Multi-container orchestration

## 📋 Sistem Gereksinimleri

- Java 17+
- Node.js 16+
- PostgreSQL 15+
- Docker & Docker Compose

## 🛠️ Kurulum

### 1. Repository'yi Klonlayın
```bash
git clone https://github.com/yourusername/aquashare-waterweb.git
cd aquashare-waterweb
```

### 2. Backend Kurulumu
```bash
cd back-end/waterWebApp-backend

# Docker ile çalıştırma
docker-compose up -d

# Veya manuel kurulum
mvn clean install
mvn spring-boot:run
```

### 3. Frontend Kurulumu
```bash
cd front-end

# Dependencies yükleme
npm install

# Development server
npm start
```

## 🐳 Docker ile Çalıştırma

```bash
# Tüm servisleri başlat
docker-compose up -d

# Logları izle
docker-compose logs -f

# Servisleri durdur
docker-compose down
```

## 📊 Servis Portları

- **Frontend:** http://localhost:80
- **Backend API:** http://localhost:8080
- **Database:** localhost:5432

## 🔑 Admin Giriş Bilgileri

- **Email:** test@example.com
- **Şifre:** 123456

## 📁 Proje Yapısı

```
aquashare-waterweb/
├── front-end/                 # React uygulaması
│   ├── src/
│   │   ├── components/        # UI bileşenleri
│   │   ├── pages/            # Sayfa bileşenleri
│   │   └── styles/           # CSS dosyaları
│   └── public/               # Static dosyalar
├── back-end/waterWebApp-backend/
│   ├── src/main/java/        # Java kaynak kodları
│   ├── src/main/resources/   # Konfigürasyon dosyaları
│   ├── uploads/              # Yüklenen dosyalar
│   ├── nginx/                # Nginx konfigürasyonu
│   ├── Dockerfile            # Backend container
│   └── docker-compose.yml    # Servis orkestrasyonu
└── README.md
```

## 🎯 Ana Özellikler

### 🏢 Firma Başvuru Sistemi
- Firma bilgileri formu
- Logo yükleme (JPG, PNG, SVG)
- Minimum 100 adet sipariş validasyonu
- Vergi numarası unique ID olarak kullanılıyor

### 📸 Slide Yönetimi
- Admin panelde slide yükleme
- Otomatik 3 saniye değişim
- Responsive slider tasarımı

### 🔐 Admin Panel
- Email/şifre ile giriş
- Slide yönetimi
- Firma bilgilerini görüntüleme
- Token tabanlı authentication

## 🛡️ Güvenlik

- CORS konfigürasyonu
- Input validation
- SQL injection koruması
- File upload güvenliği
- Non-root Docker containers

## 📈 Performans

- Gzip compression
- Static file caching
- Database indexing
- Multi-stage Docker builds
- Optimized React builds

## 🔧 Geliştirme

### Backend API Endpoints
```
POST   /api/auth/login          # Admin girişi
POST   /api/companies           # Firma kaydı
GET    /api/companies           # Firma listesi
POST   /api/slides/upload       # Slide yükleme
GET    /api/slides              # Aktif slide'lar
POST   /api/files/upload/logo   # Logo yükleme
```

### Frontend Routing
```
/                    # Ana sayfa
/proje-detayi        # Proje detayları
/admin               # Admin panel
/login               # Admin girişi
```

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📞 İletişim

- **Website:** [birdamlapaylas.com](https://www.biryudumiyilikharekit.com)
- **Telefon:** 0 533 333 33 33
- **Email:** info@aquashare.com

---

**Bir damla paylaş, dünyayı değiştir! 🌊💙**
