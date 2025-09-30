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

        // URL'yi oluştur
        return "/uploads/slides/" + uniqueFileName;
    }

    public byte[] getFile(String filePath) throws IOException {
        Path path = Paths.get(uploadDir).resolve(filePath.substring(1)); // /uploads/... -> uploads/...
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
