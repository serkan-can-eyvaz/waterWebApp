package com.waterwebapp.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Value("${file.logo-dir}")
    private String logoDir;

    @Value("${file.slide-dir}")
    private String slideDir;

    public String saveLogoFile(MultipartFile file, String taxNumber) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş olamaz");
        }

        // Dosya uzantısını kontrol et
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageFile(originalFilename)) {
            throw new IllegalArgumentException("Geçersiz dosya formatı. Sadece JPG, PNG, SVG dosyaları kabul edilir");
        }

        // Dosya boyutunu kontrol et (5MB limit)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("Dosya boyutu 5MB'dan büyük olamaz");
        }

        // Upload dizinini oluştur
        Path logoPath = Paths.get(logoDir);
        if (!Files.exists(logoPath)) {
            Files.createDirectories(logoPath);
        }

        // Benzersiz dosya adı oluştur
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFileName = taxNumber + "_" + UUID.randomUUID().toString() + fileExtension;
        Path targetPath = logoPath.resolve(uniqueFileName);

        // Dosyayı kaydet
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Dosya izinlerini düzelt (105:111 backend kullanıcısı için)
        try {
            Files.setPosixFilePermissions(targetPath, java.util.Set.of(
                java.nio.file.attribute.PosixFilePermission.OWNER_READ,
                java.nio.file.attribute.PosixFilePermission.OWNER_WRITE,
                java.nio.file.attribute.PosixFilePermission.GROUP_READ,
                java.nio.file.attribute.PosixFilePermission.OTHERS_READ
            ));
        } catch (Exception e) {
            // İzin düzeltme hatası logla ama işlemi durdurma
            System.err.println("Dosya izinleri düzeltilemedi: " + e.getMessage());
        }

        // URL'yi oluştur
        return "/uploads/logos/" + uniqueFileName;
    }

    public String saveSlideFile(MultipartFile file, String taxNumber) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Dosya boş olamaz");
        }

        // Dosya uzantısını kontrol et
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !isValidImageFile(originalFilename)) {
            throw new IllegalArgumentException("Geçersiz dosya formatı. Sadece JPG, PNG, SVG dosyaları kabul edilir");
        }

        // Dosya boyutunu kontrol et (10MB limit)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new IllegalArgumentException("Dosya boyutu 10MB'dan büyük olamaz");
        }

        // Upload dizinini oluştur
        Path slidePath = Paths.get(slideDir);
        if (!Files.exists(slidePath)) {
            Files.createDirectories(slidePath);
        }

        // Benzersiz dosya adı oluştur
        String fileExtension = getFileExtension(originalFilename);
        String uniqueFileName = taxNumber + "_" + UUID.randomUUID().toString() + fileExtension;
        Path targetPath = slidePath.resolve(uniqueFileName);

        // Dosyayı kaydet
        Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

        // Dosya izinlerini ayarla (105:111 backend kullanıcısı)
        try {
            Files.setPosixFilePermissions(targetPath, java.util.Set.of(
                java.nio.file.attribute.PosixFilePermission.OWNER_READ,
                java.nio.file.attribute.PosixFilePermission.OWNER_WRITE,
                java.nio.file.attribute.PosixFilePermission.GROUP_READ,
                java.nio.file.attribute.PosixFilePermission.OTHERS_READ
            ));
        } catch (Exception e) {
            // İzin ayarlama hatası logla ama işlemi durdurma
            System.err.println("Dosya izinleri ayarlanırken hata: " + e.getMessage());
        }

        // URL'yi oluştur
        return "/uploads/slides/" + uniqueFileName;
    }

    public byte[] getFile(String filePath) throws IOException {
        // /uploads/slides/filename -> slides/filename
        String relativePath = filePath.substring("/uploads/".length());
        Path path = Paths.get(uploadDir).resolve(relativePath);
        
        System.out.println("DEBUG: filePath = " + filePath);
        System.out.println("DEBUG: relativePath = " + relativePath);
        System.out.println("DEBUG: fullPath = " + path.toAbsolutePath());
        System.out.println("DEBUG: file exists = " + Files.exists(path));
        
        if (Files.exists(path)) {
            return Files.readAllBytes(path);
        }
        return null;
    }

    private boolean isValidImageFile(String filename) {
        String extension = getFileExtension(filename).toLowerCase();
        return extension.equals(".jpg") || extension.equals(".jpeg") || 
               extension.equals(".png") || extension.equals(".svg");
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }
        return filename.substring(lastDotIndex);
    }
}
