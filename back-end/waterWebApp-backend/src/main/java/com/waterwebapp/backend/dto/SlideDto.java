package com.waterwebapp.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SlideDto {
    
    private Long id;
    
    @NotBlank(message = "Başlık boş olamaz")
    private String title;
    
    private String description;
    
    @NotBlank(message = "Resim URL'si boş olamaz")
    private String imageUrl;
    
    private Integer displayOrder = 0;
    private Boolean isActive = true;
    private String companyTaxNumber;
    
    // Constructors
    public SlideDto() {}
    
    public SlideDto(String title, String description, String imageUrl, Integer displayOrder, String companyTaxNumber) {
        this.title = title;
        this.description = description;
        this.imageUrl = imageUrl;
        this.displayOrder = displayOrder;
        this.companyTaxNumber = companyTaxNumber;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getImageUrl() {
        return imageUrl;
    }
    
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
    
    public Integer getDisplayOrder() {
        return displayOrder;
    }
    
    public void setDisplayOrder(Integer displayOrder) {
        this.displayOrder = displayOrder;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public String getCompanyTaxNumber() {
        return companyTaxNumber;
    }
    
    public void setCompanyTaxNumber(String companyTaxNumber) {
        this.companyTaxNumber = companyTaxNumber;
    }
}
