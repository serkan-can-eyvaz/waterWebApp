package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.dto.SubscriptionDto;
import com.waterwebapp.backend.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.waterwebapp.backend.repository.SubscriptionRepository;
import java.util.List;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;
    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SubscriptionDto dto) {
        return ResponseEntity.ok(subscriptionService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<SubscriptionDto>> getAll() {
        // küçük projede basitçe tümünü repo'dan alalım ve minimal DTO'ya çevirmeden döndürelim yerine service yazılabilir
        return ResponseEntity.ok(
            subscriptionRepository.findAll().stream().map(s -> {
                SubscriptionDto dto = new SubscriptionDto();
                dto.setId(s.getId());
                dto.setFullName(s.getFullName());
                dto.setEmail(s.getEmail());
                dto.setPhone(s.getPhone());
                dto.setCompanyTaxNumber(s.getCompany() != null ? s.getCompany().getTaxNumber() : null);
                dto.setCreatedAt(s.getCreatedAt());
                return dto;
            }).toList()
        );
    }

    @GetMapping("/company/{taxNumber}")
    public ResponseEntity<List<SubscriptionDto>> byCompany(@PathVariable String taxNumber) {
        return ResponseEntity.ok(subscriptionService.listByCompanyTaxNumber(taxNumber));
    }
}


