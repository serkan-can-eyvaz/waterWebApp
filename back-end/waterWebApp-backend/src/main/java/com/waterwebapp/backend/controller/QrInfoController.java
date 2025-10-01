package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.dto.QrInfoDto;
import com.waterwebapp.backend.service.QrInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/qr-info")
public class QrInfoController {

    @Autowired
    private QrInfoService qrInfoService;

    @PostMapping("/upsert")
    public ResponseEntity<?> upsert(@RequestBody QrInfoDto dto) {
        return ResponseEntity.ok(qrInfoService.upsert(dto));
    }

    @GetMapping("/{taxNumber}")
    public ResponseEntity<?> get(@PathVariable String taxNumber) {
        Optional<QrInfoDto> dto = qrInfoService.findByTaxNumber(taxNumber);
        return dto.<ResponseEntity<?>>map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
}


