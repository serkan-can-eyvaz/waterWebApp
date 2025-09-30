package com.waterwebapp.backend.config;

import com.waterwebapp.backend.controller.StatisticsController;
import com.waterwebapp.backend.controller.CompanyController;
import com.waterwebapp.backend.controller.SlideController;
import com.waterwebapp.backend.controller.AuthController;
import com.waterwebapp.backend.controller.FileController;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ControllerConfig {

    @Bean
    public StatisticsController statisticsController() {
        return new StatisticsController();
    }

    @Bean
    public CompanyController companyController() {
        return new CompanyController();
    }

    @Bean
    public SlideController slideController() {
        return new SlideController();
    }

    @Bean
    public AuthController authController() {
        return new AuthController();
    }

    @Bean
    public FileController fileController() {
        return new FileController();
    }
}
