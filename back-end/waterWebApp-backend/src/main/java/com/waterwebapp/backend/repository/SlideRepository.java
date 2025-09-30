package com.waterwebapp.backend.repository;

import com.waterwebapp.backend.entity.Slide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SlideRepository extends JpaRepository<Slide, Long> {
    
    List<Slide> findByIsActiveTrueOrderByDisplayOrderAsc();
    
    List<Slide> findByCompanyTaxNumberAndIsActiveTrueOrderByDisplayOrderAsc(String companyTaxNumber);
    
    @Query("SELECT s FROM Slide s WHERE s.isActive = true ORDER BY s.displayOrder ASC, s.createdAt ASC")
    List<Slide> findAllActiveSlidesOrdered();
    
    @Query("SELECT s FROM Slide s WHERE s.company.taxNumber = :taxNumber AND s.isActive = true ORDER BY s.displayOrder ASC")
    List<Slide> findActiveSlidesByCompanyTaxNumber(@Param("taxNumber") String taxNumber);
}
