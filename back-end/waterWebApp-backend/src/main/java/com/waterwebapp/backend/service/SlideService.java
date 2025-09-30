package com.waterwebapp.backend.service;

import com.waterwebapp.backend.dto.SlideDto;
import com.waterwebapp.backend.entity.Company;
import com.waterwebapp.backend.entity.Slide;
import com.waterwebapp.backend.repository.CompanyRepository;
import com.waterwebapp.backend.repository.SlideRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class SlideService {
    
    @Autowired
    private SlideRepository slideRepository;
    
    @Autowired
    private CompanyRepository companyRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    public SlideDto createSlide(SlideDto slideDto) {
        Slide slide = new Slide();
        mapDtoToEntity(slideDto, slide);
        
        // Company opsiyonel - eğer companyTaxNumber varsa ve geçerliyse bağla
        if (slideDto.getCompanyTaxNumber() != null && !slideDto.getCompanyTaxNumber().isEmpty()) {
            Optional<Company> optionalCompany = companyRepository.findByTaxNumber(slideDto.getCompanyTaxNumber());
            if (optionalCompany.isPresent()) {
                slide.setCompany(optionalCompany.get());
            }
        }
        
        Slide savedSlide = slideRepository.save(slide);
        return mapEntityToDto(savedSlide);
    }
    
    public SlideDto updateSlide(Long id, SlideDto slideDto) {
        Optional<Slide> optionalSlide = slideRepository.findById(id);
        if (optionalSlide.isPresent()) {
            Slide slide = optionalSlide.get();
            mapDtoToEntity(slideDto, slide);
            
            if (slideDto.getCompanyTaxNumber() != null) {
                Optional<Company> optionalCompany = companyRepository.findByTaxNumber(slideDto.getCompanyTaxNumber());
                if (optionalCompany.isPresent()) {
                    slide.setCompany(optionalCompany.get());
                }
            }
            
            Slide savedSlide = slideRepository.save(slide);
            return mapEntityToDto(savedSlide);
        }
        throw new RuntimeException("Slide bulunamadı: " + id);
    }
    
    public SlideDto getSlideById(Long id) {
        Optional<Slide> optionalSlide = slideRepository.findById(id);
        if (optionalSlide.isPresent()) {
            return mapEntityToDto(optionalSlide.get());
        }
        throw new RuntimeException("Slide bulunamadı: " + id);
    }
    
    public List<SlideDto> getAllActiveSlides() {
        List<Slide> slides = slideRepository.findByIsActiveTrueOrderByDisplayOrderAsc();
        return slides.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }
    
    public List<SlideDto> getSlidesByCompanyTaxNumber(String taxNumber) {
        List<Slide> slides = slideRepository.findByCompanyTaxNumberAndIsActiveTrueOrderByDisplayOrderAsc(taxNumber);
        return slides.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }
    
    public List<SlideDto> getAllSlides() {
        List<Slide> slides = slideRepository.findAll();
        return slides.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }
    
    public void deleteSlide(Long id) {
        Optional<Slide> optionalSlide = slideRepository.findById(id);
        if (optionalSlide.isPresent()) {
            Slide slide = optionalSlide.get();
            
            // Önce dosyayı sil
            if (slide.getImageUrl() != null && !slide.getImageUrl().isEmpty()) {
                try {
                    deleteSlideFile(slide.getImageUrl());
                } catch (IOException e) {
                    // Dosya silme hatası logla ama işlemi durdurma
                    System.err.println("Dosya silinirken hata: " + e.getMessage());
                }
            }
            
            // Veritabanından tamamen sil
            slideRepository.delete(slide);
        } else {
            throw new RuntimeException("Slide bulunamadı: " + id);
        }
    }
    
    private void deleteSlideFile(String imageUrl) throws IOException {
        if (imageUrl != null && imageUrl.startsWith("/uploads/slides/")) {
            String filename = imageUrl.substring("/uploads/slides/".length());
            Path filePath = Paths.get("/app/uploads/slides/" + filename);
            
            if (Files.exists(filePath)) {
                Files.delete(filePath);
            }
        }
    }
    
    private void mapDtoToEntity(SlideDto dto, Slide entity) {
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setImageUrl(dto.getImageUrl());
        entity.setDisplayOrder(dto.getDisplayOrder());
        entity.setIsActive(dto.getIsActive());
    }
    
    private SlideDto mapEntityToDto(Slide entity) {
        SlideDto dto = new SlideDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setImageUrl(entity.getImageUrl());
        dto.setDisplayOrder(entity.getDisplayOrder());
        dto.setIsActive(entity.getIsActive());
        if (entity.getCompany() != null) {
            dto.setCompanyTaxNumber(entity.getCompany().getTaxNumber());
        }
        return dto;
    }
}
