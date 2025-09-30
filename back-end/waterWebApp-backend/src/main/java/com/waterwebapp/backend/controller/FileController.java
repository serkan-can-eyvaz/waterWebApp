package com.waterwebapp.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Map;
import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileController {
    
    private static final String UPLOAD_DIR = "uploads/";
    private static final String LOGO_DIR = "uploads/logos/";
    private static final String SLIDE_DIR = "uploads/slides/";
    
    @PostMapping("/upload/logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file,
                                      @RequestParam("taxNumber") String taxNumber) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Dosya boş olamaz"));
            }
            
            // Dosya uzantısını kontrol et
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !isValidImageFile(originalFilename)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Geçersiz dosya formatı. Sadece JPG, PNG, GIF dosyaları kabul edilir"));
            }
            
            // Dosya boyutunu kontrol et (5MB limit)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Dosya boyutu 5MB'dan büyük olamaz"));
            }
            
            // Upload dizinini oluştur
            Path logoPath = Paths.get(LOGO_DIR);
            if (!Files.exists(logoPath)) {
                Files.createDirectories(logoPath);
            }
            
            // Benzersiz dosya adı oluştur
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFileName = taxNumber + "_" + UUID.randomUUID().toString() + fileExtension;
            Path targetPath = logoPath.resolve(uniqueFileName);
            
            // Dosyayı kaydet
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            // URL'yi oluştur
            String fileUrl = "/uploads/logos/" + uniqueFileName;
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logo başarıyla yüklendi");
            response.put("fileUrl", fileUrl);
            response.put("fileName", uniqueFileName);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Dosya yüklenirken hata oluştu: " + e.getMessage()));
        }
    }
    
    @PostMapping("/upload/slide")
    public ResponseEntity<?> uploadSlide(@RequestParam("file") MultipartFile file,
                                       @RequestParam("taxNumber") String taxNumber) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Dosya boş olamaz"));
            }
            
            // Dosya uzantısını kontrol et
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || !isValidImageFile(originalFilename)) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Geçersiz dosya formatı. Sadece JPG, PNG, GIF dosyaları kabul edilir"));
            }
            
            // Dosya boyutunu kontrol et (10MB limit)
            if (file.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Dosya boyutu 10MB'dan büyük olamaz"));
            }
            
            // Upload dizinini oluştur
            Path slidePath = Paths.get(SLIDE_DIR);
            if (!Files.exists(slidePath)) {
                Files.createDirectories(slidePath);
            }
            
            // Benzersiz dosya adı oluştur
            String fileExtension = getFileExtension(originalFilename);
            String uniqueFileName = taxNumber + "_" + UUID.randomUUID().toString() + fileExtension;
            Path targetPath = slidePath.resolve(uniqueFileName);
            
            // Dosyayı kaydet
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            
            // URL'yi oluştur
            String fileUrl = "/uploads/slides/" + uniqueFileName;
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Slide resmi başarıyla yüklendi");
            response.put("fileUrl", fileUrl);
            response.put("fileName", uniqueFileName);
            
            return ResponseEntity.ok(response);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Dosya yüklenirken hata oluştu: " + e.getMessage()));
        }
    }
    
    private boolean isValidImageFile(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return extension.equals(".jpg") || extension.equals(".jpeg") || 
               extension.equals(".png") || extension.equals(".gif");
    }
    
    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }

        @GetMapping("/slides/{filename}")
        public ResponseEntity<byte[]> getSlide(@PathVariable String filename) {
            try {
                // Önce orijinal dosya adını dene
                Path slidePath = Paths.get(SLIDE_DIR, filename);
                if (!Files.exists(slidePath)) {
                    // Dosya bulunamazsa, mevcut dosyaları ara
                    File slideDir = new File(SLIDE_DIR);
                    if (slideDir.exists() && slideDir.isDirectory()) {
                        File[] files = slideDir.listFiles();
                        if (files != null) {
                            for (File file : files) {
                                // Dosya adını temizle ve karşılaştır
                                String cleanFilename = file.getName().replaceAll("\\s+", "_");
                                if (cleanFilename.equals(filename)) {
                                    slidePath = file.toPath();
                                    break;
                                }
                            }
                        }
                    }
                }
                
                if (Files.exists(slidePath)) {
                    byte[] imageBytes = Files.readAllBytes(slidePath);
                    String contentType = Files.probeContentType(slidePath);
                    if (contentType == null) {
                        contentType = "image/jpeg";
                    }
                    return ResponseEntity.ok()
                        .header("Content-Type", contentType)
                        .body(imageBytes);
                } else {
                    return ResponseEntity.notFound().build();
                }
            } catch (IOException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }
}
