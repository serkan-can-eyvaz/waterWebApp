package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.dto.SlideDto;
import com.waterwebapp.backend.service.SlideService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/slides")
public class SlideController {
    
    private SlideService slideService;
    
    @Autowired
    public void setSlideService(SlideService slideService) {
        this.slideService = slideService;
    }
    
    @PostMapping("/upload")
    public ResponseEntity<?> uploadSlide(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Dosya boş olamaz"));
            }

            // Dosyayı kaydet ve URL al - boşlukları underscore ile değiştir
            String originalFileName = file.getOriginalFilename();
            String cleanFileName = originalFileName.replaceAll("\\s+", "_");
            String fileName = System.currentTimeMillis() + "_" + cleanFileName;
            String uploadDir = "uploads/slides/";
            java.nio.file.Path uploadPath = java.nio.file.Paths.get(uploadDir);
            
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            
            java.nio.file.Path filePath = uploadPath.resolve(fileName);
            java.nio.file.Files.copy(file.getInputStream(), filePath, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            
            String imageUrl = "/api/files/slides/" + fileName;

            // Basit slide oluştur
            SlideDto slideDto = new SlideDto();
            slideDto.setTitle(file.getOriginalFilename());
            slideDto.setDescription("Yüklenen slide");
            slideDto.setDisplayOrder(0);
            slideDto.setImageUrl(imageUrl);
            // Company bilgisi olmadan slide oluştur

            SlideDto createdSlide = slideService.createSlide(slideDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSlide);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Slide yüklenirken hata oluştu: " + e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createSlide(@Valid @RequestBody SlideDto slideDto) {
        try {
            SlideDto createdSlide = slideService.createSlide(slideDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdSlide);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Slide oluşturulurken hata oluştu: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<SlideDto>> getAllActiveSlides() {
        List<SlideDto> slides = slideService.getAllActiveSlides();
        return ResponseEntity.ok(slides);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<SlideDto>> getAllSlidesIncludingInactive() {
        List<SlideDto> slides = slideService.getAllSlides();
        return ResponseEntity.ok(slides);
    }
    
    @GetMapping("/company/{taxNumber}")
    public ResponseEntity<List<SlideDto>> getSlidesByCompanyTaxNumber(@PathVariable String taxNumber) {
        List<SlideDto> slides = slideService.getSlidesByCompanyTaxNumber(taxNumber);
        return ResponseEntity.ok(slides);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<?> getSlideById(@PathVariable Long id) {
        try {
            SlideDto slide = slideService.getSlideById(id);
            return ResponseEntity.ok(slide);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSlide(@PathVariable Long id, 
                                       @Valid @RequestBody SlideDto slideDto) {
        try {
            SlideDto updatedSlide = slideService.updateSlide(id, slideDto);
            return ResponseEntity.ok(updatedSlide);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSlide(@PathVariable Long id) {
        try {
            slideService.deleteSlide(id);
            return ResponseEntity.ok(Map.of("message", "Slide başarıyla silindi"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
