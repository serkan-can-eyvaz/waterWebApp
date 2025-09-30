package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.dto.CompanyDto;
import com.waterwebapp.backend.service.CompanyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/companies")
public class CompanyController {
    
    private CompanyService companyService;
    
    @Autowired
    public void setCompanyService(CompanyService companyService) {
        this.companyService = companyService;
    }
    
    @PostMapping
    public ResponseEntity<?> createCompany(@Valid @RequestBody CompanyDto companyDto) {
        try {
            if (companyService.existsByTaxNumber(companyDto.getTaxNumber())) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Bu vergi numarası ile kayıtlı firma zaten mevcut"));
            }
            
            CompanyDto createdCompany = companyService.createCompany(companyDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCompany);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", "Firma oluşturulurken hata oluştu: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<CompanyDto>> getAllCompanies() {
        List<CompanyDto> companies = companyService.getAllActiveCompanies();
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/all")
    public ResponseEntity<List<CompanyDto>> getAllCompaniesIncludingInactive() {
        List<CompanyDto> companies = companyService.getAllCompanies();
        return ResponseEntity.ok(companies);
    }
    
    @GetMapping("/{taxNumber}")
    public ResponseEntity<?> getCompanyByTaxNumber(@PathVariable String taxNumber) {
        try {
            CompanyDto company = companyService.getCompanyByTaxNumber(taxNumber);
            return ResponseEntity.ok(company);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/{taxNumber}")
    public ResponseEntity<?> updateCompany(@PathVariable String taxNumber, 
                                         @Valid @RequestBody CompanyDto companyDto) {
        try {
            CompanyDto updatedCompany = companyService.updateCompany(taxNumber, companyDto);
            return ResponseEntity.ok(updatedCompany);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @DeleteMapping("/{taxNumber}")
    public ResponseEntity<?> deleteCompany(@PathVariable String taxNumber) {
        try {
            companyService.deleteCompany(taxNumber);
            return ResponseEntity.ok(Map.of("message", "Firma başarıyla silindi"));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getCompanyStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("activeCompanyCount", companyService.getActiveCompanyCount());
        stats.put("totalOrderQuantity", companyService.getTotalOrderQuantity());
        return ResponseEntity.ok(stats);
    }
    
    @GetMapping("/exists/{taxNumber}")
    public ResponseEntity<Map<String, Boolean>> checkCompanyExists(@PathVariable String taxNumber) {
        boolean exists = companyService.existsByTaxNumber(taxNumber);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}
