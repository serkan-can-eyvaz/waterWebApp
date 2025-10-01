# Water Web App Backend

Bu proje, birdamlapaylas.com su paylaşım projesi için Spring Boot tabanlı REST API backend uygulamasıdır.

## 🚀 Özellikler

- **Firma Yönetimi**: Vergi numarası ile firma kayıt sistemi
- **Slide Yönetimi**: Admin panelde slide resim yükleme
- **Dosya Yükleme**: Logo ve slide resim yükleme sistemi
- **REST API**: Tam CRUD operasyonları
- **PostgreSQL**: Güçlü veritabanı desteği
- **CORS**: Frontend entegrasyonu için CORS desteği

## 🛠️ Teknolojiler

- **Spring Boot 3.2.0**
- **Spring Data JPA**
- **PostgreSQL**
- **Maven**
- **Java 17**

## 📋 Gereksinimler

- Java 17+
- Maven 3.6+
- PostgreSQL 12+

## 🗄️ Veritabanı Kurulumu

1. PostgreSQL'i yükleyin ve çalıştırın
2. `database_setup.sql` dosyasını çalıştırın:

```sql
-- Veritabanı oluştur
CREATE DATABASE waterwebapp;
CREATE USER waterwebapp_user WITH PASSWORD 'waterwebapp_pass';
GRANT ALL PRIVILEGES ON DATABASE waterwebapp TO waterwebapp_user;
```

## 🚀 Çalıştırma

1. Projeyi klonlayın
2. Veritabanı bağlantı bilgilerini kontrol edin (`application.properties`)
3. Uygulamayı çalıştırın:

```bash
mvn spring-boot:run
```

Uygulama `http://localhost:8080` adresinde çalışacaktır.

## 📡 API Endpoints

### Firma Yönetimi
- `GET /api/companies` - Aktif firmaları listele
- `GET /api/companies/all` - Tüm firmaları listele
- `GET /api/companies/{taxNumber}` - Firma detayı
- `POST /api/companies` - Yeni firma oluştur
- `PUT /api/companies/{taxNumber}` - Firma güncelle
- `DELETE /api/companies/{taxNumber}` - Firma sil
- `GET /api/companies/stats` - İstatistikler
- `GET /api/companies/exists/{taxNumber}` - Firma varlığını kontrol et

### Slide Yönetimi
- `GET /api/slides` - Aktif slide'ları listele
- `GET /api/slides/all` - Tüm slide'ları listele
- `GET /api/slides/company/{taxNumber}` - Firma slide'ları
- `GET /api/slides/{id}` - Slide detayı
- `POST /api/slides` - Yeni slide oluştur
- `PUT /api/slides/{id}` - Slide güncelle
- `DELETE /api/slides/{id}` - Slide sil

### Dosya Yükleme
- `POST /api/files/upload/logo` - Logo yükle
- `POST /api/files/upload/slide` - Slide resmi yükle

## 📊 Veri Modeli

### Company (Firma)
- `taxNumber` (String, Primary Key) - Vergi numarası (10 haneli)
- `companyName` (String) - Firma adı
- `taxOffice` (String) - Vergi dairesi
- `address` (String) - Adres
- `instagramUrl` (String) - Instagram URL
- `twitterUrl` (String) - Twitter URL
- `linkedinUrl` (String) - LinkedIn URL
- `orderQuantity` (Integer) - Sipariş adeti
- `logoUrl` (String) - Logo URL
- `isActive` (Boolean) - Aktif durumu

### Slide
- `id` (Long, Primary Key) - Slide ID
- `title` (String) - Başlık
- `description` (String) - Açıklama
- `imageUrl` (String) - Resim URL
- `displayOrder` (Integer) - Görüntüleme sırası
- `isActive` (Boolean) - Aktif durumu
- `company` (Company) - Bağlı firma

## 🔧 Konfigürasyon

### application.properties
```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/waterwebapp
spring.datasource.username=waterwebapp_user
spring.datasource.password=waterwebapp_pass

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS
spring.web.cors.allowed-origins=http://localhost:3000
```

## 📁 Proje Yapısı

```
src/
├── main/
│   ├── java/com/waterwebapp/backend/
│   │   ├── entity/          # JPA Entity sınıfları
│   │   ├── repository/      # Repository katmanı
│   │   ├── service/         # Service katmanı
│   │   ├── controller/      # REST Controller'lar
│   │   └── dto/             # Data Transfer Objects
│   └── resources/
│       └── application.properties
└── test/
    └── java/com/waterwebapp/backend/
```

## 🧪 Test

```bash
mvn test
```

## 📝 Notlar

- Vergi numarası 10 haneli olmalıdır
- Dosya yükleme limiti: Logo 5MB, Slide 10MB
- Desteklenen dosya formatları: JPG, PNG, GIF
- CORS sadece `http://localhost:3000` için açık
- Tüm API'ler JSON formatında yanıt verir
