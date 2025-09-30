package com.waterwebapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = {"com.waterwebapp.backend"})
public class WaterWebAppBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(WaterWebAppBackendApplication.class, args);
    }

}
