package com.waterwebapp.backend.dto;

public class QrInfoDto {
    private String companyTaxNumber;
    private String companyName;
    private String address;
    private String instagramUrl;
    private String twitterUrl;
    private String linkedinUrl;

    public String getCompanyTaxNumber() { return companyTaxNumber; }
    public void setCompanyTaxNumber(String companyTaxNumber) { this.companyTaxNumber = companyTaxNumber; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getInstagramUrl() { return instagramUrl; }
    public void setInstagramUrl(String instagramUrl) { this.instagramUrl = instagramUrl; }
    public String getTwitterUrl() { return twitterUrl; }
    public void setTwitterUrl(String twitterUrl) { this.twitterUrl = twitterUrl; }
    public String getLinkedinUrl() { return linkedinUrl; }
    public void setLinkedinUrl(String linkedinUrl) { this.linkedinUrl = linkedinUrl; }
}


