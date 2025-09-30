package com.waterwebapp.backend.service;

import com.waterwebapp.backend.dto.CompanyDto;
import com.waterwebapp.backend.entity.Company;
import com.waterwebapp.backend.repository.CompanyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class CompanyService {
    
    @Autowired
    private CompanyRepository companyRepository;
    
    public CompanyDto createCompany(CompanyDto companyDto) {
        Company company = new Company();
        mapDtoToEntity(companyDto, company);
        Company savedCompany = companyRepository.save(company);
        return mapEntityToDto(savedCompany);
    }
    
    public CompanyDto updateCompany(String taxNumber, CompanyDto companyDto) {
        Optional<Company> optionalCompany = companyRepository.findByTaxNumber(taxNumber);
        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            mapDtoToEntity(companyDto, company);
            Company savedCompany = companyRepository.save(company);
            return mapEntityToDto(savedCompany);
        }
        throw new RuntimeException("Firma bulunamadı: " + taxNumber);
    }
    
    public CompanyDto getCompanyByTaxNumber(String taxNumber) {
        Optional<Company> optionalCompany = companyRepository.findByTaxNumber(taxNumber);
        if (optionalCompany.isPresent()) {
            return mapEntityToDto(optionalCompany.get());
        }
        throw new RuntimeException("Firma bulunamadı: " + taxNumber);
    }
    
    public List<CompanyDto> getAllActiveCompanies() {
        List<Company> companies = companyRepository.findByIsActiveTrue();
        return companies.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }
    
    public List<CompanyDto> getAllCompanies() {
        List<Company> companies = companyRepository.findAll();
        return companies.stream()
                .map(this::mapEntityToDto)
                .collect(Collectors.toList());
    }
    
    public void deleteCompany(String taxNumber) {
        Optional<Company> optionalCompany = companyRepository.findByTaxNumber(taxNumber);
        if (optionalCompany.isPresent()) {
            Company company = optionalCompany.get();
            company.setIsActive(false);
            companyRepository.save(company);
        } else {
            throw new RuntimeException("Firma bulunamadı: " + taxNumber);
        }
    }
    
    public boolean existsByTaxNumber(String taxNumber) {
        return companyRepository.existsByTaxNumber(taxNumber);
    }
    
    public Long getActiveCompanyCount() {
        return companyRepository.countActiveCompanies();
    }
    
    public Long getTotalOrderQuantity() {
        Long total = companyRepository.sumActiveCompanyOrderQuantities();
        return total != null ? total : 0L;
    }
    
    private void mapDtoToEntity(CompanyDto dto, Company entity) {
        entity.setTaxNumber(dto.getTaxNumber());
        entity.setCompanyName(dto.getCompanyName());
        entity.setTaxOffice(dto.getTaxOffice());
        entity.setAddress(dto.getAddress());
        entity.setInstagramUrl(dto.getInstagramUrl());
        entity.setTwitterUrl(dto.getTwitterUrl());
        entity.setLinkedinUrl(dto.getLinkedinUrl());
        entity.setOrderQuantity(dto.getOrderQuantity());
        entity.setLogoUrl(dto.getLogoUrl());
        entity.setIsActive(dto.getIsActive());
    }
    
    private CompanyDto mapEntityToDto(Company entity) {
        CompanyDto dto = new CompanyDto();
        dto.setTaxNumber(entity.getTaxNumber());
        dto.setCompanyName(entity.getCompanyName());
        dto.setTaxOffice(entity.getTaxOffice());
        dto.setAddress(entity.getAddress());
        dto.setInstagramUrl(entity.getInstagramUrl());
        dto.setTwitterUrl(entity.getTwitterUrl());
        dto.setLinkedinUrl(entity.getLinkedinUrl());
        dto.setOrderQuantity(entity.getOrderQuantity());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setIsActive(entity.getIsActive());
        return dto;
    }
}
