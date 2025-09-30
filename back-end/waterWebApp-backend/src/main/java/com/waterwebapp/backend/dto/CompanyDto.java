package com.waterwebapp.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

public class CompanyDto {
    
    @NotBlank(message = "Vergi numarası boş olamaz")
    @Pattern(regexp = "^[0-9]+$", message = "Vergi numarası sadece rakam içermelidir")
    private String taxNumber;
    
    @NotBlank(message = "Firma adı boş olamaz")
    private String companyName;
    
    private String taxOffice;
    
    @NotBlank(message = "Adres boş olamaz")
    private String address;
    
    private String instagramUrl;
    private String twitterUrl;
    private String linkedinUrl;
    
    @NotNull(message = "Sipariş adeti boş olamaz")
    @jakarta.validation.constraints.Min(value = 100, message = "Minimum 100 adet sipariş verebilirsiniz")
    private Integer orderQuantity;
    
    private String reference;
    
    private String logoUrl;
    private Boolean isActive = true;
    
    // Constructors
    public CompanyDto() {}
    
    public CompanyDto(String taxNumber, String companyName, String taxOffice, String address, 
                      String instagramUrl, String twitterUrl, String linkedinUrl, 
                      Integer orderQuantity, String reference, String logoUrl) {
        this.taxNumber = taxNumber;
        this.companyName = companyName;
        this.taxOffice = taxOffice;
        this.address = address;
        this.instagramUrl = instagramUrl;
        this.twitterUrl = twitterUrl;
        this.linkedinUrl = linkedinUrl;
        this.orderQuantity = orderQuantity;
        this.reference = reference;
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
    
    public String getReference() {
        return reference;
    }
    
    public void setReference(String reference) {
        this.reference = reference;
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
}
