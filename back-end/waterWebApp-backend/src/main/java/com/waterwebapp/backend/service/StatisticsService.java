package com.waterwebapp.backend.service;

import com.waterwebapp.backend.dto.StatisticsDto;
import com.waterwebapp.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StatisticsService {

    @Autowired
    private CompanyRepository companyRepository;

    public StatisticsDto getDashboardStatistics() {
        long totalCompanies = companyRepository.count();
        long totalOrderQuantity = companyRepository.getTotalOrderQuantity();
        
        return new StatisticsDto(totalCompanies, totalOrderQuantity);
    }
}
