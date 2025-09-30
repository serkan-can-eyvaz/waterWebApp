package com.waterwebapp.backend.controller;

import com.waterwebapp.backend.dto.StatisticsDto;
import com.waterwebapp.backend.service.StatisticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/statistics")
public class StatisticsController {

    @Autowired
    private StatisticsService statisticsService;

    @GetMapping("/dashboard")
    public ResponseEntity<StatisticsDto> getDashboardStatistics() {
        StatisticsDto statistics = statisticsService.getDashboardStatistics();
        return ResponseEntity.ok(statistics);
    }
}
