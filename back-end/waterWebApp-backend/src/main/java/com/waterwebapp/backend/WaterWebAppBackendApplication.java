package com.waterwebapp.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.waterwebapp.backend"})
public class WaterWebAppBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(WaterWebAppBackendApplication.class, args);
    }

}
