package com.waterwebapp.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "companies")
public class Company {
    
    @Id
    @Column(name = "tax_number", unique = true, nullable = false)
    @NotBlank(message = "Vergi numarası boş olamaz")
    @Pattern(regexp = "^[0-9]+$", message = "Vergi numarası sadece rakam içermelidir")
    private String taxNumber;
    
    @Column(name = "company_name", nullable = false)
    @NotBlank(message = "Firma adı boş olamaz")
    private String companyName;
    
    @Column(name = "tax_office")
    private String taxOffice;
    
    @Column(name = "address", columnDefinition = "TEXT")
    @NotBlank(message = "Adres boş olamaz")
    private String address;
    
    @Column(name = "instagram_url")
    private String instagramUrl;
    
    @Column(name = "twitter_url")
    private String twitterUrl;
    
    @Column(name = "linkedin_url")
    private String linkedinUrl;
    
    @Column(name = "order_quantity")
    @NotNull(message = "Sipariş adeti boş olamaz")
    @jakarta.validation.constraints.Min(value = 100, message = "Minimum 100 adet sipariş verebilirsiniz")
    private Integer orderQuantity;
    
    @Column(name = "logo_url")
    private String logoUrl;
    
    @Column(name = "is_active")
    private Boolean isActive = true;
    
    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Slide> slides;
    
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Company() {}
    
    public Company(String taxNumber, String companyName, String taxOffice, String address, 
                   String instagramUrl, String twitterUrl, String linkedinUrl, 
                   Integer orderQuantity, String logoUrl) {
        this.taxNumber = taxNumber;
        this.companyName = companyName;
        this.taxOffice = taxOffice;
        this.address = address;
        this.instagramUrl = instagramUrl;
        this.twitterUrl = twitterUrl;
        this.linkedinUrl = linkedinUrl;
        this.orderQuantity = orderQuantity;
        this.logoUrl = logoUrl;
    }
    
    // Getters and Setters
    public String getTaxNumber() {
        return taxNumber;
    }
    
    public void setTaxNumber(String taxNumber) {
        this.taxNumber = taxNumber;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getTaxOffice() {
        return taxOffice;
    }
    
    public void setTaxOffice(String taxOffice) {
        this.taxOffice = taxOffice;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getInstagramUrl() {
        return instagramUrl;
    }
    
    public void setInstagramUrl(String instagramUrl) {
        this.instagramUrl = instagramUrl;
    }
    
    public String getTwitterUrl() {
        return twitterUrl;
    }
    
    public void setTwitterUrl(String twitterUrl) {
        this.twitterUrl = twitterUrl;
    }
    
    public String getLinkedinUrl() {
        return linkedinUrl;
    }
    
    public void setLinkedinUrl(String linkedinUrl) {
        this.linkedinUrl = linkedinUrl;
    }
    
    public Integer getOrderQuantity() {
        return orderQuantity;
    }
    
    public void setOrderQuantity(Integer orderQuantity) {
        this.orderQuantity = orderQuantity;
    }
    
    public String getLogoUrl() {
        return logoUrl;
    }
    
    public void setLogoUrl(String logoUrl) {
        this.logoUrl = logoUrl;
    }
    
    public Boolean getIsActive() {
        return isActive;
    }
    
    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
    
    public List<Slide> getSlides() {
        return slides;
    }
    
    public void setSlides(List<Slide> slides) {
        this.slides = slides;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
