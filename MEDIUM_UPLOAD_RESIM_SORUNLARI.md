# Upload Resim Sorunları ve Çözümleri - Teknik Dokümantasyon

## Tespit Edilen Sorunlar

### 1. FileController Mapping Sorunu
**Sorun:** Backend'de FileController hiç yüklenmiyordu
**Belirti:** docker logs aquashare-backend | grep -E "Mapped.*files" → Boş sonuç
**Çözüm:** FileController'a test endpoint eklendi

```
@GetMapping("/test")
public ResponseEntity<String> test() {
    return ResponseEntity.ok("FileController çalışıyor!");
}
```

### 2. Path Resolution Hatası - ANA SORUN
**Sorun:** FileStorageService.getFile() method'unda yanlış path hesaplama

**Yanlış Kod:**
```
// YANLIŞ - Çift uploads klasörü oluşturuyordu
Path path = Paths.get(uploadDir).resolve(filePath.substring(1));
// /app/uploads + uploads/slides/filename = /app/uploads/uploads/slides/filename ❌
```

**Doğru Kod:**
```
// DOĞRU - Tek uploads klasörü
String relativePath = filePath.substring("/uploads/".length());
Path path = Paths.get(uploadDir).resolve(relativePath);
// /app/uploads + slides/filename = /app/uploads/slides/filename ✅
```

### 3. Dosya İzinleri Sorunu
**Sorun:** Yeni yüklenen dosyalar root:root sahipli, backend 105:111 kullanıcısıyla çalışıyor
**Belirti:** 404 Not Found (dosya var ama okunamıyor)
**Çözüm:** FileStorageService'de otomatik izin ayarlama

```
Files.setPosixFilePermissions(targetPath, Set.of(
    PosixFilePermission.OWNER_READ,
    PosixFilePermission.OWNER_WRITE,
    PosixFilePermission.GROUP_READ,
    PosixFilePermission.OTHERS_READ
));
```

### 4. Content-Type Sorunu
**Sorun:** Tüm dosyalar image/jpeg olarak serve ediliyordu
**Çözüm:** Dosya uzantısına göre dinamik content-type

```
String contentType = "image/jpeg"; // default
if (filename.toLowerCase().endsWith(".png")) {
    contentType = "image/png";
} else if (filename.toLowerCase().endsWith(".svg")) {
    contentType = "image/svg+xml";
}
```

## Uygulanan Teknik Çözümler

### 1. FileStorageService Path Düzeltmesi
```
public byte[] getFile(String filePath) throws IOException {
    // /uploads/slides/filename -> slides/filename
    String relativePath = filePath.substring("/uploads/".length());
    Path path = Paths.get(uploadDir).resolve(relativePath);
    
    // DEBUG logging eklendi
    System.out.println("DEBUG: filePath = " + filePath);
    System.out.println("DEBUG: relativePath = " + relativePath);
    System.out.println("DEBUG: fullPath = " + path.toAbsolutePath());
    System.out.println("DEBUG: file exists = " + Files.exists(path));
    
    if (Files.exists(path)) {
        return Files.readAllBytes(path);
    }
    return null;
}
```

### 2. Application Properties Konfigürasyonu
```
# File storage paths
file.upload-dir=/app/uploads
file.logo-dir=/app/uploads/logos
file.slide-dir=/app/uploads/slides

# File upload limits
spring.servlet.multipart.max-file-size=20MB
spring.servlet.multipart.max-request-size=20MB
```

### 3. Docker Compose Volume Mount
```
volumes:
  - ./uploads:/app/uploads  # Persistent file storage
```

### 4. Nginx Configuration
```
location /uploads/ {
    proxy_pass http://aquashare-backend:8080;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## Debug Adımları

### 1. Backend Log Kontrolü
```
# FileController mapping kontrolü
docker logs aquashare-backend | grep -E "Mapped.*files"

# Tüm API mapping'leri
docker logs aquashare-backend | grep -E "Mapped.*api"
```

### 2. Dosya Varlığı Kontrolü
```
# Container içinde dosya kontrolü
docker exec -it aquashare-backend ls -la /app/uploads/slides/

# Dosya izinleri kontrolü
docker exec -it aquashare-backend ls -la /app/uploads/slides/ | head -5
```

### 3. Path Debug Logları
FileStorageService'deki DEBUG logları backend console'da görünecek:

```
DEBUG: filePath = /uploads/slides/1759267244235_image_(1).svg
DEBUG: relativePath = slides/1759267244235_image_(1).svg
DEBUG: fullPath = /app/uploads/slides/1759267244235_image_(1).svg
DEBUG: file exists = true/false
```

## Test Endpoint'leri

### 1. FileController Test
```
GET /api/files/test
Response: "FileController çalışıyor!"
```

### 2. Slide Test
```
GET /api/files/slides/{filename}
Response: Image file bytes with correct Content-Type
```

## Deploy Sonrası Kontroller

1. **FileController Test:** /api/files/test → 200 OK
2. **Slide Endpoint:** /api/files/slides/{filename} → 200 OK + Image
3. **Backend Logs:** DEBUG mesajları path'leri gösteriyor
4. **Frontend:** Slider'da resimler görünüyor

## Gelecek İyileştirmeler

1. **DEBUG logları kaldırılacak** (production'da)
2. **Error handling geliştirilecek**
3. **File caching eklenebilir**
4. **Image optimization (resize, compress)**

## Özet

**Ana Sorun:** FileStorageService'de path resolution hatası
**Çözüm:** /uploads/ prefix'ini doğru şekilde kaldırarak absolute path oluşturma
**Sonuç:** Resimler artık doğru path'ten serve ediliyor ve 404 hatası çözüldü

---

Bu dokümantasyon ileride benzer sorunlarla karşılaştığımızda hızlı çözüm için kullanılabilir.
