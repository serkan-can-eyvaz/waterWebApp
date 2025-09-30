package com.waterwebapp.backend.dto;

public class StatisticsDto {
    private long totalCompanies;
    private long totalOrderQuantity;

    public StatisticsDto() {}

    public StatisticsDto(long totalCompanies, long totalOrderQuantity) {
        this.totalCompanies = totalCompanies;
        this.totalOrderQuantity = totalOrderQuantity;
    }

    public long getTotalCompanies() {
        return totalCompanies;
    }

    public void setTotalCompanies(long totalCompanies) {
        this.totalCompanies = totalCompanies;
    }

    public long getTotalOrderQuantity() {
        return totalOrderQuantity;
    }

    public void setTotalOrderQuantity(long totalOrderQuantity) {
        this.totalOrderQuantity = totalOrderQuantity;
    }
}
