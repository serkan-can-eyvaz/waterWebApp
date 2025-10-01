package com.waterwebapp.backend.dto;

public class SubscriptionDto {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String companyTaxNumber;
    private java.time.LocalDateTime createdAt;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    public String getCompanyTaxNumber() { return companyTaxNumber; }
    public void setCompanyTaxNumber(String companyTaxNumber) { this.companyTaxNumber = companyTaxNumber; }
    public java.time.LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(java.time.LocalDateTime createdAt) { this.createdAt = createdAt; }
}


