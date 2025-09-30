package com.waterwebapp.backend.config;

import com.waterwebapp.backend.controller.StatisticsController;
import com.waterwebapp.backend.controller.CompanyController;
import com.waterwebapp.backend.controller.SlideController;
import com.waterwebapp.backend.controller.AuthController;
import com.waterwebapp.backend.controller.FileController;
import com.waterwebapp.backend.service.StatisticsService;
import com.waterwebapp.backend.service.CompanyService;
import com.waterwebapp.backend.service.SlideService;
import com.waterwebapp.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ControllerConfig {

    @Autowired
    private StatisticsService statisticsService;

    @Autowired
    private CompanyService companyService;

    @Autowired
    private SlideService slideService;

    @Autowired
    private AuthService authService;

    @Bean
    public StatisticsController statisticsController() {
        StatisticsController controller = new StatisticsController();
        controller.setStatisticsService(statisticsService);
        return controller;
    }

    @Bean
    public CompanyController companyController() {
        CompanyController controller = new CompanyController();
        controller.setCompanyService(companyService);
        return controller;
    }

    @Bean
    public SlideController slideController() {
        SlideController controller = new SlideController();
        controller.setSlideService(slideService);
        return controller;
    }

    @Bean
    public AuthController authController() {
        AuthController controller = new AuthController();
        controller.setAuthService(authService);
        return controller;
    }

    @Bean
    public FileController fileController() {
        return new FileController();
    }
}
