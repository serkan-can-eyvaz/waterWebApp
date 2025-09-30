package com.waterwebapp.backend.repository;

import com.waterwebapp.backend.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CompanyRepository extends JpaRepository<Company, String> {
    
    Optional<Company> findByTaxNumber(String taxNumber);
    
    List<Company> findByIsActiveTrue();
    
    @Query("SELECT c FROM Company c WHERE c.isActive = true ORDER BY c.createdAt DESC")
    List<Company> findActiveCompaniesOrderByCreatedAt();
    
    @Query("SELECT COUNT(c) FROM Company c WHERE c.isActive = true")
    Long countActiveCompanies();
    
    @Query("SELECT SUM(c.orderQuantity) FROM Company c WHERE c.isActive = true")
    Long sumActiveCompanyOrderQuantities();
    
    boolean existsByTaxNumber(String taxNumber);
}
