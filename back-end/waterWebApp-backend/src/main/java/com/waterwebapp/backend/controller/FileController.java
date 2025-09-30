package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/files")
public class FileController {
    
    @Autowired
    private FileStorageService fileStorageService;
    
    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("FileController çalışıyor!");
    }
    
    @PostMapping("/upload/logo")
    public ResponseEntity<?> uploadLogo(@RequestParam("file") MultipartFile file,
                                      @RequestParam("taxNumber") String taxNumber) {
        try {
            String fileUrl = fileStorageService.saveLogoFile(file, taxNumber);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logo başarıyla yüklendi");
            response.put("fileUrl", fileUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Dosya yüklenirken hata oluştu: " + e.getMessage()));
        }
    }
    
    @PostMapping("/upload/slide")
    public ResponseEntity<?> uploadSlide(@RequestParam("file") MultipartFile file,
                                       @RequestParam("taxNumber") String taxNumber) {
        try {
            String fileUrl = fileStorageService.saveSlideFile(file, taxNumber);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Slide resmi başarıyla yüklendi");
            response.put("fileUrl", fileUrl);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Dosya yüklenirken hata oluştu: " + e.getMessage()));
        }
    }

    @GetMapping("/slides/{filename}")
    public ResponseEntity<byte[]> getSlide(@PathVariable String filename) {
        try {
            String filePath = "/uploads/slides/" + filename;
            byte[] fileBytes = fileStorageService.getFile(filePath);
            
            if (fileBytes != null) {
                // Content type belirle
                String contentType = "image/jpeg"; // default
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".svg")) {
                    contentType = "image/svg+xml";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                }
                
                return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(fileBytes);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/logos/{filename}")
    public ResponseEntity<byte[]> getLogo(@PathVariable String filename) {
        try {
            String filePath = "/uploads/logos/" + filename;
            byte[] fileBytes = fileStorageService.getFile(filePath);
            
            if (fileBytes != null) {
                // Content type belirle
                String contentType = "image/jpeg"; // default
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".svg")) {
                    contentType = "image/svg+xml";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                }
                
                return ResponseEntity.ok()
                    .header("Content-Type", contentType)
                    .body(fileBytes);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
