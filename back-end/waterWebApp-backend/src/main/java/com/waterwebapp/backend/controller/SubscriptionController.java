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
    public ResponseEntity<List<?>> getAll() {
        return ResponseEntity.ok(subscriptionRepository.findAll());
    }

    @GetMapping("/company/{taxNumber}")
    public ResponseEntity<List<?>> byCompany(@PathVariable String taxNumber) {
        return ResponseEntity.ok(subscriptionRepository.findByCompany_TaxNumber(taxNumber));
    }
}


