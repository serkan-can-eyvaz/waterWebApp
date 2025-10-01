package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.dto.SubscriptionDto;
import com.waterwebapp.backend.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody SubscriptionDto dto) {
        return ResponseEntity.ok(subscriptionService.create(dto));
    }
}


